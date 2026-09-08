import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(12).optional(),
  ADMIN_NAME: z.string().default('Zahid Exports Admin'),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid server environment:', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
