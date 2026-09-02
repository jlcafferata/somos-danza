import { useMemo, useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { actualizarEscuela, crearEscuela, eliminarEscuela, subscribeEscuelas } from '../services/escuelas'
import {
  CATEGORIAS_SUGERIDAS,
  DISCIPLINAS_SUGERIDAS,
  actualizarPuesta,
  crearPuesta,
  eliminarPuesta,
  subscribePuestas,
} from '../services/puestas'

const puestaVacia = {
  escuelaId: '',
  nombre: '',
  categoria: '',
  disciplina: '',
  cantidadAlumnos: '',
  docentes: '',
}

export default function AdminDatosPage() {
  const { data: escuelas } = useCollection(subscribeEscuelas)
  const { data: puestas } = useCollection(subscribePuestas)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-900">Administrar datos</h1>
        <p className="text-brand-900/60 text-sm mt-1">
          Cargá las escuelas y sus puestas en escena. Estos datos son los que despues ve el jurado para puntuar.
        </p>
      </div>

      <EscuelasSection escuelas={escuelas} />
      <PuestasSection escuelas={escuelas} puestas={puestas} />
    </div>
  )
}

function EscuelasSection({ escuelas }) {
  const [nombre, setNombre] = useState('')
  const [editId, setEditId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    if (!nombre.trim()) return
    setSaving(true)
    try {
      await crearEscuela({ nombre })
      setNombre('')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveEdit(id) {
    if (!editNombre.trim()) return
    await actualizarEscuela(id, { nombre: editNombre })
    setEditId(null)
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar esta escuela? Las puestas asociadas no se borran automaticamente.')) return
    await eliminarEscuela(id)
  }

  return (
    <section className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4">
      <h2 className="text-lg font-bold text-brand-800 mb-3">Escuelas</h2>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la escuela"
          className="flex-1 rounded-lg border border-brand-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-4 py-2 transition-colors"
        >
          Agregar
        </button>
      </form>

      <ul className="divide-y divide-brand-100">
        {escuelas.map((esc) => (
          <li key={esc.id} className="py-2 flex items-center gap-2">
            {editId === esc.id ? (
              <>
                <input
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="flex-1 rounded-lg border border-brand-200 px-2 py-1"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(esc.id)}
                  className="text-sm font-semibold text-brand-700 hover:underline"
                >
                  Guardar
                </button>
                <button onClick={() => setEditId(null)} className="text-sm text-brand-900/50 hover:underline">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-brand-900">{esc.nombre}</span>
                <button
                  onClick={() => {
                    setEditId(esc.id)
                    setEditNombre(esc.nombre)
                  }}
                  className="text-sm font-semibold text-brand-700 hover:underline"
                >
                  Editar
                </button>
                <button onClick={() => handleDelete(esc.id)} className="text-sm text-red-600 hover:underline">
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
        {escuelas.length === 0 && <li className="py-2 text-sm text-brand-900/50">Todavia no hay escuelas.</li>}
      </ul>
    </section>
  )
}

function PuestasSection({ escuelas, puestas }) {
  const [form, setForm] = useState(puestaVacia)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filtroEscuela, setFiltroEscuela] = useState('')

  const escuelaPorId = useMemo(() => Object.fromEntries(escuelas.map((e) => [e.id, e.nombre])), [escuelas])

  const puestasVisibles = filtroEscuela ? puestas.filter((p) => p.escuelaId === filtroEscuela) : puestas

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function startEdit(puesta) {
    setEditId(puesta.id)
    setForm({
      escuelaId: puesta.escuelaId,
      nombre: puesta.nombre,
      categoria: puesta.categoria,
      disciplina: puesta.disciplina,
      cantidadAlumnos: puesta.cantidadAlumnos,
      docentes: puesta.docentes,
    })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(puestaVacia)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.escuelaId || !form.nombre.trim()) return
    setSaving(true)
    try {
      if (editId) {
        await actualizarPuesta(editId, form)
      } else {
        await crearPuesta(form)
      }
      cancelEdit()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar esta puesta? Los puntajes asociados no se borran automaticamente.')) return
    await eliminarPuesta(id)
  }

  return (
    <section className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4">
      <h2 className="text-lg font-bold text-brand-800 mb-3">Puestas en escena</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        <label className="text-sm font-medium text-brand-900">
          Escuela
          <select
            value={form.escuelaId}
            onChange={(e) => setField('escuelaId', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          >
            <option value="">Elegir...</option>
            {escuelas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-brand-900">
          Puesta
          <input
            value={form.nombre}
            onChange={(e) => setField('nombre', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium text-brand-900">
          Categoria
          <input
            value={form.categoria}
            onChange={(e) => setField('categoria', e.target.value)}
            list="categorias-sugeridas"
            required
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
          <datalist id="categorias-sugeridas">
            {CATEGORIAS_SUGERIDAS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        <label className="text-sm font-medium text-brand-900">
          Disciplina
          <input
            value={form.disciplina}
            onChange={(e) => setField('disciplina', e.target.value)}
            list="disciplinas-sugeridas"
            required
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
          <datalist id="disciplinas-sugeridas">
            {DISCIPLINAS_SUGERIDAS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </label>

        <label className="text-sm font-medium text-brand-900">
          Cantidad de alumnos
          <input
            type="number"
            min="0"
            value={form.cantidadAlumnos}
            onChange={(e) => setField('cantidadAlumnos', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium text-brand-900">
          Docente/s
          <input
            value={form.docentes}
            onChange={(e) => setField('docentes', e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2"
          />
        </label>

        <div className="sm:col-span-2 lg:col-span-3 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-4 py-2 transition-colors"
          >
            {editId ? 'Guardar cambios' : 'Agregar puesta'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-brand-200 px-4 py-2 text-brand-700 hover:bg-brand-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2 mb-2">
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-brand-900/60 border-b border-brand-100">
              <th className="py-2 pr-3">Escuela</th>
              <th className="py-2 pr-3">Puesta</th>
              <th className="py-2 pr-3">Categoria</th>
              <th className="py-2 pr-3">Disciplina</th>
              <th className="py-2 pr-3">Alumnos</th>
              <th className="py-2 pr-3">Docente/s</th>
              <th className="py-2 pr-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {puestasVisibles.map((p) => (
              <tr key={p.id}>
                <td className="py-2 pr-3 whitespace-nowrap">{escuelaPorId[p.escuelaId] || '-'}</td>
                <td className="py-2 pr-3">{p.nombre}</td>
                <td className="py-2 pr-3">{p.categoria}</td>
                <td className="py-2 pr-3">{p.disciplina}</td>
                <td className="py-2 pr-3">{p.cantidadAlumnos}</td>
                <td className="py-2 pr-3">{p.docentes}</td>
                <td className="py-2 pr-3 whitespace-nowrap">
                  <button onClick={() => startEdit(p)} className="text-brand-700 font-semibold hover:underline mr-3">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {puestasVisibles.length === 0 && (
              <tr>
                <td colSpan={7} className="py-3 text-brand-900/50">
                  Todavia no hay puestas cargadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
