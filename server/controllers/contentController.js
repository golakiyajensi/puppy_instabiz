import { db } from '../config/db.js'
import { CARD_COLUMNS, CARD_FROM, toCard } from './puppiesController.js'

function toCamelCase(settingKey) {
  return settingKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function toFaq(faq) {
  return { id: faq.id, question: faq.question, answer: faq.answer }
}

function toPhoto(photo) {
  return { id: photo.id, url: photo.image_url, caption: photo.caption, alt: photo.alt }
}

function toTestimonial(testimonial) {
  return {
    id: testimonial.id,
    name: testimonial.author_name,
    location: testimonial.author_location,
    breed: testimonial.puppy_breed,
    quote: testimonial.quote,
  }
}

// Check that the API can read from the database.
export async function health(req, res) {
  const [[row]] = await db.query('SELECT COUNT(*) AS puppies FROM puppies')
  res.json({ success: true, status: 'ok', database: 'connected', puppies: Number(row.puppies) })
}

// Get the website settings, using camelCase names for the keys.
export async function getSettings(req, res) {
  const [rows] = await db.query('SELECT setting_key, setting_value FROM site_settings')
  const settings = {}
  for (const setting of rows) {
    settings[toCamelCase(setting.setting_key)] = setting.setting_value
  }

  res.json({ success: true, settings })
}

// Get the active frequently asked questions.
export async function getFaqs(req, res) {
  const [rows] = await db.query('SELECT id, question, answer FROM faqs WHERE is_active = 1 ORDER BY sort_order, id')
  res.json({ success: true, faqs: rows.map(toFaq) })
}

// Get customer testimonials.
export async function getTestimonials(req, res) {
  const [rows] = await db.query('SELECT id, author_name, author_location, puppy_breed, quote FROM testimonials ORDER BY is_featured DESC, sort_order, id')
  res.json({ success: true, testimonials: rows.map(toTestimonial) })
}

// Get family photos.
export async function getFamilyPhotos(req, res) {
  const [rows] = await db.query('SELECT id, image_url, caption, alt FROM family_photos ORDER BY sort_order, id')
  res.json({ success: true, count: rows.length, photos: rows.map(toPhoto) })
}

// Get all the information needed for the home page in one request.
export async function getHome(req, res) {
  const [pups, gone, steps, trust, testimonial, photos, faqs, counts] = await Promise.all([
    db.query(`SELECT ${CARD_COLUMNS} ${CARD_FROM} WHERE p.status = 'available' ORDER BY p.sort_order, p.id`),
    db.query(`SELECT ${CARD_COLUMNS} ${CARD_FROM} WHERE p.status = 'gone_home' ORDER BY p.sort_order, p.id LIMIT 5`),
    db.query('SELECT step_no, title, description FROM journey_steps ORDER BY step_no'),
    db.query('SELECT title, description, icon_key FROM trust_points ORDER BY sort_order, id'),
    db.query('SELECT id, author_name, author_location, puppy_breed, quote FROM testimonials ORDER BY is_featured DESC, sort_order, id LIMIT 1'),
    db.query('SELECT id, image_url, caption, alt FROM family_photos ORDER BY sort_order, id LIMIT 8'),
    db.query('SELECT id, question, answer FROM faqs WHERE is_active = 1 AND show_on_home = 1 ORDER BY sort_order, id'),
    db.query(
      `SELECT (SELECT COUNT(*) FROM puppies WHERE status = 'available') AS available,
              (SELECT COUNT(*) FROM puppies WHERE status = 'gone_home') AS gone_home,
              (SELECT COUNT(*) FROM family_photos) AS family_photos`,
    ),
  ])
  const c = counts[0][0]
  res.json({
    success: true,
    pups: pups[0].map(toCard),
    goneHome: gone[0].map(toCard),
    journey: steps[0].map((s) => ({ step: s.step_no, title: s.title, text: s.description })),
    trust: trust[0].map((t) => ({ title: t.title, text: t.description, icon: t.icon_key })),
    testimonial: testimonial[0][0] ? toTestimonial(testimonial[0][0]) : null,
    familyPhotos: photos[0].map(toPhoto),
    faqs: faqs[0].map(toFaq),
    counts: { available: Number(c.available), goneHome: Number(c.gone_home), familyPhotos: Number(c.family_photos) },
  })
}
