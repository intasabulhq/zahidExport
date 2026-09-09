import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function requireAuth(req, res, next) {
  const token = req.cookies?.zahid_admin
  if (!token) return res.status(401).json({ error: 'Authentication required' })

  try {
    req.admin = jwt.verify(token, env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid' })
  }
}
