import { useMemo, useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { subscribeEscuelas } from '../services/escuelas'
import { subscribePuestas } from '../services/puestas'
import { subscribePuntajes } from '../services/puntajes'

const medallas = ['🥇', '🥈', '🥉']

export default function AdminPuntajesPage() {
  const { data: escuelas } = useCollection(subscribeEscuelas)
  const { data: puestas } = useCollection(subscribePuestas)
  const { data: puntajes, loading } = useCollection(subscribePuntajes)

  const [filtroEscuela, setFiltroEscuela] = useState('')
  const [filtroFuncion, setFiltroFuncion] = useState('')

  const escuelaPorId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e.nombre])), [escuelas])
  const puestaPorId = useMemo(() => Object.fromEntries(puestas.map((p) => [p.id, p])), [puestas])
  const funciones = useMemo(() => [...new Set(puestas.map((p) => p.funcion).filter(Boolean))].sort(), [puestas])

  const filas = useMemo(() => {
    const porPuesta = new Map()
    for (const puntaje of puntajes) {
      const puesta = puestaPorId[puntaje.puestaId]
      if (!puesta) continue
      if (filtroEscuela && puesta.escuelaId !== filtroEscuela) continue
      if (filtroFuncion && puesta.funcion !== filtroFuncion) continue
      if (!porPuesta.has(puesta.id)) {
        porPuesta.set(puesta.id, { puesta, jurado1: null, jurado2: null })
      }
      const fila = porPuesta.get(puesta.id)
      fila[`jurado${puntaje.jurado}`] = puntaje
    }

    // Se calcula el promedio de cada fila y se ordena de mayor a menor, para
    // ver de un vistazo los primeros puestos. Las que todavia no tienen
    // ningun puntaje quedan al final.
    return [...porPuesta.values()]
      .map((fila) => {
        const valores = [fila.jurado1?.valor, fila.jurado2?.valor].filter((v) => v !== undefined && v !== null)
        const promedio = valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : null
        return { ...fila, promedio }
      })
      .sort((a, b) => {
        if (a.promedio === null && b.promedio === null) return a.puesta.nombre.localeCompare(b.puesta.nombre)
        if (a.promedio === null) return 1
        if (b.promedio === null) return -1
        return b.promedio - a.promedio
      })
  }, [puntajes, puestaPorId, filtroEscuela, filtroFuncion])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-900">Puntajes cargados</h1>
        <p className="text-brand-900/60 text-sm mt-1">
          Lo que fue enviando cada jurado, en tiempo real, ordenado de mayor a menor promedio.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4 flex flex-wrap gap-4">
        <label className="text-sm font-medium text-brand-900">
          Filtrar por funcion
          <select
            value={filtroFuncion}
            onChange={(e) => setFiltroFuncion(e.target.value)}
            className="ml-2 rounded-lg border border-brand-200 px-2 py-1"
          >
            <option value="">Todas</option>
            {funciones.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-brand-900">
          Filtrar por escuela
          <select
            value={filtroEscuela}
            onChange={(e) => setFiltroEscuela(e.target.value)}
            className="ml-2 rounded-lg border border-brand-200 px-2 py-1"
          >
            <option value="">Todas</option>
            {escuelas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p className="text-brand-900/50 text-sm">Cargando...</p>}

      <div className="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-brand-900/60 border-b border-brand-100">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Funcion</th>
              <th className="py-2 px-3">Escuela</th>
              <th className="py-2 px-3">Puesta</th>
              <th className="py-2 px-3">Categoria</th>
              <th className="py-2 px-3">Disciplina</th>
              <th className="py-2 px-3">Jurado 1</th>
              <th className="py-2 px-3">Jurado 2</th>
              <th className="py-2 px-3">Promedio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {filas.map(({ puesta, jurado1, jurado2, promedio }, idx) => {
              const esPodio = promedio !== null && idx < 3
              return (
                <tr key={puesta.id} className={esPodio ? 'bg-amber-50' : ''}>
                  <td className="py-2 px-3 font-semibold text-brand-900">
                    {esPodio ? `${medallas[idx]} ${idx + 1}` : idx + 1}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{puesta.funcion || '-'}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{escuelaPorId[puesta.escuelaId] || '-'}</td>
                  <td className="py-2 px-3">{puesta.nombre}</td>
                  <td className="py-2 px-3">{puesta.categoria}</td>
                  <td className="py-2 px-3">{puesta.disciplina}</td>
                  <td className="py-2 px-3">
                    {jurado1 ? (
                      <span className="text-green-700 font-semibold">{jurado1.valor}</span>
                    ) : (
                      <span className="text-brand-900/30">Pendiente</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {jurado2 ? (
                      <span className="text-green-700 font-semibold">{jurado2.valor}</span>
                    ) : (
                      <span className="text-brand-900/30">Pendiente</span>
                    )}
                  </td>
                  <td className="py-2 px-3 font-bold text-brand-800">
                    {promedio === null ? '-' : promedio.toFixed(2)}
                  </td>
                </tr>
              )
            })}
            {!loading && filas.length === 0 && (
              <tr>
                <td colSpan={9} className="py-3 px-3 text-brand-900/50">
                  Todavia no se cargo ningun puntaje.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
