import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from './Logo'

const linkBase =
  'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap'
const linkActive = 'bg-brand-600 text-white'
const linkIdle = 'text-brand-900 hover:bg-brand-100'

export default function Layout() {
  const location = useLocation()
  // Vista del jurado (landing "/" o "/jurado/:numero"): sin menu, sin
  // distracciones, solo la carga de puntaje.
  const esVistaJurado = location.pathname === '/' || location.pathname.startsWith('/jurado')

  return (
    <div className="min-h-screen flex flex-col">
      {!esVistaJurado && (
        <header className="bg-white/80 backdrop-blur border-b border-brand-100 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-brand-700">
              <Logo />
              <span className="font-display font-extrabold text-lg tracking-tight">Somos Danza</span>
            </div>

            <nav className="flex items-center gap-1 overflow-x-auto">
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
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {!esVistaJurado && <footer className="text-center text-xs text-brand-900/50 py-4">Somos Danza</footer>}

      <span className="fixed bottom-2 right-3 text-[10px] text-brand-900/40 z-40 pointer-events-none">
        creado por JLC - Desarrollos inteligentes
      </span>
    </div>
  )
}
