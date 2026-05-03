# AgilePro

Plataforma de gerenciamento de projetos ágeis com Dashboard, Projetos, Sprints (Kanban) e Relatórios.

## Tecnologias

- React 18
- React Router DOM v6
- Recharts (gráficos)
- Lucide React (ícones)
- CSS Modules
- Vite

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Estrutura do projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Layout.jsx    # Sidebar + Outlet
│   ├── Modal.jsx     # Modal genérico
│   ├── Badge.jsx     # Badges de status/tipo
│   ├── KpiCard.jsx   # Cards de métricas
│   └── ProgressBar.jsx
├── context/
│   └── AppContext.jsx # Estado global (projetos, sprints, tarefas)
├── data/
│   └── mockData.js   # Dados iniciais mockados
├── pages/
│   ├── Dashboard.jsx
│   ├── Projetos.jsx
│   ├── Sprints.jsx   # Kanban board
│   └── Relatorios.jsx
├── App.jsx           # Rotas
├── main.jsx          # Entry point
└── index.css         # Variáveis CSS globais
```

## Funcionalidades

- **Dashboard**: KPIs ao vivo, sprints ativas com progresso, feed de atividades, resumo de projetos
- **Projetos**: Listagem em grid, busca em tempo real, criação de novos projetos via modal
- **Sprints**: Board Kanban com 4 colunas, filtro por projeto, avançar tarefas entre colunas, criar nova tarefa e nova sprint
- **Relatórios**: Gráficos de progresso por projeto (barra), distribuição de tarefas (pizza/donut), velocidade das sprints (linha), performance da equipe (barra horizontal)

## Próximos passos sugeridos

- Integrar backend Node.js/Express com JWT
- Banco de dados (PostgreSQL ou MongoDB)
- Drag and drop no Kanban (react-beautiful-dnd)
- Autenticação de usuários
- Notificações em tempo real (WebSocket)
