import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_SITE, waLink } from '../lib/site'
import { api } from '../services/api'

const SiteContext = createContext(null)

// Gives every page the contact details. They start from the built-in defaults and are replaced by the
// values stored in MySQL (table site_settings) as soon as /api/settings answers.
export function SiteProvider({ children }) {
  const [site, setSite] = useState(DEFAULT_SITE)

  useEffect(() => {
    let cancelled = false
    api
      .settings()
      .then((r) => !cancelled && setSite({ ...DEFAULT_SITE, ...r.settings }))
      .catch(() => {}) // the defaults are fine if the API is not up yet
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => ({ site, wa: (text) => waLink(site, text) }), [site])
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)
