import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

/**
 * Envia un email al administrador avisando que se cargo un puntaje nuevo.
 * Si EmailJS no esta configurado (faltan variables de entorno) no rompe la
 * app: solo deja un warning en consola y el puntaje queda igual guardado
 * en la base de datos.
 */
export async function notificarPuntajeCargado({ escuela, puesta, jurado, valor }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    // eslint-disable-next-line no-console
    console.warn(
      '[emailjs] Notificacion por email no configurada. Completa VITE_EMAILJS_* en el archivo .env (ver README.md).'
    )
    return
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        escuela,
        puesta,
        jurado: `Jurado ${jurado}`,
        valor,
        fecha: new Date().toLocaleString('es-AR'),
      },
      { publicKey: PUBLIC_KEY }
    )
  } catch (err) {
    // No bloqueamos el flujo del usuario si falla el email: el puntaje ya
    // quedo guardado en Firestore igual.
    // eslint-disable-next-line no-console
    console.error('[emailjs] Error enviando notificacion:', err)
  }
}
