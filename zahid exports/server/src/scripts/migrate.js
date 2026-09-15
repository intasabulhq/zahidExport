import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { pool } from '../config/db.js'

const here = dirname(fileURLToPath(import.meta.url))
const migrationsDirectory = resolve(here, '../../migrations')

const client = await pool.connect()

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const migrationFiles = (await fs.readdir(migrationsDirectory))
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort()

  for (const fileName of migrationFiles) {
    const existingMigration = await client.query(
      'SELECT 1 FROM schema_migrations WHERE name = $1',
      [fileName],
    )

    if (existingMigration.rowCount) {
      console.log(`Skipping migration: ${fileName}`)
      continue
    }

    const migrationPath = resolve(migrationsDirectory, fileName)
    const sql = await fs.readFile(migrationPath, 'utf8')

    await client.query('BEGIN')

    try {
      await client.query(sql)
      await client.query(
        'INSERT INTO schema_migrations (name) VALUES ($1)',
        [fileName],
      )
      await client.query('COMMIT')
      console.log(`Applied migration: ${fileName}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }

  console.log('Database migrations completed')
} finally {
  client.release()
  await pool.end()
}