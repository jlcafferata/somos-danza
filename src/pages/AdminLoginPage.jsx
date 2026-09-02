import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminLoginPage() {
  const { login, pinConfigured } = useAdminAuth()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  function handleSubmit(e) {
    e.preventDefault()
    if (login(pin)) {
      const from = location.state?.from?.pathname || '/admin/datos'
      navigate(from, { replace: true })
    } else {
      setError('PIN incorrecto')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white rounded-2xl shadow-sm border border-brand-100 p-6">
      <h1 className="text-xl font-bold text-brand-800 mb-1">Acceso administrador</h1>
      <p className="text-sm text-brand-900/60 mb-5">Ingresa el PIN de administrador para continuar.</p>

      {!pinConfigured && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          No hay un PIN configurado todavia. Definilo en la variable{' '}
          <code className="font-mono">VITE_ADMIN_PIN</code> del archivo <code className="font-mono">.env</code>.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          className="w-full rounded-lg border border-brand-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 transition-colors"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}
