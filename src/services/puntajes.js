import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const puntajesRef = collection(db, 'puntajes')

export const JURADOS = [1, 2]

/** Se suscribe en tiempo real a todos los puntajes cargados. */
export function subscribePuntajes(onData, onError) {
  const q = query(puntajesRef, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError)
}

/**
 * Crea un puntaje para una puesta. `jurado` es 1 o 2 (hasta ahora se
 * admiten dos jurados por puesta). No se permite editar puntajes ya
 * cargados: quedan como registro inmutable de lo que cada jurado envio.
 */
export function crearPuntaje({ puestaId, jurado, valor, comentario }) {
  return addDoc(puntajesRef, {
    puestaId,
    jurado: Number(jurado),
    valor: Number(valor),
    comentario: (comentario || '').trim(),
    createdAt: serverTimestamp(),
  })
}
