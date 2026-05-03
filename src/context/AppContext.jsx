import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  initialProjects,
  initialSprints,
  initialTasks,
} from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // --- Estados de Dados ---
  const [projects, setProjects] = useState(
    initialProjects.map(p => ({ ...p, id: p.id.toString(), status: 'Ativo' }))
  )
  const [sprints, setSprints] = useState(initialSprints)
  const [tasks, setTasks] = useState(initialTasks)
  const [boardsData, setBoardsData] = useState({})

  // --- NOVO: Gestão Global de Usuários ---
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('agilepro_users_list');
    return saved ? JSON.parse(saved) : [
      { user: 'admin', pass: '123', nome: "João Silva", role: "Scrum Master", id: 'JS' },
      { user: 'po', pass: '123', nome: "Ana Maria", role: "Product Owner", id: 'AM' }
    ];
  });

  // Salva a lista de usuários sempre que for alterada
  useEffect(() => {
    localStorage.setItem('agilepro_users_list', JSON.stringify(allUsers));
  }, [allUsers]);

  // --- Estados de Autenticação (JWT) ---
  const [userLogged, setUserLogged] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('agilepro_token'))

  useEffect(() => {
    const savedToken = localStorage.getItem('agilepro_token');
    const savedUser = localStorage.getItem('agilepro_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUserLogged(JSON.parse(savedUser));
    } else {
      setUserLogged(null);
      setToken(null);
    }
  }, []);

  const isAdmin = userLogged?.role === "Scrum Master" || userLogged?.role === "Product Owner"
  const isAuthenticated = !!token

  // --- Funções de Autenticação e Registro ---

  // Função para cadastrar novos usuários (usada na tela de Register e Perfis)
  const registerUser = (userData) => {
    const newUser = {
      ...userData,
      id: userData.nome.substring(0, 2).toUpperCase() + Math.floor(Math.random() * 100),
      cor: { fundo: "#EDE0FB", texto: "#534AB7" }
    };
    setAllUsers(prev => [...prev, newUser]);
  };

  // Função para deletar usuários (usada na tela de Perfis pelo Admin)
  const deleteUser = (userId) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const login = (userData, jwtToken) => {
    localStorage.setItem('agilepro_token', jwtToken);
    localStorage.setItem('agilepro_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUserLogged(userData);
  }

  const logout = () => {
    localStorage.removeItem('agilepro_token');
    localStorage.removeItem('agilepro_user');
    setToken(null);
    setUserLogged(null);
  }

  // --- Funções de Projetos ---
  function addProject(project) {
    const colors = ['#534AB7', '#1D9E75', '#7F77DD', '#185FA5', '#BA7517', '#D85A30']
    const newProject = {
      id: Date.now().toString(),
      color: colors[projects.length % colors.length],
      members: Array.isArray(project.members) ? project.members : [],
      createdAt: new Date().toLocaleDateString('pt-BR'),
      progress: 0,
      status: 'Ativo',
      ...project,
    }
    setProjects(prev => [...prev, newProject])
    return newProject
  }

  function updateProject(updatedProject) {
    setProjects(prev =>
      prev.map(p => (p.id === updatedProject.id.toString() ? updatedProject : p))
    )
  }

  function deleteProject(id) {
    const stringId = id.toString()
    setProjects(prev => prev.filter(p => p.id.toString() !== stringId))
    setBoardsData(prev => {
      const newBoards = { ...prev }
      delete newBoards[stringId]
      return newBoards
    })
  }

  // --- Funções de Sprints ---
  function addSprint(sprint) {
    const projectId = sprint.projectId.toString()
    const project = projects.find(p => p.id.toString() === projectId)
    const newSprint = {
      id: Date.now().toString(),
      projectName: project?.name || '',
      status: 'Ativo',
      progress: 0,
      ...sprint,
      projectId: projectId,
    }
    setSprints(prev => [...prev, newSprint])
  }

  // --- Funções de Tasks ---
  function addTask(task) {
    const newTask = {
      id: Date.now().toString(),
      status: 'todo',
      assignee: userLogged?.nome || 'Convidado',
      assigneeColor: '#534AB7',
      ...task,
      projectId: task.projectId.toString(),
      points: Number(task.points) || 3,
    }
    setTasks(prev => [...prev, newTask])
  }

  function updateTaskStatus(taskId, newStatus) {
    setTasks(prev =>
      prev.map(t => (t.id.toString() === taskId.toString() ? { ...t, status: newStatus } : t))
    )
  }

  function deleteTask(taskId) {
    setTasks(prev => prev.filter(t => t.id.toString() !== taskId.toString()))
  }

  return (
    <AppContext.Provider value={{
      // Usuários
      allUsers,
      registerUser,
      deleteUser,

      // Autenticação e Permissões
      userLogged,
      isAdmin,
      isAuthenticated,
      login,
      logout,

      // Projetos
      projects, addProject, updateProject, deleteProject,

      // Kanban Sprints
      boardsData, setBoardsData,

      // Estruturas de Sprints e Tasks
      sprints, addSprint,
      tasks, addTask, updateTaskStatus, deleteTask,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}