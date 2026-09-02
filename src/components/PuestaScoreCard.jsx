import { useState } from 'react'
import { crearPuntaje } from '../services/puntajes'
import { notificarPuntajeCargado } from '../services/notificaciones'

/**
 * Tarjeta de una puesta en escena para la pantalla del jurado: muestra sus
 * datos y el formulario para cargar el puntaje de este jurado (el numero
 * viene fijo por la URL, no se elige aca). Si este jurado ya cargo puntaje
 * para esta puesta, muestra el valor cargado en lugar del formulario.
 */
export default function PuestaScoreCard({ puesta, escuelaNombre, jurado, puntajeExistente }) {
  const [valor, setValor] = useState('')
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const numero = Number(valor)
    if (Number.isNaN(numero) || numero < 0 || numero > 10) {
      setError('Ingresa un puntaje valido entre 0 y 10')
      return
    }

    setEnviando(true)
    try {
      await crearPuntaje({ puestaId: puesta.id, jurado, valor: numero, comentario })
      await notificarPuntajeCargado({
        escuela: escuelaNombre,
        puesta: puesta.nombre,
        jurado,
        valor: numero,
      })
      setEnviado(true)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('No se pudo guardar el puntaje. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const yaCargado = puntajeExistente || enviado
  const valorCargado = puntajeExistente ? puntajeExistente.valor : valor

  return (
    <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4 flex flex-col gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">{escuelaNombre}</p>
        <h3 className="text-lg font-bold text-brand-900 leading-tight">{puesta.nombre}</h3>
        <div className="flex flex-wrap gap-1.5 mt-2 text-xs">
          <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
            {puesta.categoria}
          </span>
          <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
            {puesta.disciplina}
          </span>
          <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
            {puesta.cantidadAlumnos} alumnos
          </span>
        </div>
        {puesta.docentes && <p className="text-sm text-brand-900/60 mt-2">Docente/s: {puesta.docentes}</p>}
      </div>

      {yaCargado ? (
        <p className="text-sm text-green-700 font-medium border-t border-brand-100 pt-3">
          Puntaje guardado: {valorCargado}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="border-t border-brand-100 pt-3 flex flex-col gap-2">
          <label className="text-sm font-medium text-brand-900">
            Tu puntaje (0 a 10)
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              required
            />
          </label>
          <label className="text-sm font-medium text-brand-900">
            Comentario (opcional)
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2 transition-colors"
          >
            {enviando ? 'Guardando...' : 'Enviar puntaje'}
          </button>
        </form>
      )}
    </div>
  )
}
