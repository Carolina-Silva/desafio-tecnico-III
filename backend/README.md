# Desafio Técnico - API de Pacientes e Exames (Backend)

Esta é a API backend para o sistema de gerenciamento de pacientes e exames médicos. Ela foi construída com Node.js, Fastify e Prisma.

## ✨ Funcionalidades

- CRUD completo para Pacientes.
- CRUD (parcial) para Exames, com lógica de deleção.
- Sistema de paginação para listagens.
- Garantia de idempotência na criação de exames.
- Arquitetura modular e em camadas (Rotas, Controllers, Serviços).
- Suíte de testes de integração com Jest e Supertest.

## 💻 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Fastify** (Framework web)
- **Prisma** (ORM)
- **MySQL** (Banco de Dados)
- **Jest** & **Supertest** (Testes)

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18+)
- npm ou similar
- Uma instância do MySQL rodando

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    cd backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    - Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
    - Preencha a `DATABASE_URL` com as suas credenciais do MySQL.
    ```
    DATABASE_URL="mysql://root:sua_senha@localhost:3306/desafio"
    ```

4.  **Rode as Migrations do Prisma:**
    Este comando irá criar as tabelas no seu banco de dados.
    ```bash
    npx prisma migrate dev
    ```

### Executando a Aplicação

- **Modo de Desenvolvimento (com auto-reload):**
  ```bash
  npm run dev
  ```
  A API estará disponível em `http://localhost:3000`.

- **Rodar os Testes:**
  ```bash
  npm test
  ```

## 📄 Endpoints da API

- `POST /pacientes`: Cria um novo paciente.
- `GET /pacientes`: Lista todos os pacientes (com paginação: `?page=1&pageSize=10`).
- `GET /pacientes/:id`: Busca um paciente por ID.
- `PUT /pacientes/:id`: Atualiza um paciente.
- `DELETE /pacientes/:id`: Deleta um paciente.
- `POST /exames`: Cria um novo exame.
- `GET /exames`: Lista todos os exames (com paginação).
- `DELETE /exames/:id`: Deleta um exame.