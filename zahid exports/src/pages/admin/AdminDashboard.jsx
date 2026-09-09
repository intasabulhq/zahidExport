import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../admin/AdminAuthContext'
import './admin.css'

const sections = [
  { title: 'Products', copy: 'Add, edit, publish and archive catalogue products.', path: '/admin/products', status: 'Next build' },
  { title: 'Enquiries', copy: 'Review and qualify B2B enquiries received from the website.', path: '/admin/enquiries', status: 'Next build' },
  { title: 'Categories', copy: 'Manage category content, keywords and SEO metadata.', path: '/admin/categories', status: 'Planned' },
]

function AdminDashboard() {
  const { admin, logout } = useAdminAuth()

  return <div className="admin-shell">
    <header className="admin-topbar"><Link to="/" className="admin-brand">ZAHID <small>EXPORTS</small></Link><div><span>{admin?.email}</span><button onClick={logout}>Sign out</button></div></header>
    <main className="admin-main">
      <p className="admin-kicker">Administration</p>
      <div className="admin-heading"><div><h1>Welcome, {admin?.name || 'Admin'}.</h1><p>The secure backend foundation is connected and ready for catalogue workflows.</p></div><span className="admin-system-state">API + PostgreSQL foundation</span></div>
      <section className="admin-section-grid">
        {sections.map((section) => <article key={section.title}><span>{section.status}</span><h2>{section.title}</h2><p>{section.copy}</p><Link to={section.path}>Open module →</Link></article>)}
      </section>
      <section className="admin-security-note"><h2>Security baseline</h2><p>Passwords are hashed, sessions use HTTP-only cookies, login attempts are rate limited, database queries are parameterized and secrets stay in server environment variables.</p></section>
    </main>
  </div>
}

export default AdminDashboard
