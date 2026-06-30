# Print3D Manager

Sistema de gerenciamento para estoque de filamentos e controle de impressões 3D, desenvolvido para otimizar o fluxo de trabalho e controle de materiais.

## Integrantes do Grupo

- Gustavo Voltolini
- Kauan Kaestner
- Ruan Klen
- Vitor Mayer

## Descrição do Sistema

O Print3D Manager resolve o problema de controle de estoque e rastreamento de trabalhos em ambientes de impressão 3D. Sem um sistema centralizado, é difícil saber quanto filamento resta em cada carretel e qual material foi consumido em cada peça produzida.

O sistema possui dois CRUDs com relacionamento direto entre si:

- **Filamento** representa um carretel físico no estoque, com material (PLA, PETG, ABS etc.), marca, cor e peso disponível.
- **Impressão** representa uma peça que foi ou será produzida, vinculada obrigatoriamente a um filamento. Ao registrar uma impressão, o sistema desconta automaticamente o peso consumido do carretel correspondente.

### Roteiro de Navegação

**Tela de Filamentos**

1. Ao abrir o sistema, a aba **Filamentos** é exibida por padrão com todos os carretéis cadastrados.
2. Clique em **Novo Filamento** para abrir o formulário de cadastro. Preencha material, marca, nome da cor, cor visual e pesos inicial e total. Clique em **Salvar Filamento**.
3. Passe o mouse sobre um cartão para revelar os botões de **Editar** (lápis) e **Excluir** (lixeira).
4. A barra de progresso em cada cartão indica o percentual restante. Quando abaixo de 20%, a barra fica vermelha.

**Tela de Impressões**

1. Clique na aba **Impressões** no topo da tela.
2. Clique em **Nova Impressão** para abrir o formulário. Selecione o filamento desejado, informe o nome da peça, gramas consumidas, tempo estimado e status. Clique em **Salvar Impressão**.
3. O sistema valida se o filamento selecionado possui peso suficiente antes de confirmar o registro.
4. Passe o mouse sobre uma linha da tabela para revelar o botão de **Editar**. Ao editar o peso ou trocar o filamento, o sistema reconcilia automaticamente os estoques envolvidos.

## Tecnologias Utilizadas

- **Frontend:** React, Tailwind CSS, Lucide React
- **API:** Node.js com Express, executado via `tsx`
- **Banco de Dados:** PostgreSQL via ORM Prisma v7, hospedado no Supabase
- **Observabilidade:** prom-client, Prometheus e Grafana

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/) (para rodar Prometheus e Grafana)
- Gerenciador de pacotes npm

## Como Rodar o Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

### 1. Clonar o repositório

```bash
git clone https://github.com/GustavoVoltolini/N3---Vitazik
cd N3---Vitazik
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar o banco de dados

Crie o arquivo `api/.env` com o seguinte conteúdo (substituindo pelos dados do seu banco PostgreSQL):

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/banco?pgbouncer=true"
DIRECT_URL="postgresql://usuario:senha@host:porta/banco"
```

Em seguida, gere o cliente Prisma:

```bash
npx prisma generate
```

### 4. Iniciar a API

Em um terminal, a partir da raiz do projeto:

```bash
npx tsx watch api/server.ts
```

A API ficará disponível em `http://localhost:3000`.

### 5. Iniciar o Frontend

Em outro terminal:

```bash
npm run dev
```

### 6. Acessar o sistema

```
http://localhost:5173/
```

## Observabilidade (Prometheus + Grafana)

### 1. Subir os containers

Com a API já rodando, execute na raiz do projeto:

```bash
docker-compose up -d
```

### 2. Verificar coleta de métricas

Acesse `http://localhost:9090/targets` e confirme que o target `print3d-api` está com status **UP**.

### 3. Configurar datasource no Grafana

1. Acesse `http://localhost:3001`
2. Faça login com as credenciais abaixo
3. Vá em **Connections → Data sources → Add data source**
4. Selecione **Prometheus**
5. Em **URL**, insira `http://prometheus:9090`
6. Clique em **Save & test**

### 4. Importar dashboard

1. Vá em **Dashboards → Import**
2. Insira o ID `11159` e clique em **Load**
3. Selecione o datasource Prometheus criado acima e clique em **Import**

### Credenciais do Grafana

| Campo | Valor |
|-------|-------|
| Usuário | `admin` |
| Senha | `admin` |

### URLs locais

| Serviço | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3000` |
| Métricas (raw) | `http://localhost:3000/metrics` |
| Prometheus | `http://localhost:9090` |
| Grafana | `http://localhost:3001` |

Documentação da API (Swagger)

O projeto conta com documentação interativa da API utilizando Swagger (OpenAPI 3.0).

A documentação permite visualizar, testar e entender todos os endpoints do sistema de forma rápida e interativa.

🔗 Acesso

Após iniciar a API, acesse:

http://localhost:3000/docs
📌 Funcionalidades documentadas

A API possui os seguintes módulos documentados:

🧵 Filamentos
GET /filamentos → Lista todos os filamentos
POST /filamentos → Cria um novo filamento
PUT /filamentos/{id} → Atualiza um filamento existente
DELETE /filamentos/{id} → Remove um filamento
🖨 Impressões
GET /impressoes → Lista todas as impressões
POST /impressoes → Cria uma nova impressão
PUT /impressoes/{id} → Atualiza uma impressão existente
DELETE /impressoes/{id} → Remove uma impressão
⚙️ Tecnologias da documentação
swagger-jsdoc
swagger-ui-express
OpenAPI 3.0
🧪 Como testar
Acesse http://localhost:3000/docs
Escolha um endpoint
Clique em Try it out
Execute a requisição e veja a resposta da API em tempo real
