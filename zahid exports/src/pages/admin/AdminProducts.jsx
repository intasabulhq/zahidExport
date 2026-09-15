import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../admin/api'
import './admin.css'
import './admin-products.css'

const statusLabels = { draft: 'Draft', published: 'Published', archived: 'Archived' }

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (status) params.set('status', status)
      const data = await apiRequest(`/api/products/admin/list?${params}`)
      setProducts(data.products || [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    const timer = window.setTimeout(loadProducts, 250)
    return () => window.clearTimeout(timer)
  }, [loadProducts])

  const updateStatus = async (product, nextStatus) => {
    setBusyId(product.id)
    setError('')
    try {
      await apiRequest(`/api/products/${product.id}`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) })
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: nextStatus } : item))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusyId('')
    }
  }

  const archiveProduct = async (product) => {
    if (!window.confirm(`Archive “${product.name}”?`)) return
    setBusyId(product.id)
    setError('')
    try {
      await apiRequest(`/api/products/${product.id}`, { method: 'DELETE' })
      if (status && status !== 'archived') setProducts((current) => current.filter((item) => item.id !== product.id))
      else setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: 'archived' } : item))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusyId('')
    }
  }

  return <div className="admin-shell">
    <header className="admin-module-topbar"><div><Link to="/admin/dashboard">← Dashboard</Link><span>Products</span></div><Link className="admin-primary-action" to="/admin/products/new">Add product</Link></header>
    <main className="admin-products-main">
      <section className="admin-products-heading"><div><p className="admin-kicker">Catalogue management</p><h1>Products</h1><p>Add, edit, publish and archive products stored in PostgreSQL.</p></div><div className="admin-product-count"><strong>{products.length}</strong><span>Showing</span></div></section>
      <section className="admin-product-toolbar" aria-label="Product filters"><label><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, SKU or slug" /></label><label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All products</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><button type="button" onClick={loadProducts}>Refresh</button></section>
      {error && <p className="admin-module-error" role="alert">{error}</p>}
      {loading ? <div className="admin-products-empty">Loading products…</div> : products.length === 0 ? <div className="admin-products-empty"><h2>No products found</h2><p>Create the first database-backed product.</p><Link to="/admin/products/new">Add product →</Link></div> : <div className="admin-products-table-wrap"><table className="admin-products-table"><thead><tr><th>Product</th><th>SKU</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="admin-product-identity">{product.images?.[0] ? <img src={product.images[0]} alt="" /> : <span className="admin-product-image-placeholder">ZE</span>}<div><strong>{product.name}</strong><small>/{product.slug}</small></div></div></td><td>{product.sku}</td><td><select aria-label={`Status for ${product.name}`} value={product.status} disabled={busyId === product.id} onChange={(event) => updateStatus(product, event.target.value)}><option value="draft">{statusLabels.draft}</option><option value="published">{statusLabels.published}</option><option value="archived">{statusLabels.archived}</option></select></td><td>{new Date(product.updated_at).toLocaleDateString()}</td><td><div className="admin-row-actions"><Link to={`/admin/products/${product.id}/edit`}>Edit</Link><button type="button" disabled={busyId === product.id || product.status === 'archived'} onClick={() => archiveProduct(product)}>Archive</button></div></td></tr>)}</tbody></table></div>}
    </main>
  </div>
}

export default AdminProducts
