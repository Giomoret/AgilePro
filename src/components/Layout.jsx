import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, Zap, BarChart2, UserCircle, LogOut
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import styles from './Layout.module.css'

const API_URL = 'http://localhost:3001'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/projetos', label: 'Projetos', Icon: FolderKanban },
  { to: '/sprints', label: 'Sprints', Icon: Zap },
  { to: '/relatorios', label: 'Relatórios', Icon: BarChart2 },
  { to: '/perfis', label: 'Perfis', Icon: UserCircle },
]

export default function Layout() {
  const { userLogged, isAdmin, logout, allUsers } = useApp()

  const filteredNav = NAV_ITEMS.filter(item => {
    if (item.to === '/perfis') return isAdmin
    return true
  })

  // Busca os dados atualizados do usuário logado na lista allUsers (Avatar e Cargo)
  const usuarioAtual = allUsers.find(u => String(u.id) === String(userLogged?.id))
  const avatarUrl = usuarioAtual?.avatar ? `${API_URL}${usuarioAtual.avatar}` : null
  const iniciais = userLogged?.nome?.substring(0, 2).toUpperCase() || '??'

  // Define o cargo para exibição buscando primeiro a versão mais atualizada do banco
  const cargoExibicao = usuarioAtual?.cargo_display || userLogged?.cargo_display || (isAdmin ? 'Administrador' : 'Membro')

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>A</div>
          <span className={styles.logoText}>AgilePro</span>
        </div>

        <nav className={styles.nav}>
          {filteredNav.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.user}>
          <div
            className={styles.avatar}
            style={{
              background: avatarUrl ? 'transparent' : (isAdmin ? '#534AB7' : '#1D9E75'),
              color: 'white',
              overflow: 'hidden',
              padding: 0,
            }}
          >
            {avatarUrl
              ? <img src={avatarUrl} alt={userLogged?.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : iniciais
            }
          </div>

          <div className={styles.userInfo}>
            <span className={styles.userName}>{userLogged?.nome || 'Usuário'}</span>
            {/* Atualizado para exibir o cargo correto */}
            <span className={styles.userRole}>{cargoExibicao}</span>
          </div>

          <button
            onClick={logout}
            title="Sair do sistema"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '5px', marginLeft: 'auto', color: '#888780',
              display: 'flex', alignItems: 'center', transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
            onMouseLeave={e => e.currentTarget.style.color = '#888780'}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}