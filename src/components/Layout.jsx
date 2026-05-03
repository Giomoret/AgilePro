import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Zap,
  BarChart2,
  UserCircle,
  LogOut // Importação do ícone de sair
} from 'lucide-react'
import { useApp } from '../context/AppContext' // Importação do hook para acessar o estado
import styles from './Layout.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/projetos', label: 'Projetos', Icon: FolderKanban },
  { to: '/sprints', label: 'Sprints', Icon: Zap },
  { to: '/relatorios', label: 'Relatórios', Icon: BarChart2 },
  { to: '/perfis', label: 'Perfis', Icon: UserCircle },
]

export default function Layout() {
  const { userLogged, isAdmin, logout } = useApp()

  // Filtra o menu: se não for admin (Scrum Master ou PO), a aba Perfis não aparece
  const filteredNav = NAV_ITEMS.filter(item => {
    if (item.to === '/perfis') return isAdmin
    return true
  })

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

        {/* ÁREA DO USUÁRIO ATUALIZADA */}
        <div className={styles.user}>
          <div
            className={styles.avatar}
            style={{
              background: isAdmin ? '#534AB7' : '#1D9E75', // Diferenciação visual simples por cargo
              color: 'white'
            }}
          >
            {userLogged?.id || '??'}
          </div>

          <div className={styles.userInfo}>
            <span className={styles.userName}>{userLogged?.nome || 'Usuário'}</span>
            <span className={styles.userRole}>{userLogged?.role || 'Membro'}</span>
          </div>

          {/* BOTÃO DE LOGOUT */}
          <button
            onClick={logout}
            title="Sair do sistema"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px',
              marginLeft: 'auto',
              color: '#888780',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#888780'}
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