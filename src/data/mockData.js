export const initialProjects = [
  {
    id: 1,
    name: 'Sistema de E-commerce',
    description: 'Plataforma completa de vendas online com carrinho, pagamentos e gestão de produtos',
    members: 4,
    createdAt: '14/01/2026',
    color: '#534AB7',
    progress: 17,
  },
  {
    id: 2,
    name: 'App Mobile Fitness',
    description: 'Aplicativo de acompanhamento de treinos e nutrição',
    members: 3,
    createdAt: '31/01/2026',
    color: '#1D9E75',
    progress: 25,
  },
  {
    id: 3,
    name: 'Portal Educacional',
    description: 'Plataforma de ensino à distância com cursos e certificações',
    members: 5,
    createdAt: '09/03/2026',
    color: '#7F77DD',
    progress: 40,
  },
]

export const initialSprints = [
  { id: 1, name: 'Sprint 2 – Catálogo', projectId: 1, projectName: 'Sistema de E-commerce', status: 'ativo', progress: 17, startDate: '01/04/2026', endDate: '14/04/2026' },
  { id: 2, name: 'Sprint 1 – MVP', projectId: 2, projectName: 'App Mobile Fitness', status: 'ativo', progress: 25, startDate: '28/03/2026', endDate: '10/04/2026' },
  { id: 3, name: 'Sprint 1 – Infraestrutura', projectId: 3, projectName: 'Portal Educacional', status: 'ativo', progress: 40, startDate: '25/03/2026', endDate: '07/04/2026' },
]

export const initialTasks = [
  { id: 1, title: 'Busca com filtros avançados', type: 'Backend', points: 5, status: 'todo', projectId: 1, assignee: 'MO', assigneeColor: '#534AB7' },
  { id: 2, title: 'Checkout multi-etapas', type: 'Frontend', points: 8, status: 'todo', projectId: 1, assignee: 'PC', assigneeColor: '#1D9E75' },
  { id: 3, title: 'Integração gateway pagamento', type: 'Backend', points: 13, status: 'todo', projectId: 1, assignee: 'RF', assigneeColor: '#BA7517' },
  { id: 4, title: 'Página de detalhes do produto', type: 'Frontend', points: 5, status: 'in_progress', projectId: 1, assignee: 'PC', assigneeColor: '#534AB7' },
  { id: 5, title: 'Implementar autocomplete', type: 'Backend', points: 3, status: 'in_progress', projectId: 1, assignee: 'MO', assigneeColor: '#1D9E75' },
  { id: 6, title: 'Listagem de produtos', type: 'Frontend', points: 5, status: 'review', projectId: 1, assignee: 'BL', assigneeColor: '#BA7517' },
  { id: 7, title: 'Configuração do projeto', type: 'DevOps', points: 2, status: 'done', projectId: 1, assignee: 'JS', assigneeColor: '#534AB7' },
  { id: 8, title: 'Design system base', type: 'Frontend', points: 3, status: 'done', projectId: 1, assignee: 'MO', assigneeColor: '#1D9E75' },
  { id: 9, title: 'Modelagem do banco de dados', type: 'Backend', points: 5, status: 'done', projectId: 1, assignee: 'PC', assigneeColor: '#534AB7' },
  { id: 10, title: 'Catálogo de exercícios', type: 'Frontend', points: 5, status: 'in_progress', projectId: 2, assignee: 'BL', assigneeColor: '#1D9E75' },
  { id: 11, title: 'Timer de treino', type: 'Frontend', points: 3, status: 'todo', projectId: 2, assignee: 'RA', assigneeColor: '#534AB7' },
  { id: 12, title: 'API de autenticação', type: 'Backend', points: 8, status: 'in_progress', projectId: 3, assignee: 'FR', assigneeColor: '#7F77DD' },
  { id: 13, title: 'Dashboard do aluno', type: 'Frontend', points: 5, status: 'review', projectId: 3, assignee: 'JS', assigneeColor: '#534AB7' },
  { id: 14, title: 'Estrutura de cursos', type: 'Backend', points: 13, status: 'done', projectId: 3, assignee: 'PC', assigneeColor: '#1D9E75' },
  { id: 15, title: 'Landing page', type: 'Frontend', points: 5, status: 'done', projectId: 3, assignee: 'MO', assigneeColor: '#534AB7' },
]

export const activities = [
  { id: 1, task: 'Implementar busca com autocomplete', project: 'Sistema de E-commerce', user: 'Maria Oliveira', date: '04 abr.' },
  { id: 2, task: 'Página de detalhes do produto', project: 'Sistema de E-commerce', user: 'Pedro Costa', date: '04 abr.' },
  { id: 3, task: 'Catálogo de exercícios', project: 'App Mobile Fitness', user: 'Beatriz Lima', date: '04 abr.' },
  { id: 4, task: 'Timer de treino', project: 'App Mobile Fitness', user: 'Rafael Alves', date: '04 abr.' },
  { id: 5, task: 'API de autenticação', project: 'Portal Educacional', user: 'Fernanda Rocha', date: '04 abr.' },
]

export const teamPerformance = [
  { name: 'Ana', tasks: 12 },
  { name: 'Thiago', tasks: 10 },
  { name: 'Lucas', tasks: 9 },
  { name: 'Beatriz', tasks: 8 },
  { name: 'Carlos', tasks: 7 },
]

export const sprintVelocity = [
  { sprint: 'Sprint 1', points: 36 },
  { sprint: 'Sprint 2', points: 28 },
  { sprint: 'Sprint 3', points: 22 },
  { sprint: 'Sprint 4', points: 19 },
]

export const TYPE_COLORS = {
  Backend: { bg: '#E6F1FB', text: '#185FA5' },
  Frontend: { bg: '#FAEEDA', text: '#854F0B' },
  DevOps: { bg: '#EAF3DE', text: '#3B6D11' },
  Design: { bg: '#EEEDFE', text: '#534AB7' },
  QA: { bg: '#FAECE7', text: '#993C1D' },
}

export const STATUS_LABELS = {
  todo: 'A Fazer',
  in_progress: 'Em Progresso',
  review: 'Em Revisão',
  done: 'Concluído',
}
