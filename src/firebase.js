import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Estas variables se leen del archivo .env / .env.local (ver README.md
// para saber donde conseguirlas en la consola de Firebase).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig).filter(([, v]) => !v)
if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(
    '[firebase] Faltan variables de entorno: ' +
      missing.map(([k]) => k).join(', ') +
      '. Revisa el archivo .env (copia .env.example) y reinicia "npm run dev".'
  )
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
