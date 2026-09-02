import { NavLink, Outlet } from 'react-router-dom'
import Logo from './Logo'
import { useAdminAuth } from '../context/AdminAuthContext'

const linkBase =
  'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap'
const linkActive = 'bg-brand-600 text-white'
const linkIdle = 'text-brand-900 hover:bg-brand-100'

export default function Layout() {
  const { isAdmin, logout } = useAdminAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur border-b border-brand-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-brand-700">
            <Logo />
            <span className="font-display font-extrabold text-lg tracking-tight">Somos Danza</span>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto">
            <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              Jurado
            </NavLink>
            <NavLink
              to="/admin/datos"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
            >
              Admin · Datos
            </NavLink>
            <NavLink
              to="/admin/puntajes"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
            >
              Admin · Puntajes
            </NavLink>
            {isAdmin && (
              <button
                type="button"
                onClick={logout}
                className={`${linkBase} ${linkIdle}`}
                title="Cerrar sesion de administrador"
              >
                Salir
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-center text-xs text-brand-900/50 py-4">Somos Danza</footer>
    </div>
  )
}
