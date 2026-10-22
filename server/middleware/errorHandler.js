import { explainDbError } from '../config/db.js'

// Reply when the requested API address does not exist.
export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Not found: ${req.method} ${req.originalUrl}` })
}

// Send a clear JSON response when a request causes an error.
export function errorHandler(err, req, res, _next) {
  const databaseUnavailable = [
    'ECONNREFUSED',
    'ER_ACCESS_DENIED_ERROR',
    'ER_BAD_DB_ERROR',
    'ER_NO_SUCH_TABLE',
    'PROTOCOL_CONNECTION_LOST',
    'ETIMEDOUT',
  ].includes(err.code)

  if (databaseUnavailable) {
    console.error('[db]', explainDbError(err))
    return res.status(503).json({
      success: false,
      message: 'The database is not available right now. Please try again in a moment.',
      hint: process.env.NODE_ENV === 'production' ? undefined : explainDbError(err),
    })
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'The request body is not valid JSON.' })
  }
  console.error('[error]', err)
  res.status(err.status || 500).json({ success: false, message: 'Something went wrong on our side. Please try again.' })
}
