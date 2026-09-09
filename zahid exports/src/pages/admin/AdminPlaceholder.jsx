import { Link, useParams } from 'react-router-dom'
import './admin.css'

function AdminPlaceholder({ title }) {
  const { id } = useParams()
  return <main className="admin-placeholder"><p className="admin-kicker">Admin module</p><h1>{title}{id ? ` · ${id}` : ''}</h1><p>The backend route and database structure are ready. The management interface is the next implementation step.</p><Link to="/admin/dashboard">← Back to dashboard</Link></main>
}

export default AdminPlaceholder
