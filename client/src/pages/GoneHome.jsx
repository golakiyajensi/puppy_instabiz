import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import useApi from '../hooks/useApi'
import { api } from '../services/api'
import { Loading, ApiError } from '../components/ui/ApiState'
import Mascot from '../components/ui/Mascot'
import { HeartOutline } from '../components/ui/Doodles'

// "Mia / Maltipoo, girl" for named puppies, "Pomeranian / Boy" for the ones without a name
const subLine = (p) => (p.name ? `${p.breed}, ${p.sexLabel}` : p.sexLabel.charAt(0).toUpperCase() + p.sexLabel.slice(1))

function Ticket({ p, index }) {
  return (
    <li>
      <Link to={`/puppies/${p.slug}`} className="ticket" style={{ '--r': `${[-0.7, 0.5, -0.3, 0.8, -0.6, 0.4][index % 6]}deg` }}>
        <span className="ticket-main">
          <span className="ticket-photo">{p.cover && <img src={p.cover.url} alt={p.cover.alt} loading="lazy" />}</span>
          <span className="ticket-text">
            <span className="hand ticket-kicker">one ticket home</span>
            <strong className="ticket-name">{p.title}</strong>
            <span className="ticket-sub">{subLine(p)}</span>
            <span className="ticket-route" aria-label={`${p.origin === 'local' ? 'Dubai showroom' : 'TeddyPups'} to a new home`}>
              <span>{p.origin === 'local' ? 'Dubai showroom' : 'TeddyPups'}</span>
              <svg viewBox="0 0 48 10" width="40" height="9" aria-hidden="true"><path d="M2 5h38" stroke="#b8541f" strokeWidth="1.6" strokeDasharray="3 2.4" /><path d="M38 1.5 45 5l-7 3.500" fill="none" stroke="#b8541f" strokeWidth="1.6" /></svg>
              <span>Home ♥</span>
            </span>
          </span>
        </span>
        <span className="ticket-stub"><span>admit one</span></span>
      </Link>
    </li>
  )
}

export default function GoneHome() {
  usePageMeta('Gone home', 'The TeddyPups puppies who have already found their loving families. Looking for one just like them? Tell us and we will help you find your match.')
  const { data, error, loading, reload } = useApi(() => api.puppies({ status: 'gone_home' }), [])

  return (
    <div className="gone-page">
      <section className="container-page pb-24 pt-10 md:pt-14">
        <div className="gone-head">
          <div>
            <h1 className="flex flex-wrap items-start gap-3 text-[clamp(3.6rem,10vw,9rem)] leading-[0.92]">
              Gone home
              <HeartOutline size={56} className="mt-3 text-[#c2662e] max-md:h-9 max-md:w-9" />
            </h1>
            <p className="mt-8 max-w-[44rem] text-[1.15rem] leading-relaxed text-ink/85">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we&apos;ll help you find your match.
            </p>
            <Link to="/puppies" className="btn btn-primary mt-7 !px-6 !py-3.5">See available puppies</Link>
          </div>
          <div className="booth" aria-hidden="true">
            <Mascot pose="peek" className="booth-pup" />
            <div className="booth-awning" />
            <div className="booth-body hand">tickets home</div>
          </div>
        </div>

        {loading && <Loading />}
        {error && <ApiError error={error} onRetry={reload} />}
        {data && (
          <ul className="tickets" aria-label={`${data.count} puppies who have gone home`}>
            {data.puppies.map((p, i) => <Ticket key={p.id} p={p} index={i} />)}
          </ul>
        )}
      </section>
    </div>
  )
}
