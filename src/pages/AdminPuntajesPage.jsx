import { useMemo, useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { subscribeEscuelas } from '../services/escuelas'
import { subscribePuestas } from '../services/puestas'
import { subscribePuntajes } from '../services/puntajes'

export default function AdminPuntajesPage() {
  const { data: escuelas } = useCollection(subscribeEscuelas)
  const { data: puestas } = useCollection(subscribePuestas)
  const { data: puntajes, loading } = useCollection(subscribePuntajes)

  const [filtroEscuela, setFiltroEscuela] = useState('')

  const escuelaPorId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e.nombre])), [escuelas])
  const puestaPorId = useMemo(() => Object.fromEntries(puestas.map((p) => [p.id, p])), [puestas])

  const filas = useMemo(() => {
    const porPuesta = new Map()
    for (const puntaje of puntajes) {
      const puesta = puestaPorId[puntaje.puestaId]
      if (!puesta) continue
      if (filtroEscuela && puesta.escuelaId !== filtroEscuela) continue
      if (!porPuesta.has(puesta.id)) {
        porPuesta.set(puesta.id, { puesta, jurado1: null, jurado2: null })
      }
      const fila = porPuesta.get(puesta.id)
      fila[`jurado${puntaje.jurado}`] = puntaje
    }
    return [...porPuesta.values()].sort((a, b) => a.puesta.nombre.localeCompare(b.puesta.nombre))
  }, [puntajes, puestaPorId, filtroEscuela])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-900">Puntajes cargados</h1>
        <p className="text-brand-900/60 text-sm mt-1">Lo que fue enviando cada jurado, en tiempo real.</p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4">
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
            {filas.map(({ puesta, jurado1, jurado2 }) => {
              const valores = [jurado1?.valor, jurado2?.valor].filter((v) => v !== undefined && v !== null)
              const promedio = valores.length ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2) : '-'
              return (
                <tr key={puesta.id}>
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
                  <td className="py-2 px-3 font-bold text-brand-800">{promedio}</td>
                </tr>
              )
            })}
            {!loading && filas.length === 0 && (
              <tr>
                <td colSpan={7} className="py-3 px-3 text-brand-900/50">
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
