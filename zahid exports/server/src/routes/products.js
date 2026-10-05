import { Router } from 'express'
import { cloudinary } from '../config/cloudinary.js'
import { pool, query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { productCreateSchema, productPatchSchema, productIdSchema, productStatusValues } from '../validation/products.js'

const router = Router()
const statusValues = productStatusValues

const productColumns = `
  p.id, p.category_id, p.name, p.sku, p.slug, p.description, p.material, p.finish,
  p.dimensions, p.moq, p.applications, p.image_alt, p.seo_title, p.seo_description,
  p.seo_keywords, p.featured, p.status, p.created_at, p.updated_at,
  c.name AS category, c.slug AS category_slug,
  COALESCE((
    SELECT json_agg(json_build_object(
      'url', pi.url,
      'publicId', pi.public_id,
      'altText', pi.alt_text,
      'position', pi.position
    ) ORDER BY pi.position)
    FROM product_images pi
    WHERE pi.product_id = p.id
  ), '[]'::json) AS images
`

function normalizeImage(image, imageAlt = '') {
  if (typeof image === 'string') return { url: image, publicId: null, altText: imageAlt }
  return { url: image.url, publicId: image.publicId || null, altText: image.altText || imageAlt }
}

async function replaceImages(client, productId, images, imageAlt) {
  const existing = await client.query('SELECT public_id FROM product_images WHERE product_id = $1 AND public_id IS NOT NULL', [productId])
  const normalizedImages = images.map((image) => normalizeImage(image, imageAlt))
  const incomingPublicIds = new Set(normalizedImages.map((image) => image.publicId).filter(Boolean))
  const removedPublicIds = existing.rows.map((row) => row.public_id).filter((publicId) => !incomingPublicIds.has(publicId))

  await client.query('DELETE FROM product_images WHERE product_id = $1', [productId])
  for (const [position, image] of normalizedImages.entries()) {
    await client.query(
      'INSERT INTO product_images (product_id, url, public_id, alt_text, position) VALUES ($1, $2, $3, $4, $5)',
      [productId, image.url, image.publicId, image.altText, position],
    )
  }

  return { normalizedImages, removedPublicIds }
}

async function destroyRemovedImages(publicIds) {
  const results = await Promise.allSettled(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId, { invalidate: true })))
  results.forEach((result, index) => {
    if (result.status === 'rejected') console.error(`Unable to delete Cloudinary image ${publicIds[index]}`, result.reason)
  })
}

function sendWriteError(error, res) {
  if (error.code === '23505') {
    if (error.constraint?.includes('public_id')) {
      res.status(409).json({ error: 'One of these images is already assigned to a product' })
      return true
    }
    const field = error.constraint?.includes('sku') ? 'SKU' : 'slug'
    res.status(409).json({ error: `A product with this ${field} already exists` })
    return true
  }
  if (error.code === '23503') {
    res.status(400).json({ error: 'The selected category no longer exists' })
    return true
  }
  return false
}

router.get('/admin/list', requireAuth, async (req, res) => {
  const search = String(req.query.search || '').trim()
  const status = String(req.query.status || '').trim()
  const values = []
  const conditions = []
  if (search) {
    values.push(`%${search}%`)
    conditions.push(`(p.name ILIKE $${values.length} OR p.sku ILIKE $${values.length} OR p.slug ILIKE $${values.length})`)
  }
  if (statusValues.includes(status)) {
    values.push(status)
    conditions.push(`p.status = $${values.length}`)
  }
  const result = await query(`SELECT ${productColumns} FROM products p LEFT JOIN categories c ON c.id = p.category_id ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''} ORDER BY p.updated_at DESC LIMIT 200`, values)
  res.json({ products: result.rows })
})

router.get('/admin/categories', requireAuth, async (req, res) => {
  const result = await query("SELECT id, name, slug FROM categories WHERE status = 'published' ORDER BY name ASC")
  res.json({ categories: result.rows })
})

router.get('/admin/:id', requireAuth, async (req, res) => {
  if (!productIdSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'Invalid product ID' })
  const result = await query(`SELECT ${productColumns} FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = $1`, [req.params.id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.json({ product: result.rows[0] })
})

router.get('/', async (req, res) => {
  const search = String(req.query.search || '').trim()
  const category = String(req.query.category || '').trim()
  const limit = req.query.limit === undefined ? 24 : Number(req.query.limit)
  const offset = req.query.offset === undefined ? 0 : Number(req.query.offset)
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger(offset) || offset < 0) {
    return res.status(400).json({ error: 'limit must be an integer from 1 to 100 and offset must be a non-negative integer' })
  }
  const values = []
  const conditions = ["p.status = 'published'"]
  if (search) {
    values.push(`%${search}%`)
    conditions.push(`(p.name ILIKE $${values.length} OR p.sku ILIKE $${values.length} OR p.description ILIKE $${values.length} OR c.name ILIKE $${values.length})`)
  }
  if (category) {
    values.push(category)
    conditions.push(`c.slug = $${values.length}`)
  }
  values.push(limit, offset)
  const result = await query(`SELECT ${productColumns} FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE ${conditions.join(' AND ')} ORDER BY p.featured DESC, p.created_at DESC, p.id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values)
  res.json({ products: result.rows, limit, offset })
})

router.get('/:slug', async (req, res) => {
  const result = await query(`SELECT ${productColumns} FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.slug = $1 AND p.status = 'published'`, [req.params.slug])
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.json({ product: result.rows[0] })
})

router.post('/', requireAuth, async (req, res) => {
  const parsed = productCreateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid product data', fields: parsed.error.flatten().fieldErrors })
  const p = parsed.data
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(
      'INSERT INTO products (name, sku, slug, category_id, description, material, finish, dimensions, moq, applications, image_alt, seo_title, seo_description, seo_keywords, featured, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',
      [p.name, p.sku, p.slug, p.categoryId, p.description, p.material, p.finish, p.dimensions, p.moq, JSON.stringify(p.applications), p.imageAlt, p.seoTitle, p.seoDescription, p.seoKeywords, p.featured, p.status],
    )
    const { normalizedImages } = await replaceImages(client, result.rows[0].id, p.images, p.imageAlt)
    await client.query('COMMIT')
    res.status(201).json({ product: { ...result.rows[0], images: normalizedImages } })
  } catch (error) {
    await client.query('ROLLBACK')
    if (!sendWriteError(error, res)) throw error
  } finally {
    client.release()
  }
})

router.patch('/:id', requireAuth, async (req, res) => {
  if (!productIdSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'Invalid product ID' })
  const parsed = productPatchSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid product data', fields: parsed.error.flatten().fieldErrors })
  const { images, ...changes } = parsed.data
  if (!Object.keys(changes).length && images === undefined) return res.status(400).json({ error: 'No fields supplied' })
  const columnMap = { name: 'name', sku: 'sku', slug: 'slug', categoryId: 'category_id', description: 'description', material: 'material', finish: 'finish', dimensions: 'dimensions', moq: 'moq', applications: 'applications', imageAlt: 'image_alt', seoTitle: 'seo_title', seoDescription: 'seo_description', seoKeywords: 'seo_keywords', featured: 'featured', status: 'status' }
  const entries = Object.entries(changes)
  const client = await pool.connect()
  let removedPublicIds = []
  let responseImages

  try {
    await client.query('BEGIN')
    // Serialize updates to a product and validate publication against the
    // resulting stored record, not only the fields present in this request.
    const existing = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [req.params.id])
    let product = existing.rows[0]
    if (!product) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Product not found' })
    }
    const nextStatus = changes.status ?? product.status
    const nextCategoryId = changes.categoryId ?? product.category_id
    if (nextStatus === 'published' || changes.categoryId !== undefined) {
      const category = nextCategoryId
        ? await client.query('SELECT id, status FROM categories WHERE id = $1 FOR SHARE', [nextCategoryId])
        : { rows: [] }
      if (!category.rows[0] || category.rows[0].status !== 'published') {
        await client.query('ROLLBACK')
        return res.status(400).json({ error: 'Select a published category before saving or publishing this product', fields: { categoryId: ['Select a published category'] } })
      }
    }

    const values = entries.map(([key, value]) => key === 'applications' ? JSON.stringify(value) : value)
    const updates = entries.map(([key], index) => `${columnMap[key]} = $${index + 1}`)
    values.push(req.params.id)
    const result = await client.query(`UPDATE products SET ${updates.length ? `${updates.join(', ')}, ` : ''}updated_at = now() WHERE id = $${values.length} RETURNING *`, values)
    product = result.rows[0]

    // Omitted images leave database rows and Cloudinary assets untouched.
    // An explicitly supplied empty array remains an intentional removal.
    if (images !== undefined) {
      const replacement = await replaceImages(client, product.id, images, changes.imageAlt ?? product.image_alt)
      removedPublicIds = replacement.removedPublicIds
      responseImages = replacement.normalizedImages
    }

    await client.query('COMMIT')
    if (removedPublicIds.length) await destroyRemovedImages(removedPublicIds)
    res.json({ product: { ...product, ...(responseImages ? { images: responseImages } : {}) } })
  } catch (error) {
    await client.query('ROLLBACK')
    if (!sendWriteError(error, res)) throw error
  } finally {
    client.release()
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  if (!productIdSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'Invalid product ID' })
  const result = await query("UPDATE products SET status = 'archived', updated_at = now() WHERE id = $1 RETURNING id", [req.params.id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.status(204).end()
})

export default router
