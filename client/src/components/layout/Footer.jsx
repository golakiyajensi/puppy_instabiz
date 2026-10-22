import { Link } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'
import Mascot from '../ui/Mascot'
import { Stars } from '../ui/Doodles'

const EXPLORE = [
  { to: '/puppies', label: 'Available puppies' },
  { to: '/gone-home', label: 'Gone home' },
  { to: '/happy-families', label: 'Happy families' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/how-it-works#delivery', label: 'Delivery & collection' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Visit & contact' },
]

// `wave` draws the wavy edge that melts a light page into the dark footer
export default function Footer({ wave = true }) {
  const { site, wa } = useSite()
  return (
    <footer className="relative bg-night text-cream">
      {wave && (
        <svg className="footer-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 56 C60 36 140 30 260 50 C470 84 640 52 860 22 C1090 -8 1240 78 1440 28 V90 H0 Z" fill="currentColor" />
        </svg>
      )}
      <div className="relative overflow-hidden pt-20 pb-6">
        <Stars count={9} />
        <div className="moon" aria-hidden="true" />

        <div className="container-page relative grid gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:gap-8">
          <div>
            <h2 className="text-5xl text-[#f9e2b3] md:text-6xl">Home, at last.</h2>
            <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-cream/80">
              TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.
            </p>
            <Mascot pose="basket" className="mt-8 hidden h-44 w-auto md:block" />
          </div>

          <div>
            <h3 className="hand mb-4 text-xl font-medium tracking-normal text-gold" style={{ fontVariationSettings: 'normal' }}>Explore</h3>
            <ul className="space-y-2.5 font-semibold">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="hand mb-4 text-xl font-medium tracking-normal text-gold" style={{ fontVariationSettings: 'normal' }}>Say hello</h3>
            <ul className="space-y-2.5">
              <li>
                <a href={wa()} target="_blank" rel="noreferrer" className="footer-link font-semibold">WhatsApp {site.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="footer-link">{site.email}</a>
              </li>
              <li className="text-cream/80">{site.address}</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                ['Instagram', site.instagramUrl],
                ['TikTok', site.tiktokUrl],
                ['Facebook', site.facebookUrl],
              ].map(([name, href]) => (
                <a key={name} href={href} target="_blank" rel="noreferrer" className="social-pill">{name}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="container-page relative mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-cream/10 pt-6 text-sm text-cream/70">
          <div className="flex items-center gap-3">
            <img src="/images/logo.webp" alt="" width="36" height="36" className="h-9 w-9 rounded-full" />
            <span>© {new Date().getFullYear()} TeddyPups U.A.E.</span>
          </div>
          <span className="hand text-base text-gold/90">{site.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
