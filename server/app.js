import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import helmet from 'helmet'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const clientDist = path.join(here, '..', 'client', 'dist')

export function createApp() {
  const app = express()
  app.disable('x-powered-by')

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

  app.use(express.json({ limit: '50kb' }))

  app.use('/api', routes)
  app.use('/api', notFound)

  // After "npm run build" the API can also serve the finished website (single-address deployment)
  if (fs.existsSync(path.join(clientDist, 'index.html'))) {
    app.use(express.static(clientDist))
    app.get('/{*splat}', (req, res) => res.sendFile(path.join(clientDist, 'index.html')))
  }

  app.use(errorHandler)
  return app
}
