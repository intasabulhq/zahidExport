import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { query } from './config/db.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import enquiryRoutes from './routes/enquiries.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()), credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }))

app.get('/api/health', async (req, res) => {
  await query('SELECT 1')
  res.json({ status: 'ok', service: 'zahid-exports-api', timestamp: new Date().toISOString() })
})
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use(notFound)
app.use(errorHandler)

app.listen(env.PORT, () => console.log(`Zahid Exports API running on port ${env.PORT}`))
