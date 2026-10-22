// Contact details and links used across the site.
// They are the public details printed on the reference site; the /api/settings endpoint (database table
// `site_settings`) can override any of them, see context/SiteContext.jsx.
export const DEFAULT_SITE = {
  brandName: 'TeddyPups U.A.E.',
  tagline: 'every puppy is family',
  whatsappNumber: '971541676733',
  whatsappGreeting: "Hi TeddyPups! I'd love to know more about your puppies.",
  phoneDisplay: '+971 54 167 6733',
  phoneTel: '+971541676733',
  email: 'teddypupsadmin@gmail.com',
  address: 'Downtown Dubai, United Arab Emirates',
  mapsUrl: 'https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7',
  instagramUrl: 'https://www.instagram.com/teddypups.worldwide/',
  tiktokUrl: 'https://www.tiktok.com/@teddypupsuae',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61567496944539',
}

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/puppies', label: 'Puppies' },
  { to: '/happy-families', label: 'Happy families' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Visit & contact' },
]

export const waLink = (site, text) => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text ?? site.whatsappGreeting)}`

// "Max, the Maltipoo" / "this Pomeranian" – used in WhatsApp texts and headings
export const puppyLabel = (p) => (p.name ? `${p.name}, the ${p.breed}` : `this ${p.breed}`)
export const puppyCardLine = (p) => [p.name ? p.breed : null, p.sexLabel, p.age].filter(Boolean).join(' · ')
