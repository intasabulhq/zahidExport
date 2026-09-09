import { Router } from 'express'
import { z } from 'zod'
import { query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const productSchema = z.object({
  name: z.string().min(2).max(180),
  sku: z.string().min(2).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().uuid().nullable().optional(),
  description: z.string().min(20),
  material: z.string().max(200).default(''),
  finish: z.string().max(200).default(''),
  dimensions: z.string().max(200).default(''),
  moq: z.string().max(100).default(''),
  applications: z.array(z.string().max(100)).default([]),
  imageAlt: z.string().max(240).default(''),
  seoTitle: z.string().max(70),
  seoDescription: z.string().max(170),
  seoKeywords: z.array(z.string().max(100)).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
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

  const result = await query(`
    SELECT p.id, p.name, p.sku, p.slug, p.description, p.material, p.finish, p.dimensions, p.moq,
      p.applications, p.image_alt, p.seo_title, p.seo_description, p.seo_keywords, p.featured,
      c.name AS category, c.slug AS category_slug,
      COALESCE(json_agg(pi.url ORDER BY pi.position) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE ${conditions.join(' AND ')}
    GROUP BY p.id, c.name, c.slug
    ORDER BY p.featured DESC, p.created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `, values)
  res.json({ products: result.rows, limit, offset })
})

router.get('/:slug', async (req, res) => {
  const result = await query(`
    SELECT p.*, c.name AS category, c.slug AS category_slug,
      COALESCE(json_agg(pi.url ORDER BY pi.position) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE p.slug = $1 AND p.status = 'published'
    GROUP BY p.id, c.name, c.slug
  `, [req.params.slug])
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.json({ product: result.rows[0] })
})

router.post('/', requireAuth, async (req, res) => {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid product data', fields: parsed.error.flatten().fieldErrors })
  const p = parsed.data
  const result = await query(`
    INSERT INTO products (name, sku, slug, category_id, description, material, finish, dimensions, moq, applications, image_alt, seo_title, seo_description, seo_keywords, featured, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *
  `, [p.name, p.sku, p.slug, p.categoryId || null, p.description, p.material, p.finish, p.dimensions, p.moq, JSON.stringify(p.applications), p.imageAlt, p.seoTitle, p.seoDescription, p.seoKeywords, p.featured, p.status])
  res.status(201).json({ product: result.rows[0] })
})

router.patch('/:id', requireAuth, async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid product data', fields: parsed.error.flatten().fieldErrors })
  const columnMap = { name: 'name', sku: 'sku', slug: 'slug', categoryId: 'category_id', description: 'description', material: 'material', finish: 'finish', dimensions: 'dimensions', moq: 'moq', applications: 'applications', imageAlt: 'image_alt', seoTitle: 'seo_title', seoDescription: 'seo_description', seoKeywords: 'seo_keywords', featured: 'featured', status: 'status' }
  const entries = Object.entries(parsed.data)
  if (!entries.length) return res.status(400).json({ error: 'No fields supplied' })
  const values = entries.map(([, value]) => Array.isArray(value) && entries.some(([key, current]) => current === value && key === 'applications') ? JSON.stringify(value) : value)
  const updates = entries.map(([key], index) => `${columnMap[key]} = $${index + 1}`)
  values.push(req.params.id)
  const result = await query(`UPDATE products SET ${updates.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`, values)
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.json({ product: result.rows[0] })
})

router.delete('/:id', requireAuth, async (req, res) => {
  const result = await query("UPDATE products SET status = 'archived', updated_at = now() WHERE id = $1 RETURNING id", [req.params.id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' })
  res.status(204).end()
})

export default router
