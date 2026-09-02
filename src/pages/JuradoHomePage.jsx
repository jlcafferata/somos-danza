import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { JURADOS } from '../services/puntajes'

/**
 * Landing de "/". En el uso normal los jurados no deberian llegar aca: cada
 * uno tiene su propio link (/jurado/1 o /jurado/2). Esta pantalla es un
 * respaldo por si alguien entra sin ese link.
 */
export default function JuradoHomePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo className="h-20 w-20" />
      <div>
        <h1 className="text-2xl font-extrabold text-brand-900">Somos Danza</h1>
        <p className="text-brand-900/60 text-sm mt-1">Entra con el link que te compartio el organizador.</p>
      </div>
      <div className="flex gap-3">
        {JURADOS.map((j) => (
          <Link
            key={j}
            to={`/jurado/${j}`}
            className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 transition-colors"
          >
            Soy Jurado {j}
          </Link>
        ))}
      </div>
    </div>
  )
}
