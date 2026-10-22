import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { X, Phone } from 'lucide-react'
import { NAV_LINKS } from '../../lib/site'
import { useSite } from '../../context/SiteContext'
import { PawIcon } from '../ui/Doodles'
import Mascot from '../ui/Mascot'

export default function Navbar() {
  const { site, wa } = useSite()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`relative z-40 ${isHome ? '' : 'site-header'}`}>
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="TeddyPups U.A.E. home">
          <img src="/images/logo.webp" alt="" width="48" height="48" className="h-12 w-12 rounded-full" />
          <span className="font-display text-[1.45rem] font-bold tracking-tight" style={{ fontVariationSettings: "'SOFT' 100" }}>
            TeddyPups
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{l.label}</span>
                  {isActive && <PawIcon size={11} className="nav-paw" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={wa()} target="_blank" rel="noreferrer" className="btn btn-leaf hidden !py-2.5 sm:inline-flex">
            WhatsApp us
          </a>
          <button
            type="button"
            className="btn btn-outline !px-5 !py-2.5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>

      {!isHome && <div className="scallop" aria-hidden="true" />}

      {/* slide-in menu for phones and tablets */}
      <div className={`menu-overlay ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden={!open} />
      <aside id="mobile-menu" className={`menu-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="Menu">
        <div className="flex items-start justify-between">
          <p className="hand text-2xl text-rust">where to, friend?</p>
          <button type="button" className="btn btn-outline !px-4 !py-2" onClick={() => setOpen(false)}>
            <X size={18} aria-hidden="true" /> Close
          </button>
        </div>
        <nav className="mt-6 flex flex-col" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              tabIndex={open ? 0 : -1}
              className={({ isActive }) => `drawer-link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 pt-8">
          <a href={wa()} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="btn btn-leaf">
            WhatsApp us
          </a>
          <a href={`tel:${site.phoneTel}`} tabIndex={open ? 0 : -1} className="btn btn-outline">
            <Phone size={16} aria-hidden="true" /> {site.phoneDisplay}
          </a>
          <Mascot pose="sit" className="mx-auto mt-2 h-24 w-24" />
        </div>
      </aside>
    </header>
  )
}
