import { Link } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'
import Mascot from '../ui/Mascot'
import Reveal from '../ui/Reveal'

export default function FinalCta({ photo = '/images/home/showroom-001.webp' }) {
  const { wa } = useSite()
  return (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="container-page text-center">
        <Reveal as="h2" id="cta-title" className="mx-auto max-w-[14ch] text-[clamp(2.9rem,6vw,5.6rem)] leading-[0.92] text-cream">
          Ready to meet your new best friend?
        </Reveal>
        <p className="mx-auto mt-6 max-w-[38rem] text-[1.08rem] leading-relaxed text-cream/80">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
        </p>

        <div className="house" aria-hidden="true">
          <div className="house-wall">
            <span className="house-lamp" />
            <span className="house-door-leaf" />
            <div className="house-arch">
              <img src={photo} alt="" loading="lazy" />
            </div>
            <span className="house-plant house-plant-l" />
            <span className="house-plant house-plant-r" />
            <span className="house-mat hand">welcome home</span>
          </div>
          <div className="house-step" />
          <Mascot pose="sit" className="house-pup" />
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={wa()} target="_blank" rel="noreferrer" className="btn btn-leaf !px-6 !py-3.5">Enquire on WhatsApp</a>
          <Link to="/contact" className="btn btn-outline-light !px-6 !py-3.5">Visit &amp; contact</Link>
        </div>
      </div>
    </section>
  )
}
