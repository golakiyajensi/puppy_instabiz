// Same rules the API applies (server/routes/index.js), so people get instant feedback before anything is sent.
const digits = (v) => String(v).replace(/\D/g, '')

export function validatePerson({ name = '', phone = '', email = '', message = '' }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Please tell us your name (at least 2 letters).'
  const p = phone.trim()
  if (!/^\+?[\d\s().-]{7,25}$/.test(p) || digits(p).length < 7 || digits(p).length > 15) {
    errors.phone = 'Please enter a valid phone number, for example +971 50 123 4567.'
  }
  if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errors.email = 'That email address does not look right.'
  if (message.length > 2000) errors.message = 'Your message is too long (2000 characters at most).'
  return errors
}
