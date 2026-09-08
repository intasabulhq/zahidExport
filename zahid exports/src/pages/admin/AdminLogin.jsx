import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../admin/AdminAuthContext'
import './admin.css'

function AdminLogin() {
  const { admin, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  if (admin) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="admin-auth-page">
    <section className="admin-login-card">
      <p className="admin-kicker">Zahid Exports</p>
      <h1>Admin sign in</h1>
      <p>Secure access for catalogue and B2B enquiry management.</p>
      <form onSubmit={handleSubmit}>
        <label><span>Email</span><input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label><span>Password</span><input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <a href="/">← Return to website</a>
    </section>
  </main>
}

export default AdminLogin
