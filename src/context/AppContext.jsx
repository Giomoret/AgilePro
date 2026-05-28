import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API_URL = 'http://localhost:3001'
const AppContext = createContext(null)

// Helper para fazer chamadas autenticadas
async function apiFetch(path, token, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição')
  return data
}

export function AppProvider({ children }) {
  // ─── Autenticação ──────────────────────────────
  const [userLogged, setUserLogged] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('agilepro_token'))

  useEffect(() => {
    const savedToken = localStorage.getItem('agilepro_token')
    const savedUser = localStorage.getItem('agilepro_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUserLogged(JSON.parse(savedUser))
    }
  }, [])

  const isAdmin = userLogged?.role === 'Scrum Master' || userLogged?.role === 'Product Owner' || userLogged?.cargo === 'admin'
  const isAuthenticated = !!token

  const login = (userData, jwtToken) => {
    localStorage.setItem('agilepro_token', jwtToken)
    localStorage.setItem('agilepro_user', JSON.stringify(userData))
    setToken(jwtToken)
    setUserLogged(userData)
  }

  const logout = () => {
    localStorage.removeItem('agilepro_token')
    localStorage.removeItem('agilepro_user')
    setToken(null)
    setUserLogged(null)
  }

  // ─── Usuários ──────────────────────────────────
  const [allUsers, setAllUsers] = useState([])

  const fetchUsers = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiFetch('/usuarios', token)
      // Mapeia para o formato que o frontend usa
      const mapped = data.map(u => ({
        ...u,
        role: u.cargo === 'admin' ? 'Scrum Master' : 'Dev',
        user: u.email,
        cor: { fundo: '#CEDBF6', texto: '#185FA5' },
      }))
      setAllUsers(mapped)
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchUsers()
  }, [token, fetchUsers])

  const registerUser = async (userData) => {
    await apiFetch('/usuarios', token, {
      method: 'POST',
      body: JSON.stringify({
        nome: userData.nome,
        email: userData.email || userData.user,
        senha: userData.pass,
        cargo: userData.role === 'Scrum Master' || userData.role === 'Product Owner' ? 'admin' : 'membro',
      }),
    })
    await fetchUsers()
  }

  const updateUser = async (id, dados) => {
    await apiFetch(`/usuarios/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(dados),
    })
    await fetchUsers()
  }

  const deleteUser = async (id) => {
    await apiFetch(`/usuarios/${id}`, token, { method: 'DELETE' })
    await fetchUsers()
  }

  // ─── Projetos ──────────────────────────────────
  const [projects, setProjects] = useState([])

  const fetchProjects = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiFetch('/projetos', token)
      const mapped = data.map(p => ({
        ...p,
        name: p.nome,
        description: p.descricao,
        color: p.cor,
        createdAt: new Date(p.criado_em).toLocaleDateString('pt-BR'),
        members: p.membros?.map(m => m.id.toString()) || [],
      }))
      setProjects(mapped)
    } catch (err) {
      console.error('Erro ao buscar projetos:', err)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchProjects()
  }, [token, fetchProjects])

  const addProject = async (project) => {
    await apiFetch('/projetos', token, {
      method: 'POST',
      body: JSON.stringify({
        nome: project.name,
        descricao: project.description,
        status: project.status || 'Ativo',
        cor: project.color || '#378ADD',
        membros: project.members || [],
      }),
    })
    await fetchProjects()
  }

  const updateProject = async (project) => {
    await apiFetch(`/projetos/${project.id}`, token, {
      method: 'PUT',
      body: JSON.stringify({
        nome: project.name,
        descricao: project.description,
        status: project.status,
        cor: project.color,
        membros: project.members || [],
      }),
    })
    await fetchProjects()
  }

  const deleteProject = async (id) => {
    await apiFetch(`/projetos/${id}`, token, { method: 'DELETE' })
    await fetchProjects()
  }

  // ─── Tarefas / Sprints (Kanban) ────────────────
  const [boardsData, setBoardsData] = useState({})

  const getInitialBoard = () => ({
    'a-fazer': { id: 'a-fazer', titulo: 'A fazer', cor: '#888780', tarefas: [] },
    'em-progresso': { id: 'em-progresso', titulo: 'Em progresso', cor: '#378ADD', tarefas: [] },
    'concluido': { id: 'concluido', titulo: 'Concluído', cor: '#1D9E75', tarefas: [] },
  })

  const fetchTarefas = useCallback(async (projetoId, sprint) => {
    if (!token || !projetoId) return
    try {
      const data = await apiFetch(`/tarefas?projeto_id=${projetoId}&sprint=${sprint}`, token)

      const board = getInitialBoard()
      data.forEach(t => {
        const col = t.status || 'a-fazer'
        if (board[col]) {
          board[col].tarefas.push({
            id: t.id.toString(),
            titulo: t.titulo,
            notas: t.notas,
            prioridade: t.prioridade,
            data: t.data_limite,
            responsaveis: t.responsaveis?.map(r => r.id.toString()) || [],
          })
        }
      })

      setBoardsData(prev => ({
        ...prev,
        [projetoId]: { ...(prev[projetoId] || {}), [sprint]: board },
      }))
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err)
    }
  }, [token])

  const addTarefa = async (tarefa, projetoId, sprint) => {
    await apiFetch('/tarefas', token, {
      method: 'POST',
      body: JSON.stringify({
        titulo: tarefa.titulo,
        notas: tarefa.notas,
        prioridade: tarefa.prioridade,
        status: tarefa.status,
        data_limite: tarefa.data || null,
        sprint,
        projeto_id: projetoId,
        responsaveis: tarefa.responsaveis?.map(Number) || [],
      }),
    })
    await fetchTarefas(projetoId, sprint)
  }

  const updateTarefa = async (tarefa, projetoId, sprint) => {
    await apiFetch(`/tarefas/${tarefa.id}`, token, {
      method: 'PUT',
      body: JSON.stringify({
        titulo: tarefa.titulo,
        notas: tarefa.notas,
        prioridade: tarefa.prioridade,
        status: tarefa.status,
        data_limite: tarefa.data || null,
        sprint,
        responsaveis: tarefa.responsaveis?.map(Number) || [],
      }),
    })
    await fetchTarefas(projetoId, sprint)
  }

  const deleteTarefa = async (tarefaId, projetoId, sprint) => {
    await apiFetch(`/tarefas/${tarefaId}`, token, { method: 'DELETE' })
    await fetchTarefas(projetoId, sprint)
  }

  // Mantém compatibilidade com Sprints.jsx que usa setBoardsData direto (drag and drop)
  const syncBoardWithApi = async (projetoId, sprint, board) => {
    // Sincroniza status de todas as tarefas após drag-and-drop
    const tarefas = []
    Object.entries(board).forEach(([colId, col]) => {
      col.tarefas.forEach(t => tarefas.push({ ...t, status: colId }))
    })
    for (const t of tarefas) {
      if (t.id && !t.id.startsWith('t-')) {
        await apiFetch(`/tarefas/${t.id}`, token, {
          method: 'PUT',
          body: JSON.stringify({ status: t.status }),
        }).catch(() => {})
      }
    }
  }

  return (
    <AppContext.Provider value={{
      // Auth
      userLogged, isAdmin, isAuthenticated, token, login, logout,

      // Usuários
      allUsers, registerUser, updateUser, deleteUser, fetchUsers,

      // Projetos
      projects, addProject, updateProject, deleteProject, fetchProjects,

      // Tarefas / Kanban
      boardsData, setBoardsData, fetchTarefas, addTarefa, updateTarefa, deleteTarefa, syncBoardWithApi,

      // Compatibilidade legada
      sprints: [], tasks: [],
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
