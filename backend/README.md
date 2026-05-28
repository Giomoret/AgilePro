# AgilePro — Backend API

API REST desenvolvida com **Node.js**, **Express** e **MySQL**.

## 🚀 Como rodar

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```
Edite o `.env` com os dados do seu MySQL:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=agilepro
JWT_SECRET=qualquer_string_secreta
PORT=3001
```

### 3. Criar o banco de dados
Abra o MySQL e execute o arquivo `database.sql`:
```bash
mysql -u root -p < database.sql
```
Ou cole o conteúdo do arquivo no MySQL Workbench / DBeaver.

### 4. Iniciar o servidor
```bash
npm run dev   # com nodemon (recarrega automático)
# ou
npm start     # produção
```

O servidor sobe em: `http://localhost:3001`

---

## 📡 Endpoints

### Autenticação

| Método | Rota          | Descrição         | Auth? |
|--------|---------------|-------------------|-------|
| POST   | /auth/login   | Login do usuário  | ❌    |

**Body do login:**
```json
{
  "email": "admin@agilepro.com",
  "senha": "admin123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGc...",
  "usuario": { "id": 1, "nome": "Administrador", "email": "...", "cargo": "admin" }
}
```

---

### Usuários

> ⚠️ As rotas marcadas com 🔒 exigem o header:
> `Authorization: Bearer <token>`

| Método | Rota            | Descrição                  | Auth? |
|--------|-----------------|----------------------------|-------|
| GET    | /usuarios       | Lista todos os usuários    | 🔒    |
| GET    | /usuarios/:id   | Busca usuário por ID       | 🔒    |
| POST   | /usuarios       | Cria novo usuário          | ❌    |
| PUT    | /usuarios/:id   | Atualiza usuário           | 🔒    |
| DELETE | /usuarios/:id   | Remove usuário             | 🔒    |

**POST /usuarios — Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "cargo": "membro"
}
```

**PUT /usuarios/:id — Body (campos opcionais):**
```json
{
  "nome": "João Atualizado",
  "cargo": "gerente"
}
```

---

## 🧪 Testando com Insomnia / Postman / Thunder Client

1. Faça POST em `/auth/login` para obter o token
2. Copie o token da resposta
3. Nas demais requisições, adicione o header:
   - **Key:** `Authorization`
   - **Value:** `Bearer <seu_token_aqui>`

---

## 📁 Estrutura

```
backend/
├── src/
│   ├── index.js              ← Servidor Express
│   ├── db.js                 ← Conexão MySQL
│   ├── middlewares/
│   │   └── auth.js           ← Middleware JWT
│   └── routes/
│       ├── auth.js           ← POST /auth/login
│       └── usuarios.js       ← CRUD /usuarios
├── database.sql              ← Script do banco
├── .env.example              ← Modelo de variáveis
├── .gitignore
└── package.json
```
