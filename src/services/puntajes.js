import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const puntajesRef = collection(db, 'puntajes')

export const JURADOS = [1, 2]

// El id del documento es deterministico (puestaId + jurado) en vez de
// autogenerado: asi, si el jurado vuelve a enviar el puntaje de la misma
// puesta, se sobreescribe el mismo registro en lugar de crear uno duplicado.
function idPuntaje(puestaId, jurado) {
  return `${puestaId}_j${jurado}`
}

/** Se suscribe en tiempo real a todos los puntajes cargados. */
export function subscribePuntajes(onData, onError) {
  const q = query(puntajesRef, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError)
}

/**
 * Crea o actualiza el puntaje de un jurado para una puesta. `jurado` es 1 o
 * 2. Al ser el id deterministico, esto permite que el jurado corrija un
 * puntaje ya enviado: se pisa el mismo documento (se preserva `createdAt`
 * original y se actualiza `updatedAt`).
 */
export function guardarPuntaje({ puestaId, jurado, valor, comentario, esNuevo }) {
  const ref = doc(puntajesRef, idPuntaje(puestaId, jurado))
  return setDoc(
    ref,
    {
      puestaId,
      jurado: Number(jurado),
      valor: Number(valor),
      comentario: (comentario || '').trim(),
      updatedAt: serverTimestamp(),
      ...(esNuevo ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true }
  )
}
