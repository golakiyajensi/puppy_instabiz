import { db } from '../config/db.js'

const THANKS = 'Thank you! Your message has reached the TeddyPups team. We will get back to you very soon.'

// Clean up form values before saving them.
function clean(value, maxLength) {
  if (value === undefined || value === null) return null

  const cleanedValue = String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()

  return cleanedValue ? cleanedValue.slice(0, maxLength) : null
}

// Find the puppy's database ID from its slug.
// Return null if no puppy was selected, or undefined if the slug is not valid.
async function puppyIdFromSlug(slug) {
  if (!slug) return null

  const [puppies] = await db.query(
    'SELECT id FROM puppies WHERE slug = ? LIMIT 1',
    [slug],
  )

  return puppies.length ? puppies[0].id : undefined
}

function unknownPuppy(res) {
  return res.status(422).json({
    success: false,
    message: 'That puppy could not be found.',
    errors: { puppySlug: 'Unknown puppy' },
  })
}

// Save a message sent from a puppy's enquiry form.
export async function createEnquiry(req, res) {
  const form = req.body

  // Bots may fill this hidden field. Treat the message as successful but do not save it.
  if (form.website) {
    return res.status(201).json({ success: true, message: THANKS })
  }

  const puppyId = await puppyIdFromSlug(form.puppySlug)
  if (puppyId === undefined) return unknownPuppy(res)

  const [result] = await db.query(
    `INSERT INTO enquiries (puppy_id, name, phone, email, area, message, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      puppyId,
      clean(form.name, 100),
      clean(form.phone, 30),
      clean(form.email, 150),
      clean(form.area, 100),
      clean(form.message, 2000),
      clean(req.ip, 45),
      clean(req.get('user-agent'), 255),
    ],
  )

  res.status(201).json({ success: true, id: Number(result.insertId), message: THANKS })
}

// Save a message sent from the contact page.
export async function createContactMessage(req, res) {
  const form = req.body

  if (form.website) {
    return res.status(201).json({ success: true, message: THANKS })
  }

  const puppyId = await puppyIdFromSlug(form.puppySlug)
  if (puppyId === undefined) return unknownPuppy(res)

  const [result] = await db.query(
    `INSERT INTO contact_messages (puppy_interest_id, name, phone, email, location, message, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      puppyId,
      clean(form.name, 100),
      clean(form.phone, 30),
      clean(form.email, 150),
      clean(form.location, 100),
      clean(form.message, 2000),
      clean(req.ip, 45),
      clean(req.get('user-agent'), 255),
    ],
  )

  res.status(201).json({ success: true, id: Number(result.insertId), message: THANKS })
}
