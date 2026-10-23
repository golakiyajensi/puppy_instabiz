// Keep requests same-origin; Vite and Vercel proxy /api to the Express server.
const BASE = '/api'

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    const err = new Error('We could not reach the server.')
    err.network = true
    throw err
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || 'Something went wrong.')
    err.status = res.status
    err.errors = data?.errors || {}
    throw err
  }
  return data
}

const qs = (params = {}) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
  return s.toString() ? `?${s}` : ''
}

export const api = {
  settings: () => request('/settings'),
  home: () => request('/home'),
  puppies: (params) => request(`/puppies${qs(params)}`),
  puppy: (slug) => request(`/puppies/${encodeURIComponent(slug)}`),
  faqs: () => request('/faqs'),
  testimonials: () => request('/testimonials'),
  familyPhotos: () => request('/family-photos'),
  sendEnquiry: (body) => request('/enquiries', { method: 'POST', body: JSON.stringify(body) }),
  sendContact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
}
