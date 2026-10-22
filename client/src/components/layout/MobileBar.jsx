import { Phone } from 'lucide-react'
import { useSite } from '../../context/SiteContext'

// Sticky "WhatsApp us / Call" bar at the bottom of the screen on phones
export default function MobileBar() {
  const { site, wa } = useSite()
  return (
    <div className="mobile-bar md:hidden">
      <a href={wa()} target="_blank" rel="noreferrer" className="btn btn-leaf flex-1 !py-3">
        WhatsApp us
      </a>
      <a href={`tel:${site.phoneTel}`} className="btn btn-outline flex-1 !py-3 bg-cream">
        <Phone size={16} aria-hidden="true" /> Call
      </a>
    </div>
  )
}
