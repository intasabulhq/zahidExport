import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { query } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const submitLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: true, legacyHeaders: false })
const enquirySchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(180).default(''),
  email: z.string().email(),
  country: z.string().min(2).max(100),
  category: z.string().max(120).default(''),
  product: z.string().max(180).default(''),
  sku: z.string().max(100).default(''),
  quantity: z.string().max(100).default(''),
  message: z.string().min(10).max(5000),
})

router.post('/', submitLimiter, async (req, res) => {
  const parsed = enquirySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Please check the enquiry fields', fields: parsed.error.flatten().fieldErrors })
  const e = parsed.data
  const result = await query(`
    INSERT INTO enquiries (name, company, email, country, category, product_name, sku, quantity, message, source)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'website') RETURNING id, status, created_at
  `, [e.name, e.company, e.email, e.country, e.category, e.product, e.sku, e.quantity, e.message])
  res.status(201).json({ enquiry: result.rows[0] })
})

router.get('/', requireAuth, async (req, res) => {
  const status = String(req.query.status || '').trim()
  const values = []
  const where = status ? (values.push(status), 'WHERE status = $1') : ''
  const result = await query(`SELECT * FROM enquiries ${where} ORDER BY created_at DESC LIMIT 200`, values)
  res.json({ enquiries: result.rows })
})

router.patch('/:id/status', requireAuth, async (req, res) => {
  const parsed = z.object({ status: z.enum(['new', 'contacted', 'qualified', 'closed']) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid enquiry status' })
  const result = await query('UPDATE enquiries SET status = $1, updated_at = now() WHERE id = $2 RETURNING *', [parsed.data.status, req.params.id])
  if (!result.rows[0]) return res.status(404).json({ error: 'Enquiry not found' })
  res.json({ enquiry: result.rows[0] })
})

export default router
