# 🧪 Guia de Testes da API — Thunder Client

Este guia descreve como testar todos os endpoints da API do **AgilePro** utilizando o **Thunder Client**, **Insomnia** ou **Postman**.

> ⚠️ Certifique-se de que o backend está rodando em `http://localhost:3001` antes de iniciar os testes.

---

## 🔑 Passo 1 — Autenticação (Obrigatório)

Todas as rotas protegidas exigem um token JWT no header. Comece sempre pelo login.

### `POST /auth/login`

| Campo | Valor |
|---|---|
| Método | `POST` |
| URL | `http://localhost:3001/auth/login` |
| Body | JSON |

```json
{
  "email": "admin@agilepro.com",
  "senha": "admin123"
}
```

**Resposta esperada (`200 OK`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@agilepro.com",
    "cargo": "admin"
  }
}
```

> 📋 Copie o valor do campo `token` e adicione no header de todas as próximas requisições:
> - **Key:** `Authorization`
> - **Value:** `Bearer <seu_token_aqui>`

---

## 👤 Usuários

### `GET /usuarios` — Listar todos

| Campo | Valor |
|---|---|
| Método | `GET` |
| URL | `http://localhost:3001/usuarios` |
| Header | `Authorization: Bearer <token>` |

**Resposta esperada (`200 OK`):** lista de usuários cadastrados.

---

### `POST /usuarios` — Cadastrar novo

| Campo | Valor |
|---|---|
| Método | `POST` |
| URL | `http://localhost:3001/usuarios` |
| Header | Não necessário |
| Body | JSON |

```json
{
  "nome": "João Teste",
  "email": "joao@teste.com",
  "senha": "123456",
  "cargo": "Scrum Master"
}
```

**Resposta esperada (`201 Created`):**
```json
{
  "mensagem": "Usuário criado com sucesso!",
  "id": 2
}
```

---

### `PUT /usuarios/:id` — Atualizar usuário

| Campo | Valor |
|---|---|
| Método | `PUT` |
| URL | `http://localhost:3001/usuarios/2` |
| Header | `Authorization: Bearer <token>` |
| Body | JSON |

```json
{
  "nome": "João Atualizado",
  "cargo": "Product Owner"
}
```

**Resposta esperada (`200 OK`):**
```json
{
  "mensagem": "Usuário atualizado com sucesso!"
}
```

---

### `DELETE /usuarios/:id` — Remover usuário

| Campo | Valor |
|---|---|
| Método | `DELETE` |
| URL | `http://localhost:3001/usuarios/2` |
| Header | `Authorization: Bearer <token>` |

**Resposta esperada (`200 OK`):**
```json
{
  "mensagem": "Usuário deletado com sucesso!"
}
```

> ⚠️ Não é possível deletar o próprio usuário logado.

---

## 📁 Projetos

### `GET /projetos` — Listar todos

| Campo | Valor |
|---|---|
| Método | `GET` |
| URL | `http://localhost:3001/projetos` |
| Header | `Authorization: Bearer <token>` |

**Resposta esperada (`200 OK`):** lista de projetos com membros e etiquetas.

---

### `POST /projetos` — Criar projeto

| Campo | Valor |
|---|---|
| Método | `POST` |
| URL | `http://localhost:3001/projetos` |
| Header | `Authorization: Bearer <token>` |
| Body | JSON |

```json
{
  "nome": "Projeto Apresentação",
  "descricao": "Projeto criado durante a apresentação",
  "status": "Ativo",
  "cor": "#534AB7",
  "etiquetas": ["Backend", "Frontend"],
  "membros": []
}
```

**Resposta esperada (`201 Created`):**
```json
{
  "mensagem": "Projeto criado com sucesso!",
  "id": 1
}
```

---

### `PUT /projetos/:id` — Atualizar projeto

| Campo | Valor |
|---|---|
| Método | `PUT` |
| URL | `http://localhost:3001/projetos/1` |
| Header | `Authorization: Bearer <token>` |
| Body | JSON |

```json
{
  "nome": "Projeto Atualizado",
  "status": "Arquivado",
  "etiquetas": ["Backend"]
}
```

**Resposta esperada (`200 OK`):**
```json
{
  "mensagem": "Projeto atualizado com sucesso!"
}
```

---

### `DELETE /projetos/:id` — Remover projeto

| Campo | Valor |
|---|---|
| Método | `DELETE` |
| URL | `http://localhost:3001/projetos/1` |
| Header | `Authorization: Bearer <token>` |

**Resposta esperada (`200 OK`):**
```json
{
  "mensagem": "Projeto deletado com sucesso!"
}
```

---

## ✅ Tarefas

### `GET /tarefas` — Listar por projeto e sprint

| Campo | Valor |
|---|---|
| Método | `GET` |
| URL | `http://localhost:3001/tarefas?projeto_id=1&sprint=1` |
| Header | `Authorization: Bearer <token>` |

**Resposta esperada (`200 OK`):** lista de tarefas com subtarefas, comentários e responsáveis.

---

### `POST /tarefas` — Criar tarefa

| Campo | Valor |
|---|---|
| Método | `POST` |
| URL | `http://localhost:3001/tarefas` |
| Header | `Authorization: Bearer <token>` |
| Body | JSON |

```json
{
  "titulo": "Tarefa de Apresentação",
  "prioridade": "alta",
  "status": "a-fazer",
  "sprint": "1",
  "projeto_id": 1,
  "data_limite": "2026-06-10",
  "responsaveis": [],
  "subtarefas": [],
  "comentarios": []
}
```

**Resposta esperada (`201 Created`):**
```json
{
  "mensagem": "Tarefa criada com sucesso!",
  "id": 1
}
```

---

### `PUT /tarefas/:id` — Atualizar tarefa

| Campo | Valor |
|---|---|
| Método | `PUT` |
| URL | `http://localhost:3001/tarefas/1` |
| Header | `Authorization: Bearer <token>` |
| Body | JSON |

```json
{
  "status": "concluido",
  "prioridade": "media",
  "subtarefas": [
    { "id": 1, "texto": "Subtarefa de exemplo", "feita": true }
  ]
}
```

**Resposta esperada (`200 OK`):**
```json
{
  "mensagem": "Tarefa atualizada com sucesso!"
}
```

---

### `DELETE /tarefas/:id` — Remover tarefa

| Campo | Valor |
|---|---|
| Método | `DELETE` |
| URL | `http://localhost:3001/tarefas/1` |
| Header | `Authorization: Bearer <token>` |

**Resposta esperada (`200 OK`):**
```json
{
  "mensagem": "Tarefa deletada com sucesso!"
}
```

---

## 📋 Resumo das Rotas

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/login` | Login | ❌ |
| GET | `/usuarios` | Listar usuários | 🔒 |
| POST | `/usuarios` | Cadastrar usuário | ❌ |
| PUT | `/usuarios/:id` | Atualizar usuário | 🔒 |
| DELETE | `/usuarios/:id` | Remover usuário | 🔒 |
| GET | `/projetos` | Listar projetos | 🔒 |
| POST | `/projetos` | Criar projeto | 🔒 |
| PUT | `/projetos/:id` | Atualizar projeto | 🔒 |
| DELETE | `/projetos/:id` | Remover projeto | 🔒 |
| GET | `/tarefas` | Listar tarefas | 🔒 |
| POST | `/tarefas` | Criar tarefa | 🔒 |
| PUT | `/tarefas/:id` | Atualizar tarefa | 🔒 |
| DELETE | `/tarefas/:id` | Remover tarefa | 🔒 |

---
