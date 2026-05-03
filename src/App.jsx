import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Projetos from './pages/Projetos'
import Sprints from './pages/Sprints'
import Relatorios from './pages/Relatorios'
import Perfis from './pages/Perfis'
import Login from './pages/Login'
import Register from './pages/Register' // 1. Importação da nova página de Registro

// Componente para proteger rotas exclusivas de Administradores
function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated } = useApp()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return children
}

function AppRoutes() {
  const { isAuthenticated } = useApp()

  return (
    <Routes>
      {/* ROTA PÚBLICA: Login */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
      />

      {/* 2. ROTA PÚBLICA: Registro (Acessível antes do login) */}
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />}
      />

      {/* ROTAS PROTEGIDAS: Só renderiza o Layout se estiver autenticado */}
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="sprints" element={<Sprints />} />
        <Route path="relatorios" element={<Relatorios />} />

        {/* Rota Protegida: Apenas Scrum Masters e Product Owners (Admins) */}
        <Route
          path="perfis"
          element={
            <AdminRoute>
              <Perfis />
            </AdminRoute>
          }
        />

        {/* Fallback para rotas inexistentes dentro do sistema */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Qualquer outra rota fora do escopo volta para o root (que tratará o login) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}