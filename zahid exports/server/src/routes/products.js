import { Router } from 'express'
import { z } from 'zod'
import { pool, query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const statusValues = ['draft', 'published', 'archived']
const productSchema = z.object({
  name: z.string().trim().min(2).max(180),
  sku: z.string().trim().min(2).max(100),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().uuid().nullable().optional(),
  description: z.string().trim().min(20),
  material: z.string().trim().max(200).default(''),
  finish: z.string().trim().max(200).default(''),
  dimensions: z.string().trim().max(200).default(''),
  moq: z.string().trim().max(100).default(''),
  applications: z.array(z.string().trim().min(1).max(100)).default([]),
  images: z.array(z.string().url().max(2000)).max(12).default([]),
  imageAlt: z.string().trim().max(240).default(''),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
  seoKeywords: z.array(z.string().trim().min(1).max(100)).default([]),
  featured: z.boolean().default(false),
  status: z.enum(statusValues).default('draft'),
})

const productColumns = `
  p.id, p.category_id, p.name, p.sku, p.slug, p.description, p.material, p.finish,
  p.dimensions, p.moq, p.applications, p.image_alt, p.seo_title, p.seo_description,
  p.seo_keywords, p.featured, p.status, p.created_at, p.updated_at,
  c.name AS category, c.slug AS category_slug,
  COALESCE((SELECT json_agg(pi.url ORDER BY pi.position) FROM product_images pi WHERE pi.product_id = p.id), '[]') AS images
`

async function replaceImages(client, productId, images, imageAlt) {
  await client.query('DELETE FROM product_images WHERE product_id = $1', [productId])
  for (const [position, url] of images.entries()) {
    await client.query('INSERT INTO product_images (product_id, url, alt_text, position) VALUES ($1, $2, $3, $4)', [productId, url, imageAlt || '', position])
  }
}

function sendWriteError(error, res) {
  if (error.code === '23505') {
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

router.get('/admin/:id', requireAuth, async (req, res) => {
  const result = await query(`SELECT ${productColumns} FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = $1`, [req.params.id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.json({ product: result.rows[0] })
})

router.get('/', async (req, res) => {
  const search = String(req.query.search || '').trim()
  const category = String(req.query.category || '').trim()
  const limit = Math.min(Math.max(Number(req.query.limit) || 24, 1), 100)
  const offset = Math.max(Number(req.query.offset) || 0, 0)
  const values = []
  const conditions = ["p.status = 'published'"]
  if (search) {
    values.push(`%${search}%`)
    conditions.push(`(p.name ILIKE $${values.length} OR p.sku ILIKE $${values.length} OR p.description ILIKE $${values.length})`)
  }
  if (category) {
    values.push(category)
    conditions.push(`c.slug = $${values.length}`)
  }
  values.push(limit, offset)
  const result = await query(`SELECT ${productColumns} FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE ${conditions.join(' AND ')} ORDER BY p.featured DESC, p.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values)
  res.json({ products: result.rows, limit, offset })
})

router.get('/:slug', async (req, res) => {
  const result = await query(`SELECT ${productColumns} FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.slug = $1 AND p.status = 'published'`, [req.params.slug])
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.json({ product: result.rows[0] })
})

router.post('/', requireAuth, async (req, res) => {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid product data', fields: parsed.error.flatten().fieldErrors })
  const p = parsed.data
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(`INSERT INTO products (name, sku, slug, category_id, description, material, finish, dimensions, moq, applications, image_alt, seo_title, seo_description, seo_keywords, featured, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`, [p.name, p.sku, p.slug, p.categoryId || null, p.description, p.material, p.finish, p.dimensions, p.moq, JSON.stringify(p.applications), p.imageAlt, p.seoTitle, p.seoDescription, p.seoKeywords, p.featured, p.status])
    await replaceImages(client, result.rows[0].id, p.images, p.imageAlt)
    await client.query('COMMIT')
    res.status(201).json({ product: { ...result.rows[0], images: p.images } })
  } catch (error) {
    await client.query('ROLLBACK')
    if (!sendWriteError(error, res)) throw error
  } finally {
    client.release()
  }
})

router.patch('/:id', requireAuth, async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid product data', fields: parsed.error.flatten().fieldErrors })
  const { images, ...changes } = parsed.data
  if (!Object.keys(changes).length && images === undefined) return res.status(400).json({ error: 'No fields supplied' })
  const columnMap = { name: 'name', sku: 'sku', slug: 'slug', categoryId: 'category_id', description: 'description', material: 'material', finish: 'finish', dimensions: 'dimensions', moq: 'moq', applications: 'applications', imageAlt: 'image_alt', seoTitle: 'seo_title', seoDescription: 'seo_description', seoKeywords: 'seo_keywords', featured: 'featured', status: 'status' }
  const entries = Object.entries(changes)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    let product
    if (entries.length) {
      const values = entries.map(([key, value]) => key === 'applications' ? JSON.stringify(value) : value)
      const updates = entries.map(([key], index) => `${columnMap[key]} = $${index + 1}`)
      values.push(req.params.id)
      const result = await client.query(`UPDATE products SET ${updates.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`, values)
      product = result.rows[0]
    } else {
      const result = await client.query('SELECT * FROM products WHERE id = $1', [req.params.id])
      product = result.rows[0]
    }
    if (!product) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Product not found' })
    }
    if (images !== undefined) await replaceImages(client, product.id, images, changes.imageAlt ?? product.image_alt)
    await client.query('COMMIT')
    res.json({ product: { ...product, ...(images !== undefined ? { images } : {}) } })
  } catch (error) {
    await client.query('ROLLBACK')
    if (!sendWriteError(error, res)) throw error
  } finally {
    client.release()
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  const result = await query("UPDATE products SET status = 'archived', updated_at = now() WHERE id = $1 RETURNING id", [req.params.id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.status(204).end()
})

export default router
