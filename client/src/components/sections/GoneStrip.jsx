import { Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { api } from '../../services/api'
import { PawIcon, HeartOutline, Sparkle } from '../ui/Doodles'

// "Already gone home": a small strip at the bottom of the puppies page
export default function GoneStrip() {
  const { data } = useApi(() => api.puppies({ status: 'gone_home', limit: 5 }), [])
  const pups = data?.puppies ?? []

  return (
    <section className="gone-strip" aria-labelledby="gone-strip-title">
      <div className="container-page gone-strip-grid">
        <div>
          <h2 id="gone-strip-title" className="text-[clamp(2.4rem,4.4vw,3.8rem)] leading-[0.95]">Already gone home</h2>
          <p className="mt-3 text-ink/85">These puppies have found their families.</p>
          <Link to="/gone-home" className="btn btn-primary mt-7 !px-6 !py-3.5">See the puppies who&apos;ve gone home</Link>
        </div>
        <ul className="gone-mini">
          {pups.map((p, i) => (
            <li key={p.id} style={{ '--i': i }}>
              <Link to={`/puppies/${p.slug}`}>
                <span className="gone-mini-photo">
                  {p.cover && <img src={p.cover.url} alt={p.cover.alt} loading="lazy" />}
                </span>
                <span className="gone-mini-tag hand">gone home ♥</span>
                <span className="gone-mini-name">{p.title}</span>
              </Link>
            </li>
          ))}
          <PawIcon size={16} className="gone-doodle text-rust" style={{ left: '-1%', top: '2%' }} />
          <HeartOutline size={24} className="gone-doodle text-[#cf7347]" style={{ left: '40%', top: '-4%' }} />
          <Sparkle size={16} className="gone-doodle text-[#cf7347]" style={{ left: '98%', top: '4%' }} />
        </ul>
      </div>
    </section>
  )
}
