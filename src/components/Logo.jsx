import { useState } from 'react'

/**
 * Muestra /public/logo.png (el logo real del proyecto). Si todavia no fue
 * agregado ese archivo, cae en un mini logo dibujado a mano en SVG para que
 * la app nunca se vea rota mientras tanto.
 */
export default function Logo({ className = 'h-9 w-9' }) {
  const [error, setError] = useState(false)

  if (!error) {
    return (
      <img
        src="/logo.png"
        alt="Somos Danza"
        className={className + ' object-contain'}
        onError={() => setError(true)}
      />
    )
  }

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 15 C 45 25, 40 45, 60 40 C 75 36, 82 20, 70 15 C 55 9, 48 30, 65 45 C 80 58, 55 62, 42 55"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="68" r="7" stroke="currentColor" strokeWidth="6" />
    </svg>
  )
}
