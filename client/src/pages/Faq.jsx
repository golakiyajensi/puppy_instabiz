import { useId, useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import useApi from '../hooks/useApi'
import { api } from '../services/api'
import { useSite } from '../context/SiteContext'
import { Loading, ApiError } from '../components/ui/ApiState'
import Mascot from '../components/ui/Mascot'

const PINS = ['#d9625f', '#c7622f', '#3f7fb8', '#d9a53a', '#d85d7a']

function Note({ faq, index, open, onToggle }) {
  const id = useId()
  const pin = PINS[index % PINS.length]
  const shift = index % 3 === 1 ? 'is-in' : ''
  return (
    <li className={`note-item ${shift}`} style={{ '--tilt': `${[-0.8, 0.6, -0.4, 0.9, -0.6][index % 5]}deg` }}>
      <span className="pin" style={{ '--pin': pin }} aria-hidden="true" />
      <div className={`faq-note ${open ? 'is-open' : ''}`}>
        <h3>
          <button type="button" aria-expanded={open} aria-controls={`${id}-a`} onClick={onToggle}>
            <span>{faq.question}</span>
            <ChevronDown size={22} strokeWidth={2.6} className="chev" aria-hidden="true" />
          </button>
        </h3>
        <div id={`${id}-a`} role="region" className="faq-answer" hidden={!open}>
          <p>{faq.answer}</p>
        </div>
        <span className="fold" aria-hidden="true" />
      </div>
    </li>
  )
}

export default function Faq() {
  usePageMeta('Questions & answers', 'Answers about TeddyPups puppies: health checks, vaccinations, importing from Korea, delivery in Dubai and support after your puppy comes home.')
  const { wa } = useSite()
  const { data, error, loading, reload } = useApi(() => api.faqs(), [])
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  const all = data?.faqs ?? []
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? all.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(q)) : all
  }, [all, query])

  return (
    <div className="faq-page">
      <section className="container-page pb-28 pt-10 md:pt-14">
        <h1 className="text-[clamp(3.6rem,10vw,9rem)] leading-[0.92] text-cream">Questions<br />&amp; answers</h1>
        <p className="mt-8 max-w-[40rem] text-[1.15rem] leading-relaxed text-cream/90">
          Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is available 24/7.
        </p>

        <div className="faq-grid">
          <div className="faq-side">
            <label htmlFor="faq-search" className="hand block text-[1.05rem] text-gold">sniff out a question</label>
            <div className="faq-search">
              <Search size={20} aria-hidden="true" />
              <input id="faq-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="delivery, Korea, vaccinated…" autoComplete="off" />
            </div>
            <p className="mt-4 text-[0.95rem] font-semibold text-cream/90" aria-live="polite">
              {loading ? 'fetching notes…' : `${shown.length} ${shown.length === 1 ? 'note' : 'notes'} on the board`}
            </p>
            <div className="faq-pup" aria-hidden="true">
              <span className="faq-q hand">?</span>
              <Mascot pose="sit" className="h-auto w-[150px]" />
            </div>
            <a href={wa("Hi TeddyPups! I have a question: ")} target="_blank" rel="noreferrer" className="btn btn-leaf mt-3 !px-6 !py-3.5">Ask your own question</a>
          </div>

          <div className="cork">
            <div className="cork-inner">
              {loading && <Loading label="pinning up the notes…" />}
              {error && <ApiError error={error} onRetry={reload} />}
              {data && shown.length === 0 && (
                <p className="py-16 text-center font-display text-[1.5rem] font-extrabold text-[#4a2a14]">No notes match &ldquo;{query}&rdquo; yet.<span className="mt-2 block text-[1rem] font-normal text-[#4a2a14]/85">Try another word, or ask us on WhatsApp.</span></p>
              )}
              <ul className="note-list">
                {shown.map((f, i) => (
                  <Note key={f.id} faq={f} index={i} open={openId === f.id} onToggle={() => setOpenId(openId === f.id ? null : f.id)} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
