import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { query } from '../config/db.js'
import { env } from '../config/env.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(200) })
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false })

router.post('/login', loginLimiter, async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Valid email and password are required' })

  const result = await query('SELECT id, name, email, password_hash, is_active FROM admins WHERE lower(email) = lower($1) LIMIT 1', [parsed.data.email])
  const admin = result.rows[0]
  if (!admin || !admin.is_active || !(await bcrypt.compare(parsed.data.password, admin.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = jwt.sign({ sub: admin.id, email: admin.email, name: admin.name, role: 'admin' }, env.JWT_SECRET, { expiresIn: '8h' })
  res.cookie('zahid_admin', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  })
  res.json({ admin: { id: admin.id, name: admin.name, email: admin.email } })
})

router.get('/me', requireAuth, (req, res) => res.json({ admin: req.admin }))

router.post('/logout', (req, res) => {
  res.clearCookie('zahid_admin', { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', path: '/' })
  res.status(204).end()
})

export default router
