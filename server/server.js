import 'dotenv/config'
import { createApp } from './app.js'
import { checkConnection, explainDbError, dbConfig } from './config/db.js'

const PORT = Number(process.env.PORT) || 5000
const app = createApp()

app.listen(PORT, async () => {
  console.log(`API running on http://localhost:${PORT}/api  (try /api/health)`)

  const db = await checkConnection()
  if (db.ok) {
    console.log(`MySQL connected: database "${dbConfig.database}" with ${db.puppies} puppies.`)
  } else {
    console.warn('\n!! The API started, but the database is not ready.')
    console.warn('   ' + explainDbError(db.error))
    console.warn('   First time? Run  npm run db:setup  (it creates the database, tables and sample data).\n')
  }
})
