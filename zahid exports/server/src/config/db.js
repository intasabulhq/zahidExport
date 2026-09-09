import pg from 'pg'
import { env } from './env.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
})

pool.on('error', (error) => console.error('Unexpected PostgreSQL error', error))

export function query(text, params) {
  return pool.query(text, params)
}
