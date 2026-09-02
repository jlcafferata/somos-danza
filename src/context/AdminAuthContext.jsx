import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'somosdanza_admin_ok'
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || ''

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1')

  const value = useMemo(
    () => ({
      isAdmin,
      pinConfigured: Boolean(ADMIN_PIN),
      login(pin) {
        if (ADMIN_PIN && pin === ADMIN_PIN) {
          sessionStorage.setItem(STORAGE_KEY, '1')
          setIsAdmin(true)
          return true
        }
        return false
      },
      logout() {
        sessionStorage.removeItem(STORAGE_KEY)
        setIsAdmin(false)
      },
    }),
    [isAdmin]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de <AdminAuthProvider>')
  return ctx
}
