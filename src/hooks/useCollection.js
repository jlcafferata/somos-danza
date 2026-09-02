import { useEffect, useState } from 'react'

/**
 * Envuelve una funcion `subscribeX(onData, onError)` (nuestras funciones de
 * src/services) en un hook de React: se suscribe al montar y se desuscribe
 * al desmontar. Devuelve { data, loading, error }.
 */
export function useCollection(subscribeFn, deps = []) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeFn(
      (items) => {
        setData(items)
        setLoading(false)
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error(err)
        setError(err)
        setLoading(false)
      }
    )
    return () => unsubscribe && unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
