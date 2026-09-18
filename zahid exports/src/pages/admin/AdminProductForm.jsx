import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest, uploadProductImages } from '../../admin/api'
import './admin.css'
import './admin-products.css'
import './admin-image-upload.css'

const emptyForm = { name: '', sku: '', slug: '', description: '', material: '', finish: '', dimensions: '', moq: '', applications: '', images: [], imageAlt: '', seoTitle: '', seoDescription: '', seoKeywords: '', featured: false, status: 'draft', categoryId: null }
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff', 'image/bmp', 'image/x-ms-bmp'])
const makeSlug = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const splitList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean)
const normalizeImage = (image, index) => typeof image === 'string'
  ? { url: image, publicId: null, altText: '', position: index, persisted: true }
  : { url: image.url, publicId: image.publicId ?? null, altText: image.altText || '', position: index, persisted: true }

function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [slugEdited, setSlugEdited] = useState(false)
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deletingImage, setDeletingImage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/api/products/admin/categories')
      .then(({ categories: loadedCategories }) => active && setCategories(loadedCategories || []))
      .catch((requestError) => active && setError(requestError.message))
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!editing) return
    let active = true
    apiRequest(`/api/products/admin/${id}`).then(({ product }) => {
      if (!active) return
      setForm({
        name: product.name || '', sku: product.sku || '', slug: product.slug || '',
        description: product.description || '', material: product.material || '', finish: product.finish || '',
        dimensions: product.dimensions || '', moq: product.moq || '', applications: (product.applications || []).join(', '),
        images: (product.images || []).map(normalizeImage), imageAlt: product.image_alt || '',
        seoTitle: product.seo_title || '', seoDescription: product.seo_description || '',
        seoKeywords: (product.seo_keywords || []).join(', '), featured: Boolean(product.featured),
        status: product.status || 'draft', categoryId: product.category_id || null,
      })
      setSlugEdited(true)
    }).catch((requestError) => active && setError(requestError.message)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [editing, id])

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const handleNameChange = (event) => {
    const name = event.target.value
    setForm((current) => ({ ...current, name, ...(!slugEdited ? { slug: makeSlug(name) } : {}) }))
  }

  const chooseImages = async (event) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    if (form.images.length + files.length > 12) return setError('Maximum 12 images are allowed per product')
    const invalid = files.find((file) => !allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024)
    if (invalid) return setError(`${invalid.name} must be JPG, PNG, WebP, GIF, TIFF or BMP and 5 MB or smaller`)

    setUploading(true)
    setUploadProgress(0)
    setError('')
    try {
      const data = await uploadProductImages(files, setUploadProgress)
      const uploaded = (data.images || []).map((image, index) => ({
        ...image,
        altText: form.imageAlt || form.name || image.originalName || '',
        position: form.images.length + index,
        persisted: false,
      }))
      setForm((current) => ({ ...current, images: [...current.images, ...uploaded] }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeImage = async (index) => {
    const image = form.images[index]
    const key = image.publicId || image.url
    setDeletingImage(key)
    setError('')
    try {
      if (!image.persisted && image.publicId) {
        await apiRequest('/api/uploads/images', { method: 'DELETE', body: JSON.stringify({ publicId: image.publicId }) })
      }
      setForm((current) => ({ ...current, images: current.images.filter((_, itemIndex) => itemIndex !== index) }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDeletingImage('')
    }
  }

  const moveImage = (index, offset) => {
    const nextIndex = index + offset
    if (nextIndex < 0 || nextIndex >= form.images.length) return
    setForm((current) => {
      const images = [...current.images]
      ;[images[index], images[nextIndex]] = [images[nextIndex], images[index]]
      return { ...current, images }
    })
  }

  const makeMainImage = (index) => {
    if (index === 0) return
    setForm((current) => {
      const images = [...current.images]
      const [selected] = images.splice(index, 1)
      images.unshift(selected)
      return { ...current, images }
    })
  }

  const setImageAlt = (index, altText) => setForm((current) => ({
    ...current,
    images: current.images.map((image, itemIndex) => itemIndex === index ? { ...image, altText } : image),
  }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (uploading) return
    setSaving(true)
    setError('')
    const images = form.images.map((image, position) => ({
      url: image.url,
      publicId: image.publicId || null,
      altText: image.altText.trim(),
      position,
    }))
    const payload = {
      ...form,
      images,
      imageAlt: images[0]?.altText || form.imageAlt,
      applications: splitList(form.applications),
      seoKeywords: splitList(form.seoKeywords),
      categoryId: form.categoryId || null,
    }
    delete payload.persisted
    try {
      await apiRequest(editing ? `/api/products/${id}` : '/api/products', { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(payload) })
      navigate('/admin/products', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading product…</div>

  return <div className="admin-shell">
    <header className="admin-module-topbar"><div><Link to="/admin/products">← Products</Link><span>{editing ? 'Edit product' : 'New product'}</span></div></header>
    <main className="admin-product-form-main">
      <section className="admin-products-heading"><div><p className="admin-kicker">Catalogue editor</p><h1>{editing ? 'Edit product' : 'Add product'}</h1><p>Draft products stay private until their status is changed to published.</p></div></section>
      {error && <p className="admin-module-error" role="alert">{error}</p>}
      <form className="admin-product-form" onSubmit={handleSubmit}>
        <fieldset><legend>Identity</legend><div className="admin-form-grid">
          <label className="admin-field-wide"><span>Product name *</span><input required minLength="2" maxLength="180" value={form.name} onChange={handleNameChange} /></label>
          <label><span>SKU *</span><input required minLength="2" maxLength="100" value={form.sku} onChange={(event) => setField('sku', event.target.value)} /></label>
          <label><span>URL slug *</span><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => { setSlugEdited(true); setField('slug', makeSlug(event.target.value)) }} /></label>
          <label className="admin-field-wide"><span>Description * (minimum 20 characters)</span><textarea required minLength="20" rows="5" value={form.description} onChange={(event) => setField('description', event.target.value)} /></label>
        </div></fieldset>

        <fieldset><legend>Product details</legend><div className="admin-form-grid">
          <label><span>Material</span><input maxLength="200" value={form.material} onChange={(event) => setField('material', event.target.value)} /></label>
          <label><span>Finish</span><input maxLength="200" value={form.finish} onChange={(event) => setField('finish', event.target.value)} /></label>
          <label><span>Dimensions</span><input maxLength="200" value={form.dimensions} onChange={(event) => setField('dimensions', event.target.value)} /></label>
          <label><span>MOQ</span><input maxLength="100" value={form.moq} onChange={(event) => setField('moq', event.target.value)} /></label>
          <label><span>Category</span><select value={form.categoryId || ''} onChange={(event) => setField('categoryId', event.target.value || null)}><option value="">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="admin-field-wide"><span>Applications (comma separated)</span><input value={form.applications} onChange={(event) => setField('applications', event.target.value)} placeholder="Hospitality, Retail, Interior Projects" /></label>
        </div></fieldset>

        <fieldset><legend>Product images</legend>
          <div className="admin-image-toolbar">
            <label className="admin-image-picker"><input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.tif,.tiff,.bmp,image/jpeg,image/png,image/webp,image/gif,image/tiff,image/bmp,image/x-ms-bmp" multiple disabled={uploading || form.images.length >= 12} onChange={chooseImages} /><span>{uploading ? `Uploading ${uploadProgress}%` : 'Choose images'}</span></label>
            <p>JPG, PNG, WebP, GIF, TIFF or BMP · 5 MB each · {form.images.length}/12 images</p>
          </div>
          {uploading && <div className="admin-upload-progress" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${uploadProgress}%` }} /></div>}
          {form.images.length ? <div className="admin-image-grid">{form.images.map((image, index) => {
            const key = image.publicId || image.url
            return <article className={`admin-image-card ${index === 0 ? 'is-main' : ''}`} key={key}>
              <div className="admin-image-preview"><img src={image.url} alt={image.altText || `Product preview ${index + 1}`} />{index === 0 && <strong>Main image</strong>}</div>
              <label><span>Alt text</span><input maxLength="240" value={image.altText} onChange={(event) => setImageAlt(index, event.target.value)} placeholder="Describe this product image" /></label>
              <div className="admin-image-actions">
                <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>←</button>
                <button type="button" onClick={() => moveImage(index, 1)} disabled={index === form.images.length - 1}>→</button>
                {index !== 0 && <button type="button" onClick={() => makeMainImage(index)}>Make main</button>}
                <button className="danger" type="button" onClick={() => removeImage(index)} disabled={deletingImage === key}>{deletingImage === key ? 'Removing…' : 'Remove'}</button>
              </div>
            </article>
          })}</div> : <div className="admin-image-empty">No images selected yet.</div>}
        </fieldset>

        <fieldset><legend>SEO and publishing</legend><div className="admin-form-grid">
          <label className="admin-field-wide"><span>SEO title (maximum 70 characters)</span><input maxLength="70" value={form.seoTitle} onChange={(event) => setField('seoTitle', event.target.value)} /></label>
          <label className="admin-field-wide"><span>SEO description (maximum 170 characters)</span><textarea rows="3" maxLength="170" value={form.seoDescription} onChange={(event) => setField('seoDescription', event.target.value)} /></label>
          <label className="admin-field-wide"><span>SEO keywords (comma separated)</span><input value={form.seoKeywords} onChange={(event) => setField('seoKeywords', event.target.value)} /></label>
          <label><span>Status</span><select value={form.status} onChange={(event) => setField('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          <label className="admin-checkbox"><input type="checkbox" checked={form.featured} onChange={(event) => setField('featured', event.target.checked)} /><span>Featured product</span></label>
        </div></fieldset>
        <div className="admin-form-actions"><Link to="/admin/products">Cancel</Link><button type="submit" disabled={saving || uploading}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create product'}</button></div>
      </form>
    </main>
  </div>
}

export default AdminProductForm
