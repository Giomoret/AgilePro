# AgilePro — Sistema de Gestão Ágil

O **AgilePro** é uma plataforma completa de gerenciamento de projetos baseada na metodologia Scrum. O sistema integra um **frontend React** com um **backend Node.js/Express** e banco de dados **MySQL**, permitindo que equipes organizem fluxos de trabalho através de quadros Kanban, gestão de sprints e controle rigoroso de permissões, com foco em uma experiência moderna e persistência real de dados.

---

## 🚀 Funcionalidades

### Autenticação e Usuários
- Login com autenticação **JWT** e senhas criptografadas com **bcrypt**
- Cadastro de novos usuários com e-mail e senha
- Upload de **foto de avatar** por usuário
- Cargos diferenciados: **Administrador**, **Scrum Master**, **Product Owner**, **Dev / Membro**
- Controle de acesso baseado em cargo (RBAC)

### Projetos
- CRUD completo de projetos integrado ao banco MySQL
- Atribuição de membros por projeto
- **Etiquetas** personalizáveis (Frontend, Backend, Design, Bug, Urgente, Melhoria)
- **Arquivar e restaurar** projetos
- Filtro por status e etiqueta

### Sprints e Kanban
- Quadro Kanban com **Drag and Drop** entre colunas (A fazer / Em progresso / Concluído)
- Criação e edição de tarefas com título, data limite, prioridade e responsáveis
- **Subtarefas** com checklist individual
- **Comentários** por tarefa com autor e data
- **Encerrar sprint**: move automaticamente tarefas não concluídas para a próxima sprint

### Relatórios e Dashboard
- Dashboard com KPIs em tempo real (projetos, tarefas, eficiência)
- Gráfico de distribuição de status (donut chart)
- Progresso ponderado por projeto
- **Burndown chart** por sprint
- **Exportar relatório em CSV** (geral e por projeto)

---

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Uso |
|---|---|
| React.js + Vite | Interface e bundler |
| React Router DOM | Roteamento e proteção de rotas |
| React Context API | Estado global |
| @dnd-kit | Drag and Drop no Kanban |
| Lucide React | Ícones |
| CSS Modules | Estilização |

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor e API REST |
| MySQL2 | Banco de dados relacional |
| JWT (jsonwebtoken) | Autenticação por token |
| bcryptjs | Criptografia de senhas |
| Multer | Upload de arquivos (avatars) |
| dotenv | Variáveis de ambiente |
| nodemon | Reload automático em desenvolvimento |

---

## ⚙️ Como Executar

### Pré-requisitos
- Node.js instalado
- MySQL instalado (Workbench ou equivalente)

### 1. Clone o repositório
```bash
git clone https://github.com/Giomoret/AgilePro.git
cd AgilePro
```

### 2. Configure e inicie o Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com suas credenciais do MySQL:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=agilepro
JWT_SECRET=sua_chave_secreta
PORT=3001
```

Execute o script SQL no MySQL Workbench para criar o banco:
```bash
# Abra o arquivo database.sql no Workbench e execute
```

Inicie o servidor:
```bash
npm run dev
```
O backend sobe em `http://localhost:3001`

### 3. Inicie o Frontend
```bash
# Em outro terminal, na raiz do projeto
cd AgilePro
npm install
npm run dev
```
O frontend sobe em `http://localhost:5173`

### 4. Acesso inicial
| Campo | Valor |
|---|---|
| E-mail | `admin@agilepro.com` |
| Senha | `admin123` |

---

## 📡 Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Login, retorna JWT |

### Usuários
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/usuarios` | Lista todos | 🔒 |
| GET | `/usuarios/:id` | Busca por ID | 🔒 |
| POST | `/usuarios` | Cadastra novo | ❌ |
| PUT | `/usuarios/:id` | Atualiza | 🔒 |
| DELETE | `/usuarios/:id` | Remove | 🔒 |
| POST | `/usuarios/:id/avatar` | Upload de foto | 🔒 |

### Projetos
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/projetos` | Lista todos | 🔒 |
| GET | `/projetos/:id` | Busca por ID | 🔒 |
| POST | `/projetos` | Cria novo | 🔒 |
| PUT | `/projetos/:id` | Atualiza | 🔒 |
| DELETE | `/projetos/:id` | Remove | 🔒 |

### Tarefas
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/tarefas` | Lista por projeto/sprint | 🔒 |
| POST | `/tarefas` | Cria nova | 🔒 |
| PUT | `/tarefas/:id` | Atualiza | 🔒 |
| DELETE | `/tarefas/:id` | Remove | 🔒 |

---

## 📁 Estrutura do Projeto

```
AgilePro/
├── backend/
│   ├── src/
│   │   ├── index.js              # Servidor Express
│   │   ├── db.js                 # Conexão MySQL
│   │   ├── middlewares/
│   │   │   └── auth.js           # Middleware JWT
│   │   └── routes/
│   │       ├── auth.js           # Autenticação
│   │       ├── usuarios.js       # CRUD Usuários + Avatar
│   │       ├── projetos.js       # CRUD Projetos
│   │       └── tarefas.js        # CRUD Tarefas
│   ├── uploads/                  # Avatars enviados
│   ├── database.sql              # Script de criação do banco
│   └── .env.example              # Modelo de variáveis de ambiente
│
└── src/
    ├── components/               # Layout, Modal, KpiCard, etc.
    ├── context/
    │   └── AppContext.jsx         # Estado global + chamadas à API
    ├── pages/
    │   ├── Dashboard.jsx          # KPIs e gráficos em tempo real
    │   ├── Projetos.jsx           # Gestão de projetos
    │   ├── Sprints.jsx            # Kanban + subtarefas + comentários
    │   ├── Relatorios.jsx         # Burndown + exportar CSV
    │   ├── Perfis.jsx             # Gestão de usuários + avatar
    │   ├── Login.jsx              # Autenticação
    │   └── Register.jsx           # Cadastro
    └── data/
        └── mockData.js            # Dados iniciais de exemplo
```

---

## 👨‍💻 Desenvolvedor

**Giovanni Alvarenga Moretto**
*Estudante de Análise e Desenvolvimento de Sistemas — Fatec Guaratinguetá*
