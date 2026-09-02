import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const puestasRef = collection(db, 'puestas')

// Listas sugeridas para los combos de categoria/disciplina (se pueden
// escribir valores distintos a mano, esto es solo una ayuda).
export const CATEGORIAS_SUGERIDAS = ['Infantil', 'Juvenil', 'Adulto']
export const DISCIPLINAS_SUGERIDAS = [
  'Jazz',
  'Jazz fusion',
  'Jazz contemporaneo',
  'Danza Jazz',
  'Danza contemporanea',
  'Folclore',
  'Danza urbana',
  'Ballet',
]

/** Se suscribe en tiempo real a todas las puestas. */
export function subscribePuestas(onData, onError) {
  const q = query(puestasRef, orderBy('nombre'))
  return onSnapshot(q, (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError)
}

export function crearPuesta({ escuelaId, nombre, categoria, disciplina, cantidadAlumnos, docentes }) {
  return addDoc(puestasRef, {
    escuelaId,
    nombre: nombre.trim(),
    categoria: categoria.trim(),
    disciplina: disciplina.trim(),
    cantidadAlumnos: Number(cantidadAlumnos) || 0,
    docentes: docentes.trim(),
  })
}

export function actualizarPuesta(id, { escuelaId, nombre, categoria, disciplina, cantidadAlumnos, docentes }) {
  return updateDoc(doc(db, 'puestas', id), {
    escuelaId,
    nombre: nombre.trim(),
    categoria: categoria.trim(),
    disciplina: disciplina.trim(),
    cantidadAlumnos: Number(cantidadAlumnos) || 0,
    docentes: docentes.trim(),
  })
}

export function eliminarPuesta(id) {
  return deleteDoc(doc(db, 'puestas', id))
}
