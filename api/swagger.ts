import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Print3D API",
      version: "1.0.0",
      description: "Documentação da API de gerenciamento de filamentos e impressões 3D",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
  },
  // Como rodamos da raiz, o caminho exato para ele achar os comentários é este:
  apis: ["./api/server.ts", "./api/*.ts"], 
};
const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("Documentação do Swagger disponível em http://localhost:3000/docs");
}