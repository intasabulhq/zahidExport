import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { pool, query } from '../config/db.js'

if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first')
  process.exit(1)
}

try {
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12)
  const result = await query(`
    INSERT INTO admins (name, email, password_hash)
    VALUES ($1, lower($2), $3)
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, is_active = true, updated_at = now()
    RETURNING id, name, email
  `, [env.ADMIN_NAME, env.ADMIN_EMAIL, passwordHash])
  console.log('Admin account ready:', result.rows[0].email)
} finally {
  await pool.end()
}
