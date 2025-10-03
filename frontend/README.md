# Desafio Técnico - Interface de Pacientes e Exames (Frontend)

Esta é a aplicação frontend para o sistema de gerenciamento de pacientes e exames, construída com a versão mais recente do Angular (Standalone).

## ✨ Funcionalidades

-   Interface completa para CRUD de Pacientes (Listar, Criar, Editar, Deletar).
-   Interface para Cadastrar, Listar e Deletar Exames.
-   Listas com paginação.
-   Formulários Reativos com validação visual.
-   Sistema de notificações (toasts) para feedback ao usuário.
-   Tratamento de erro de rede com opção de "Tentar Novamente".
-   Suíte de testes de componente e serviço com Karma/Jasmine.

## 💻 Tecnologias Utilizadas

-   **Angular** (Standalone)
-   **TypeScript**
-   **SCSS**
-   **RxJS**
-   `ngx-toastr` (Notificações)
-   `SweetAlert2` (Modais de confirmação)
-   **Karma** & **Jasmine** (Testes)

## 🚀 Como Rodar o Projeto

### Pré-requisitos
-   Node.js (v18+)
-   npm ou similar
-   A **API do Backend** deve estar rodando em `http://localhost:3000`.

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

### Executando a Aplicação

- **Modo de Desenvolvimento:**
    O comando abaixo irá iniciar o servidor de desenvolvimento em `http://localhost:4200`. A aplicação recarrega automaticamente após qualquer mudança nos arquivos.
    ```bash
    npm start
    ```
    *A aplicação usa um proxy (`proxy.conf.json`) para redirecionar as chamadas de API para o backend, evitando problemas de CORS.*

- **Rodar os Testes:**
    ```bash
    ng test
    ```
    Este comando executa os testes de unidade e de componente via Karma.