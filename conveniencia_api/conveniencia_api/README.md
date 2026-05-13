# Conveniência API

API em Node.js com arquitetura MVC para gerenciamento de produtos de uma conveniência.
Atividade prática para os alunos implementarem e testarem seus conhecimentos.

## Como usar

1. Crie o banco de dados executando o arquivo `database.sql` no seu SGBD (MySQL).
2. Configure o arquivo `.env` com suas credenciais do banco.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ``` (ou `node src/server.js`)

## Endpoints Principais
- `GET /api/produtos` - Lista os produtos
- `POST /api/produtos` - Cadastra produto
