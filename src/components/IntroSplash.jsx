import { useEffect, useState } from 'react'
import Logo from './Logo'

/**
 * Pantalla de bienvenida a pantalla completa con el logo centrado que se
 * desvanece durante 3 segundos al entrar a la vista del jurado. Es puramente
 * decorativa: no bloquea nada, solo tapa el contenido mientras dura el fade
 * y despues se saca del DOM.
 */
export default function IntroSplash() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setFading(true))
    const timeout = setTimeout(() => setVisible(false), 3000)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={
        'fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-[3000ms] ease-in ' +
        (fading ? 'opacity-0 pointer-events-none' : 'opacity-100')
      }
    >
      <Logo className="h-24 w-24" />
    </div>
  )
}
