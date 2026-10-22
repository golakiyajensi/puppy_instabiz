import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// New page -> start at the top (or jump to the #section named in the link)
export default function ScrollToTop() {
  const { pathname, hash, search } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        // wait a tick so the page has rendered
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, search])
  return null
}
