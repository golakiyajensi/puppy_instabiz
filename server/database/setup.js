// Creates the database, all tables and the sample data.
//   npm run db:setup          (from the project root or from /server)
// WARNING: it drops and re-creates the tables, so running it again resets the database.
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import { dbConfig, explainDbError } from '../config/db.js'

const dir = path.dirname(fileURLToPath(import.meta.url))
const files = ['schema.sql', 'seed.sql']

async function main() {
  console.log(`Connecting to MySQL at ${dbConfig.host}:${dbConfig.port} as "${dbConfig.user}" ...`)
  const conn = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true, // lets one query() run a whole .sql file
    charset: 'utf8mb4',
  })

  for (const file of files) {
    let sql = fs.readFileSync(path.join(dir, file), 'utf8')
    // the .sql files are written for "puppy_clone"; use another name when DB_NAME says so
    if (dbConfig.database !== 'puppy_clone') sql = sql.replaceAll('puppy_clone', dbConfig.database)
    process.stdout.write(`  running ${file} ... `)
    await conn.query(sql)
    console.log('done')
  }

  const [[counts]] = await conn.query(
    `SELECT (SELECT COUNT(*) FROM \`${dbConfig.database}\`.puppies WHERE status = 'available') AS available,
            (SELECT COUNT(*) FROM \`${dbConfig.database}\`.puppies WHERE status = 'gone_home') AS gone_home,
            (SELECT COUNT(*) FROM \`${dbConfig.database}\`.puppy_images) AS photos,
            (SELECT COUNT(*) FROM \`${dbConfig.database}\`.faqs) AS faqs,
            (SELECT COUNT(*) FROM \`${dbConfig.database}\`.family_photos) AS family_photos`,
  )
  await conn.end()

  console.log(`\nDatabase "${dbConfig.database}" is ready:`)
  console.log(`  ${counts.available} available puppies, ${counts.gone_home} gone home, ${counts.photos} puppy photos,`)
  console.log(`  ${counts.faqs} FAQs, ${counts.family_photos} family photos.`)
  console.log('\nNext: start the API with  npm run dev  (in /server) or run both apps from the project root.')
}

main().catch((err) => {
  console.error('\nSetup failed.\n' + explainDbError(err))
  if (!err.code) console.error(err)
  process.exit(1)
})
