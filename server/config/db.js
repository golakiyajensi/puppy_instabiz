import 'dotenv/config'
import mysql from 'mysql2/promise'

// Read database settings from server/.env. Use local defaults if a setting is missing.
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME || 'puppy_clone',
}

// This shared connection pool opens database connections only when needed.
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
})

// Controllers use this function to send queries to the database.
export const db = {
  query: (sql, params = []) => pool.query(sql, params),
}

// Check whether the database is available and return its puppy count.
export async function checkConnection() {
  try {
    const [[row]] = await pool.query('SELECT COUNT(*) AS puppies FROM puppies')
    return { ok: true, puppies: row.puppies }
  } catch (err) {
    return { ok: false, error: err }
  }
}

export function explainDbError(err) {
  const where = `${dbConfig.host}:${dbConfig.port}, database "${dbConfig.database}", user "${dbConfig.user}"`
  switch (err.code) {
    case 'ECONNREFUSED':
      return `Cannot reach MySQL at ${where}. Is MySQL installed and running? (XAMPP / Laragon / MySQL Installer: start the MySQL service.)`
    case 'ER_ACCESS_DENIED_ERROR':
      return `MySQL refused the login for user "${dbConfig.user}". Check DB_USER and DB_PASSWORD in server/.env.`
    case 'ER_BAD_DB_ERROR':
      return `The database "${dbConfig.database}" does not exist yet. Run:  npm run db:setup`
    case 'ER_NO_SUCH_TABLE':
      return 'The tables are missing. Run:  npm run db:setup'
    default:
      return `${err.code || 'Error'}: ${err.message}`
  }
}
