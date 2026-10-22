import rateLimit from 'express-rate-limit'

// Limit each visitor to 10 form submissions every 15 minutes.
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages from this device. Please wait a few minutes or message us on WhatsApp.' },
})
