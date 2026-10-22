import { Link } from 'react-router-dom'
import Mascot from '../ui/Mascot'
import Reveal from '../ui/Reveal'
import { Sparkle, Stars } from '../ui/Doodles'

export default function FaqTeaser({ faqs = [] }) {
  return (
    <section className="faq-teaser" aria-labelledby="faq-teaser-title">
      <Stars count={14} />
      <div className="container-page faq-teaser-grid">
        <div className="relative">
          <Reveal as="h2" id="faq-teaser-title" className="text-[clamp(2.8rem,5.4vw,4.9rem)] leading-[0.94] text-cream">
            Questions, answered
          </Reveal>
          <div className="faq-teaser-cta">
            <Link to="/faq" className="btn btn-outline-light !px-6 !py-3.5">More questions</Link>
            <Mascot pose="peek" className="faq-teaser-pup" />
          </div>
        </div>
        <ul className="space-y-9">
          {faqs.map((f, i) => (
            <Reveal as="li" key={f.id} delay={i * 110} className="faq-teaser-item">
              <Sparkle size={16} className="mt-2 shrink-0 text-gold" />
              <div>
                <h3 className="text-[clamp(1.35rem,2vw,1.75rem)] leading-tight text-cream">{f.question}</h3>
                <p className="mt-2.5 max-w-[40rem] text-[1.02rem] leading-relaxed text-cream/75">{f.answer}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
