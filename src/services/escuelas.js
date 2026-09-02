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

const escuelasRef = collection(db, 'escuelas')

/** Se suscribe en tiempo real a la lista de escuelas, ordenadas por nombre. */
export function subscribeEscuelas(onData, onError) {
  const q = query(escuelasRef, orderBy('nombre'))
  return onSnapshot(q, (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError)
}

export function crearEscuela({ nombre }) {
  return addDoc(escuelasRef, { nombre: nombre.trim() })
}

export function actualizarEscuela(id, { nombre }) {
  return updateDoc(doc(db, 'escuelas', id), { nombre: nombre.trim() })
}

export function eliminarEscuela(id) {
  return deleteDoc(doc(db, 'escuelas', id))
}
