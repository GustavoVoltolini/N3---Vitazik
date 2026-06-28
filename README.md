# Print3D Manager

Sistema de gerenciamento para estoque de filamentos e controle de impressões 3D, desenvolvido para otimizar o fluxo de trabalho e controle de materiais.

## Tecnologias Utilizadas

- **Frontend:** React, Tailwind CSS, Lucide React
- **API:** Node.js com suporte a execução via `tsx`
- **Banco de Dados:** Postgresql via ORM Prisma v7, hospedado no Supabase

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- Gerenciador de pacotes (npm ou yarn)

## Como Rodar o Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

### 1. Clonar o repositório

git clone https://github.com/GustavoVoltolini/N3---Vitazik
cd N3---Vitazik

### 2. Instalar as dependências

npm install

### 3. Iniciar a API

cd api
npx tsx watch server.ts

### 4. Iniciar o Frontend

npm run dev

### 5. Após sucesso ao iniciar o Frontend, abrir o site local

http://localhost:5173/
