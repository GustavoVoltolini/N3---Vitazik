import express from "express";
import cors from "cors";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import client from "prom-client";

const getSafeConnectionString = (url: string) => {
  const u = new URL(url);
  u.password = encodeURIComponent(u.password);
  return u.toString();
};

const rawConnectionString = process.env.DATABASE_URL;

if (!rawConnectionString) {
  throw new Error("DATABASE_URL não configurada no .env!");
}

const pool = new Pool({
  connectionString: getSafeConnectionString(rawConnectionString),
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

// --- Observabilidade: Prometheus ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duração das requisições HTTP em segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const dbHealthGauge = new client.Gauge({
  name: "db_connection_healthy",
  help: "Status da conexão com o banco de dados (1=saudável, 0=falha)",
  registers: [register],
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

app.get("/metrics", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    dbHealthGauge.set(1);
  } catch {
    dbHealthGauge.set(0);
  }
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/health", (req, res) => {
  res.json({ status: "Online!" });
});

// ROTAS DO CRUD
app.get("/filamentos", async (req, res) => {
  try {
    const filamentos = await prisma.filament.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.json(filamentos);
  } catch {
    res.status(500).json({ error: "Erro ao listar filamentos." });
  }
});

app.post("/filamentos", async (req, res) => {
  try {
    const novoFilamento = await prisma.filament.create({
      data: {
        material: req.body.material,
        brand: req.body.brand,
        colorName: req.body.colorName,
        colorHex: req.body.colorHex,
        currentWeight: Number(req.body.currentWeight),
        totalWeight: Number(req.body.totalWeight),
      },
    });
    res.status(201).json(novoFilamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar." });
  }
});

app.put("/filamentos/:id", async (req, res) => {
  try {
    const filamentoAtualizado = await prisma.filament.update({
      where: { id: req.params.id },
      data: {
        material: req.body.material,
        brand: req.body.brand,
        colorName: req.body.colorName,
        colorHex: req.body.colorHex,
        currentWeight: Number(req.body.currentWeight),
        totalWeight: Number(req.body.totalWeight),
      },
    });
    res.json(filamentoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar." });
  }
});

app.delete("/filamentos/:id", async (req, res) => {
  try {
    await prisma.filament.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Erro ao deletar." });
  }
});

app.get("/impressoes", async (req, res) => {
  try {
    const impressoes = await prisma.printJob.findMany({
      include: { filament: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(impressoes);
  } catch {
    res.status(500).json({ error: "Erro ao listar impressões." });
  }
});

app.post("/impressoes", async (req, res) => {
  try {
    const weightGrams = Number(req.body.weightGrams);
    const filamentId = String(req.body.filamentId);

    const novaImpressao = await prisma.$transaction(async (tx) => {
      const filamento = await tx.filament.findUnique({
        where: { id: filamentId },
      });

      if (!filamento) {
        throw new Error("FILAMENT_NOT_FOUND");
      }

      if (filamento.currentWeight < weightGrams) {
        throw new Error("INSUFFICIENT_WEIGHT");
      }

      await tx.filament.update({
        where: { id: filamentId },
        data: { currentWeight: filamento.currentWeight - weightGrams },
      });

      return tx.printJob.create({
        data: {
          partName: req.body.partName,
          weightGrams,
          timeHours: Number(req.body.timeHours),
          status: req.body.status,
          filamentId,
        },
        include: { filament: true },
      });
    });

    res.status(201).json(novaImpressao);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "FILAMENT_NOT_FOUND") {
      return res.status(404).json({ error: "Filamento não encontrado." });
    }
    if (message === "INSUFFICIENT_WEIGHT") {
      return res
        .status(400)
        .json({ error: "Peso insuficiente no filamento selecionado." });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar impressão." });
  }
});

app.put("/impressoes/:id", async (req, res) => {
  try {
    const newWeightGrams = Number(req.body.weightGrams);
    const newFilamentId = String(req.body.filamentId);

    const impressaoAtualizada = await prisma.$transaction(async (tx) => {
      const original = await tx.printJob.findUnique({
        where: { id: req.params.id },
      });

      if (!original) {
        throw new Error("PRINT_NOT_FOUND");
      }

      if (original.filamentId === newFilamentId) {
        const diff = newWeightGrams - original.weightGrams;
        if (diff !== 0) {
          const filamento = await tx.filament.findUnique({
            where: { id: newFilamentId },
          });
          if (!filamento) {
            throw new Error("FILAMENT_NOT_FOUND");
          }
          if (filamento.currentWeight < diff) {
            throw new Error("INSUFFICIENT_WEIGHT");
          }
          await tx.filament.update({
            where: { id: newFilamentId },
            data: { currentWeight: filamento.currentWeight - diff },
          });
        }
      } else {
        const novoFilamento = await tx.filament.findUnique({
          where: { id: newFilamentId },
        });
        if (!novoFilamento) {
          throw new Error("FILAMENT_NOT_FOUND");
        }
        if (novoFilamento.currentWeight < newWeightGrams) {
          throw new Error("INSUFFICIENT_WEIGHT");
        }

        const antigoFilamento = await tx.filament.findUnique({
          where: { id: original.filamentId },
        });
        if (antigoFilamento) {
          await tx.filament.update({
            where: { id: original.filamentId },
            data: {
              currentWeight:
                antigoFilamento.currentWeight + original.weightGrams,
            },
          });
        }

        await tx.filament.update({
          where: { id: newFilamentId },
          data: { currentWeight: novoFilamento.currentWeight - newWeightGrams },
        });
      }

      return tx.printJob.update({
        where: { id: req.params.id },
        data: {
          partName: req.body.partName,
          weightGrams: newWeightGrams,
          timeHours: Number(req.body.timeHours),
          status: req.body.status,
          filamentId: newFilamentId,
        },
        include: { filament: true },
      });
    });

    res.json(impressaoAtualizada);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "PRINT_NOT_FOUND") {
      return res.status(404).json({ error: "Impressão não encontrada." });
    }
    if (message === "FILAMENT_NOT_FOUND") {
      return res.status(404).json({ error: "Filamento não encontrado." });
    }
    if (message === "INSUFFICIENT_WEIGHT") {
      return res
        .status(400)
        .json({ error: "Peso insuficiente no filamento selecionado." });
    }
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar impressão." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
