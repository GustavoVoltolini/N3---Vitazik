import express from "express";
import cors from "cors";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

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

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Online!" });
});

// ROTAS DO CRUD
app.get("/filamentos", async (req, res) => {
  try {
    const filamentos = await prisma.filament.findMany();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
