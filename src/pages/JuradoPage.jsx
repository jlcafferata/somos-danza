import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCollection } from '../hooks/useCollection'
import { subscribeEscuelas } from '../services/escuelas'
import { subscribePuestas } from '../services/puestas'
import { subscribePuntajes } from '../services/puntajes'
import { JURADOS } from '../services/puntajes'
import PuestaScoreCard from '../components/PuestaScoreCard'
import IntroSplash from '../components/IntroSplash'

/**
 * Pantalla del jurado. El numero de jurado viene fijo por la URL
 * (/jurado/1 o /jurado/2), no se elige con un click: cada jurado entra con
 * su propio link y todo lo que carga queda asociado a ese numero.
 */
export default function JuradoPage() {
  const { numero } = useParams()
  const jurado = Number(numero)
  const juradoValido = JURADOS.includes(jurado)

  const { data: escuelas } = useCollection(subscribeEscuelas)
  const { data: puestas, loading } = useCollection(subscribePuestas)
  const { data: puntajes } = useCollection(subscribePuntajes)

  const [escuelaId, setEscuelaId] = useState('')
  const [categoria, setCategoria] = useState('')
  const [disciplina, setDisciplina] = useState('')

  const escuelaPorId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e.nombre])), [escuelas])

  const categorias = useMemo(() => [...new Set(puestas.map((p) => p.categoria).filter(Boolean))].sort(), [puestas])
  const disciplinas = useMemo(() => [...new Set(puestas.map((p) => p.disciplina).filter(Boolean))].sort(), [puestas])

  const puestasFiltradas = puestas.filter(
    (p) =>
      (!escuelaId || p.escuelaId === escuelaId) &&
      (!categoria || p.categoria === categoria) &&
      (!disciplina || p.disciplina === disciplina)
  )

  if (!juradoValido) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center bg-white rounded-2xl border border-brand-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-brand-900 mb-2">Link invalido</h1>
        <p className="text-brand-900/60 text-sm">
          Este link de jurado no es valido. Pedile al organizador el link correcto.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <IntroSplash />

      <div>
        <span className="inline-block text-xs font-bold uppercase tracking-wide bg-brand-600 text-white px-3 py-1 rounded-full mb-2">
          Jurado {jurado}
        </span>
        <h1 className="text-2xl font-extrabold text-brand-900">Cargar puntaje</h1>
        <p className="text-brand-900/60 text-sm mt-1">Elegi la puesta en escena y cargá tu puntaje.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white rounded-2xl border border-brand-100 shadow-sm p-4">
        <label className="text-sm font-medium text-brand-900">
          Escuela
          <select
            value={escuelaId}
            onChange={(e) => setEscuelaId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="">Todas</option>
            {escuelas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-brand-900">
          Categoria
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-brand-900">
          Disciplina
          <select
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="">Todas</option>
            {disciplinas.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p className="text-brand-900/50 text-sm">Cargando puestas...</p>}
      {!loading && puestasFiltradas.length === 0 && (
        <p className="text-brand-900/50 text-sm">No hay puestas cargadas todavia para estos filtros.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {puestasFiltradas.map((puesta) => (
          <PuestaScoreCard
            key={puesta.id}
            puesta={puesta}
            escuelaNombre={escuelaPorId[puesta.escuelaId] || 'Escuela desconocida'}
            jurado={jurado}
            puntajeExistente={puntajes.find((p) => p.puestaId === puesta.id && p.jurado === jurado)}
          />
        ))}
      </div>
    </div>
  )
}
