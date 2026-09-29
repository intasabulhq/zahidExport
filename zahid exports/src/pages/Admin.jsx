import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../data/useCatalog'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import '../Admin.css'

const navigation = [
  { id: 'overview', label: 'Overview', icon: '▦' },
  { id: 'products', label: 'Products', icon: '◇' },
  { id: 'categories', label: 'Categories', icon: '▤' },
  { id: 'enquiries', label: 'Quote enquiries', icon: '✉' },
]

function SetupRequired() {
  return (
    <main className="admin-gate">
      <section className="admin-gate-card">
        <p className="admin-kicker">Zahid Exports · Staff access</p>
        <h1>Admin setup required</h1>
        <p>The staff dashboard uses Supabase for secure staff sign-in, catalogue storage and buyer quote enquiries. Buyer accounts are not part of this setup.</p>
        <ol>
          <li>Create a Supabase project.</li>
          <li>Copy <code>.env.example</code> to <code>.env.local</code> and add the project URL and anon key.</li>
          <li>Run <code>supabase/migrations/202609290001_b2b_catalog_and_enquiries.sql</code> in the Supabase SQL Editor.</li>
          <li>Create a staff user in Supabase Auth, then add only that user to <code>public.admin_users</code> as described in the migration.</li>
        </ol>
        <p className="admin-gate-note">The frontend never uses a service-role key. Access to staff data is controlled by database row-level security.</p>
        <Link to="/" className="admin-back-link">← Back to the public website</Link>
      </section>
    </main>
  )
}

function AdminLogin({ authIssue }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(authIssue)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setSubmitting(false)
    if (signInError) setError('Sign-in failed. Check your staff credentials and try again.')
  }

  return (
    <main className="admin-gate">
      <section className="admin-gate-card admin-login-card">
        <p className="admin-kicker">Zahid Exports · Staff only</p>
        <h1>Admin sign in</h1>
        <p>This sign-in is for authorised Zahid Exports staff. Buyers can request quotes without creating an account.</p>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-form admin-login-form">
          <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="admin-primary-button" disabled={submitting} type="submit">{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <Link to="/" className="admin-back-link">← Back to the public website</Link>
      </section>
    </main>
  )
}

function OverviewPanel() {
  const [metrics, setMetrics] = useState({ products: '—', categories: '—', enquiries: '—', newEnquiries: '—' })
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function loadMetrics() {
      const [products, categories, enquiries, newEnquiries] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('enquiries').select('id', { count: 'exact', head: true }),
        supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ])
      const issue = products.error || categories.error || enquiries.error || newEnquiries.error
      if (!active) return
      if (issue) {
        setError('Could not load dashboard totals. Check that the database migration has been applied.')
        return
      }
      setMetrics({
        products: products.count ?? 0,
        categories: categories.count ?? 0,
        enquiries: enquiries.count ?? 0,
        newEnquiries: newEnquiries.count ?? 0,
      })
    }
    void loadMetrics()
    return () => { active = false }
  }, [])

  return (
    <div>
      <div className="admin-panel-heading">
        <div><p className="admin-kicker">At a glance</p><h2>Business overview</h2></div>
        <p>Catalogue and quote activity</p>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-metric-grid">
        <Metric label="Published & draft products" value={metrics.products} detail="Manage the product catalogue" />
        <Metric label="Categories" value={metrics.categories} detail="Organise your collections" />
        <Metric label="All enquiries" value={metrics.enquiries} detail="Buyer quote requests" />
        <Metric label="New enquiries" value={metrics.newEnquiries} detail="Needs a response" accent />
      </div>
      <div className="admin-note-card">
        <span>↗</span>
        <div><h3>Buyer access stays simple</h3><p>Your public catalogue is open to buyers. They can send a quote request without registering or signing in.</p></div>
      </div>
    </div>
  )
}

function Metric({ label, value, detail, accent = false }) {
  return (
    <article className={`admin-metric-card${accent ? ' admin-metric-card--accent' : ''}`}>
      <p>{label}</p><strong>{value}</strong><span>{detail}</span>
    </article>
  )
}

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function ProductEditor({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    sku: product?.sku ?? '',
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    category_id: product?.category_id ?? '',
    material: product?.material ?? '',
    finish: product?.finish ?? '',
    dimensions: product?.dimensions ?? '',
    lead_time: product?.lead_time ?? '',
    description: product?.description ?? '',
    image_urls: (product?.image_urls ?? []).join('\n'),
    applications: (product?.applications ?? []).join(', '),
    moq: product?.moq ?? '',
    featured: Boolean(product?.featured),
    status: product?.status ?? 'draft',
    seo_title: product?.seo_title ?? '',
    seo_description: product?.seo_description ?? '',
  }))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const suggestedSlug = [slugify(form.name), slugify(form.sku)].filter(Boolean).join('-')

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function uploadImages(event) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return
    setError('')
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(async (file) => {
        if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
          throw new Error('Choose an image under 10 MB.')
        }
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
        const path = `${crypto.randomUUID()}-${safeName}`
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError
        return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
      }))
      setForm((current) => ({ ...current, image_urls: [...current.image_urls.split('\n').map((url) => url.trim()).filter(Boolean), ...urls].join('\n') }))
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload the selected image.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      sku: form.sku.trim().toUpperCase(),
      name: form.name.trim(),
      slug: form.slug.trim() || suggestedSlug,
      category_id: form.category_id || null,
      material: form.material.trim(),
      finish: form.finish.trim(),
      dimensions: form.dimensions.trim(),
      lead_time: form.lead_time.trim(),
      description: form.description.trim(),
      image_urls: form.image_urls.split('\n').map((url) => url.trim()).filter(Boolean),
      applications: form.applications.split(',').map((application) => application.trim()).filter(Boolean),
      moq: form.moq.trim(),
      featured: form.featured,
      status: form.status,
      seo_title: form.seo_title.trim(),
      seo_description: form.seo_description.trim(),
    }
    const request = product?.id
      ? supabase.from('products').update(payload).eq('id', product.id)
      : supabase.from('products').insert(payload)
    const { error: saveError } = await request
    setSaving(false)
    if (saveError) {
      setError(saveError.code === '23505' ? 'That SKU or product URL is already in use.' : 'Product could not be saved. Check the required fields and try again.')
      console.error('Product save failed:', saveError)
      return
    }
    await onSaved()
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="admin-editor-modal" role="dialog" aria-modal="true" aria-labelledby="product-editor-title">
        <div className="admin-modal-heading"><div><p className="admin-kicker">Catalogue</p><h2 id="product-editor-title">{product ? 'Edit product' : 'Add a product'}</h2></div><button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close editor">×</button></div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <form className="admin-form admin-product-form" onSubmit={handleSubmit}>
          <label>SKU <span>*</span><input required maxLength={80} value={form.sku} onChange={(event) => update('sku', event.target.value)} placeholder="ZE-ITEM-001" /></label>
          <label>Product name <span>*</span><input required maxLength={160} value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Product name" /></label>
          <label>Product URL slug<input value={form.slug} onChange={(event) => update('slug', event.target.value)} placeholder={suggestedSlug || 'product-name-sku'} /></label>
          <label>Category<select value={form.category_id} onChange={(event) => update('category_id', event.target.value)}><option value="">Uncategorised</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label>Material<input value={form.material} onChange={(event) => update('material', event.target.value)} placeholder="e.g. Iron, Mango wood" /></label>
          <label>Finish<input value={form.finish} onChange={(event) => update('finish', event.target.value)} placeholder="e.g. Antique brass" /></label>
          <label>Dimensions<input value={form.dimensions} onChange={(event) => update('dimensions', event.target.value)} placeholder="L × W × H" /></label>
          <label>Lead time<input value={form.lead_time} onChange={(event) => update('lead_time', event.target.value)} placeholder="e.g. 45–60 days" /></label>
          <label>MOQ<input value={form.moq} onChange={(event) => update('moq', event.target.value)} placeholder="e.g. 100 pieces" /></label>
          <label>Applications<input value={form.applications} onChange={(event) => update('applications', event.target.value)} placeholder="Retail, hospitality, home" /></label>
          <label className="admin-field-wide">Description<textarea rows="4" value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
          <label className="admin-field-wide">Image URLs, one per line<textarea rows="3" value={form.image_urls} onChange={(event) => update('image_urls', event.target.value)} placeholder="https://…" /></label>
          <label className="admin-field-wide admin-upload-label">Upload images (JPG, PNG or WebP; max 10 MB each)<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={uploadImages} disabled={uploading} />{uploading && <small>Uploading images…</small>}</label>
          <label>Status<select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label className="admin-checkbox-label"><input type="checkbox" checked={form.featured} onChange={(event) => update('featured', event.target.checked)} /> Feature on homepage</label>
          <label className="admin-field-wide">SEO title<input value={form.seo_title} onChange={(event) => update('seo_title', event.target.value)} /></label>
          <label className="admin-field-wide">SEO description<textarea rows="2" value={form.seo_description} onChange={(event) => update('seo_description', event.target.value)} /></label>
          <div className="admin-form-actions admin-field-wide"><button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="admin-primary-button" disabled={saving || uploading}>{saving ? 'Saving…' : product ? 'Save changes' : 'Create product'}</button></div>
        </form>
      </section>
    </div>
  )
}

function ProductsPanel() {
  const [rows, setRows] = useState([])
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const { refreshCatalog } = useCatalog()

  const loadRows = useCallback(async () => {
    const [productResult, categoryResult] = await Promise.all([
      supabase.from('products').select('*, category:categories(name, slug)').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name, slug, is_active').order('sort_order'),
    ])
    setLoading(false)
    if (productResult.error || categoryResult.error) {
      setError('Could not load products. Check that the database migration has been applied.')
      return
    }
    setError('')
    setRows(productResult.data ?? [])
    setCategories(categoryResult.data ?? [])
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadRows() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadRows])

  async function saveAndClose() {
    setEditing(undefined)
    setNotice('Product saved.')
    await Promise.all([loadRows(), refreshCatalog()])
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete ${product.name} (${product.sku})? This cannot be undone.`)) return
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id)
    if (deleteError) {
      setError('Product could not be deleted.')
      return
    }
    setNotice('Product deleted.')
    await Promise.all([loadRows(), refreshCatalog()])
  }

  return (
    <div>
      <div className="admin-panel-heading">
        <div><p className="admin-kicker">Catalogue management</p><h2>Products</h2></div>
        <button className="admin-primary-button" type="button" onClick={() => { setNotice(''); setEditing(null) }}>＋ Add product</button>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="admin-success" role="status">{notice}</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="admin-empty">Loading products…</td></tr>}
            {!loading && !rows.length && <tr><td colSpan="5" className="admin-empty">No products yet. Add your first catalogue item.</td></tr>}
            {!loading && rows.map((product) => {
              const category = Array.isArray(product.category) ? product.category[0] : product.category
              return <tr key={product.id}>
                <td><strong>{product.name}</strong>{product.featured && <span className="admin-featured-tag">Featured</span>}</td>
                <td>{product.sku}</td><td>{category?.name ?? '—'}</td>
                <td><span className={`admin-status admin-status--${product.status}`}>{product.status}</span></td>
                <td className="admin-row-actions"><button type="button" onClick={() => { setNotice(''); setEditing(product) }}>Edit</button><button type="button" className="admin-danger-link" onClick={() => deleteProduct(product)}>Delete</button></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      {editing !== undefined && <ProductEditor product={editing} categories={categories} onClose={() => setEditing(undefined)} onSaved={saveAndClose} />}
    </div>
  )
}

function CategoryEditor({ category, onClose, onSaved }) {
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [sortOrder, setSortOrder] = useState(String(category?.sort_order ?? 0))
  const [isActive, setIsActive] = useState(category?.is_active ?? true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = { name: name.trim(), slug: slug.trim() || slugify(name), sort_order: Number.parseInt(sortOrder, 10) || 0, is_active: isActive }
    const request = category?.id
      ? supabase.from('categories').update(payload).eq('id', category.id)
      : supabase.from('categories').insert(payload)
    const { error: saveError } = await request
    setSaving(false)
    if (saveError) {
      setError(saveError.code === '23505' ? 'That category URL is already in use.' : 'Category could not be saved.')
      return
    }
    await onSaved()
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="admin-editor-modal admin-category-modal" role="dialog" aria-modal="true" aria-labelledby="category-editor-title">
        <div className="admin-modal-heading"><div><p className="admin-kicker">Catalogue</p><h2 id="category-editor-title">{category ? 'Edit category' : 'Add a category'}</h2></div><button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close editor">×</button></div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Category name <span>*</span><input required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>URL slug<input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder={slugify(name)} /></label>
          <label>Display order<input type="number" min="0" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} /></label>
          <label className="admin-checkbox-label"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /> Visible on the public website</label>
          <div className="admin-form-actions admin-field-wide"><button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="admin-primary-button" disabled={saving}>{saving ? 'Saving…' : 'Save category'}</button></div>
        </form>
      </section>
    </div>
  )
}

function CategoriesPanel() {
  const [rows, setRows] = useState([])
  const [editing, setEditing] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const { refreshCatalog } = useCatalog()

  const loadRows = useCallback(async () => {
    const { data, error: queryError } = await supabase.from('categories').select('*').order('sort_order')
    setLoading(false)
    if (queryError) {
      setError('Could not load categories. Check that the database migration has been applied.')
      return
    }
    setError('')
    setRows(data ?? [])
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadRows() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadRows])

  async function saveAndClose() {
    setEditing(undefined)
    setNotice('Category saved.')
    await Promise.all([loadRows(), refreshCatalog()])
  }

  return (
    <div>
      <div className="admin-panel-heading">
        <div><p className="admin-kicker">Catalogue structure</p><h2>Categories</h2></div>
        <button className="admin-primary-button" type="button" onClick={() => { setNotice(''); setEditing(null) }}>＋ Add category</button>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="admin-success" role="status">{notice}</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Category</th><th>URL slug</th><th>Visibility</th><th>Order</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="admin-empty">Loading categories…</td></tr>}
            {!loading && !rows.length && <tr><td colSpan="5" className="admin-empty">No categories found.</td></tr>}
            {!loading && rows.map((category) => <tr key={category.id}>
              <td><strong>{category.name}</strong></td><td>{category.slug}</td>
              <td><span className={`admin-status ${category.is_active ? 'admin-status--published' : 'admin-status--draft'}`}>{category.is_active ? 'Visible' : 'Hidden'}</span></td>
              <td>{category.sort_order}</td><td className="admin-row-actions"><button type="button" onClick={() => { setNotice(''); setEditing(category) }}>Edit</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {editing !== undefined && <CategoryEditor category={editing} onClose={() => setEditing(undefined)} onSaved={saveAndClose} />}
    </div>
  )
}

const enquiryStatuses = ['new', 'contacted', 'quoted', 'closed']

function EnquiriesPanel() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadRows = useCallback(async () => {
    const { data, error: queryError } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(200)
    setLoading(false)
    if (queryError) {
      setError('Could not load enquiries. Check that the database migration has been applied.')
      return
    }
    setError('')
    setRows(data ?? [])
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadRows() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadRows])

  function updateRow(id, key, value) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row))
  }

  async function saveEnquiry(enquiry) {
    setError('')
    setNotice('')
    const { error: saveError } = await supabase.from('enquiries').update({ status: enquiry.status, internal_notes: enquiry.internal_notes }).eq('id', enquiry.id)
    if (saveError) {
      setError('Enquiry update failed. Please try again.')
      return
    }
    setNotice('Enquiry updated.')
  }

  return (
    <div>
      <div className="admin-panel-heading"><div><p className="admin-kicker">Buyer follow-up</p><h2>Quote enquiries</h2></div><button type="button" className="admin-secondary-button" onClick={() => void loadRows()}>Refresh</button></div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="admin-success" role="status">{notice}</p>}
      {loading && <div className="admin-empty-card">Loading enquiries…</div>}
      {!loading && !rows.length && <div className="admin-empty-card"><h3>No quote requests yet</h3><p>Buyer enquiries submitted through the public website will appear here.</p></div>}
      {!loading && rows.length > 0 && <div className="admin-enquiry-list">{rows.map((enquiry) => {
        const items = Array.isArray(enquiry.items) ? enquiry.items : []
        return <article className="admin-enquiry-card" key={enquiry.id}>
          <div className="admin-enquiry-topline"><div><p className="admin-kicker">{new Date(enquiry.created_at).toLocaleString()}</p><h3>{enquiry.company}</h3></div><span className="admin-reference">{enquiry.id.slice(0, 8).toUpperCase()}</span></div>
          <div className="admin-buyer-details"><strong>{enquiry.name}</strong><a href={`mailto:${encodeURIComponent(enquiry.email)}`}>{enquiry.email}</a><span>{enquiry.country || 'Country not provided'}</span></div>
          {items.length > 0 && <div className="admin-enquiry-items"><p className="admin-kicker">Requested products</p>{items.map((item, index) => <p key={`${item.sku}-${index}`}><strong>{item.quantity} ×</strong> {item.name} <span>({item.sku})</span></p>)}</div>}
          <div className="admin-enquiry-message"><p className="admin-kicker">Requirements</p><p>{enquiry.message}</p></div>
          <div className="admin-enquiry-controls"><label>Status<select value={enquiry.status} onChange={(event) => updateRow(enquiry.id, 'status', event.target.value)}>{enquiryStatuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></label><label className="admin-notes-field">Internal notes<textarea rows="2" value={enquiry.internal_notes ?? ''} onChange={(event) => updateRow(enquiry.id, 'internal_notes', event.target.value)} placeholder="Add a follow-up note" /></label><button className="admin-primary-button" type="button" onClick={() => saveEnquiry(enquiry)}>Save</button></div>
        </article>
      })}</div>}
    </div>
  )
}

function AdminDashboard({ user }) {
  const [activeView, setActiveView] = useState('overview')
  const activeItem = navigation.find((item) => item.id === activeView) ?? navigation[0]

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand"><span>ZAHID</span><small>EXPORTS · ADMIN</small></Link>
        <p className="admin-sidebar-label">Workspace</p>
        <nav aria-label="Admin navigation">
          {navigation.map((item) => <button key={item.id} type="button" className={activeView === item.id ? 'active' : ''} onClick={() => setActiveView(item.id)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="admin-sidebar-bottom"><div className="admin-user-badge">{user.email?.slice(0, 1).toUpperCase() ?? 'S'}</div><div className="admin-user-copy"><strong>Staff account</strong><span>{user.email}</span></div><button type="button" onClick={signOut} className="admin-signout" aria-label="Sign out">↗</button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><p className="admin-kicker">Staff workspace</p><h1>{activeItem.label}</h1></div><a href="/" className="admin-view-site">View website ↗</a></header>
        <section className="admin-workspace">
          {activeView === 'overview' && <OverviewPanel />}
          {activeView === 'products' && <ProductsPanel />}
          {activeView === 'categories' && <CategoriesPanel />}
          {activeView === 'enquiries' && <EnquiriesPanel />}
        </section>
        <footer className="admin-footer">Zahid Exports · Internal staff tools only. Buyer accounts are not available.</footer>
      </main>
    </div>
  )
}

function Admin() {
  const [session, setSession] = useState(null)
  const [sessionReady, setSessionReady] = useState(!isSupabaseConfigured)
  const [isAdmin, setIsAdmin] = useState(null)
  const [authIssue, setAuthIssue] = useState('')

  useEffect(() => {
    if (!supabase) return undefined

    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      setSession(data.session)
      setSessionReady(true)
      if (error) setAuthIssue('Could not check the current staff session.')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsAdmin(null)
      setSessionReady(true)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const userId = session?.user?.id
    if (!supabase || !userId) return undefined

    let active = true
    supabase.from('admin_users').select('user_id').eq('user_id', userId).maybeSingle().then(({ data, error }) => {
      if (!active) return
      if (error) {
        setAuthIssue('Unable to verify staff access. Check the database migration and admin membership.')
        setIsAdmin(false)
        return
      }
      setIsAdmin(Boolean(data))
    })

    return () => { active = false }
  }, [session?.user?.id])

  if (!isSupabaseConfigured) return <SetupRequired />
  if (!sessionReady) return <main className="admin-gate"><p className="admin-gate-loading">Checking staff session…</p></main>
  if (!session) return <AdminLogin authIssue={authIssue} />
  if (isAdmin === null) return <main className="admin-gate"><p className="admin-gate-loading">Verifying staff access…</p></main>
  if (!isAdmin) return <main className="admin-gate"><section className="admin-gate-card"><p className="admin-kicker">Staff access</p><h1>Access not authorised</h1><p>This account is not listed as a Zahid Exports staff administrator.</p>{authIssue && <p className="admin-error" role="alert">{authIssue}</p>}<button type="button" className="admin-primary-button" onClick={() => supabase.auth.signOut()}>Sign out</button></section></main>
  return <AdminDashboard user={session.user} />
}

export default Admin
