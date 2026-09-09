import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { pool } from '../config/db.js'

const here = dirname(fileURLToPath(import.meta.url))
const migrationPath = resolve(here, '../../migrations/001_initial.sql')

try {
  const sql = await fs.readFile(migrationPath, 'utf8')
  await pool.query(sql)
  console.log('Database migration completed')
} finally {
  await pool.end()
}
