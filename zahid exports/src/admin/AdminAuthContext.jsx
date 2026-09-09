import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from './api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/api/auth/me').then((data) => setAdmin(data.admin)).catch(() => setAdmin(null)).finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    setAdmin(data.admin)
  }

  const logout = async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' })
    setAdmin(null)
  }

  return <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
