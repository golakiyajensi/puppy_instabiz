import { db } from '../config/db.js'

const SEX_LABEL = { boy: 'boy', girl: 'girl', boy_girl: 'boy & girl' }
const WHERE_LABEL = { imported: 'Imported for you', local: 'In Dubai' }

// Database fields used to build a puppy card.
export const CARD_COLUMNS = `
  p.id, p.slug, p.name, p.breed_label, b.slug AS breed_slug, p.sex, p.age_label, p.colour,
  p.origin, p.is_teacup, p.has_video, p.status, p.sort_order,
  (SELECT i.url FROM puppy_images i WHERE i.puppy_id = p.id ORDER BY i.sort_order, i.id LIMIT 1) AS cover_url,
  (SELECT i.alt FROM puppy_images i WHERE i.puppy_id = p.id ORDER BY i.sort_order, i.id LIMIT 1) AS cover_alt`

export const CARD_FROM = 'FROM puppies p JOIN breeds b ON b.id = p.breed_id'

// Turn a database row into the format used by the website.
export function toCard(puppy) {
  return {
    id: puppy.id,
    slug: puppy.slug,
    name: puppy.name,
    title: puppy.name || puppy.breed_label,
    breed: puppy.breed_label,
    breedSlug: puppy.breed_slug,
    sex: puppy.sex,
    sexLabel: SEX_LABEL[puppy.sex],
    age: puppy.age_label,
    colour: puppy.colour,
    origin: puppy.origin,
    whereLabel: WHERE_LABEL[puppy.origin],
    isTeacup: !!puppy.is_teacup,
    hasVideo: !!puppy.has_video,
    status: puppy.status,
    cover: puppy.cover_url
      ? { url: puppy.cover_url, alt: puppy.cover_alt || puppy.breed_label }
      : null,
  }
}

// Get puppies and optional filters from the request URL.
export async function listPuppies(req, res) {
  const { status = 'available', origin, breed, sex, teacup, limit } = req.query
  const where = ['p.status = ?']
  const params = [status]
  if (origin) {
    where.push('p.origin = ?')
    params.push(origin)
  }
  if (breed) {
    where.push('b.slug = ?')
    params.push(breed)
  }
  if (sex) {
    // Include boy-and-girl pairs when filtering for either sex.
    where.push("p.sex IN (?, 'boy_girl')")
    params.push(sex)
  }
  if (teacup === '1') where.push('p.is_teacup = 1')

  let sql = `SELECT ${CARD_COLUMNS} ${CARD_FROM} WHERE ${where.join(' AND ')} ORDER BY p.sort_order, p.id`
  if (limit) {
    sql += ' LIMIT ?'
    params.push(Number(limit))
  }
  const [rows] = await db.query(sql, params)

  // Count the puppies for each breed filter.
  const [breeds] = await db.query(
    `SELECT b.slug, b.name, COUNT(p.id) AS total
       FROM breeds b
       LEFT JOIN puppies p ON p.breed_id = b.id AND p.status = ?
      WHERE b.show_in_filter = 1
      GROUP BY b.id, b.slug, b.name, b.sort_order
      ORDER BY b.sort_order`,
    [status],
  )

  res.json({
    success: true,
    count: rows.length,
    puppies: rows.map(toCard),
    breeds: breeds.map((b) => ({ slug: b.slug, name: b.name, total: Number(b.total) })),
  })
}

// Get one puppy, its photos, and links to the previous and next puppies.
export async function getPuppy(req, res) {
  const [found] = await db.query(`SELECT ${CARD_COLUMNS} ${CARD_FROM} WHERE p.slug = ? LIMIT 1`, [req.params.slug])
  if (!found.length) return res.status(404).json({ success: false, message: 'We could not find that puppy.' })
  const puppy = toCard(found[0])

  const [images] = await db.query(
    'SELECT url, alt, is_video_poster FROM puppy_images WHERE puppy_id = ? ORDER BY sort_order, id',
    [puppy.id],
  )

  // Previous and next puppies have the same status. The list loops at both ends.
  const [siblings] = await db.query(`SELECT ${CARD_COLUMNS} ${CARD_FROM} WHERE p.status = ? ORDER BY p.sort_order, p.id`, [puppy.status])
  const puppyIndex = siblings.findIndex((item) => item.slug === puppy.slug)
  const previousPuppy = siblings.length > 1
    ? toCard(siblings[(puppyIndex - 1 + siblings.length) % siblings.length])
    : null
  const nextPuppy = siblings.length > 1
    ? toCard(siblings[(puppyIndex + 1) % siblings.length])
    : null

  res.json({
    success: true,
    puppy: {
      ...puppy,
      images: images.map((i) => ({ url: i.url, alt: i.alt, isVideo: !!i.is_video_poster })),
      prev: previousPuppy,
      next: nextPuppy,
    },
  })
}
