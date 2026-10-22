import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import useApi from '../hooks/useApi'
import { api } from '../services/api'
import { useSite } from '../context/SiteContext'
import { Loading, ApiError } from '../components/ui/ApiState'
import Mascot from '../components/ui/Mascot'
import { PawIcon } from '../components/ui/Doodles'
import Gallery from '../components/sections/Gallery'
import EnquiryForm from '../components/sections/EnquiryForm'
import NotFound from './NotFound'

const INCLUDED = ['Vaccinated', 'Dewormed', 'Verified health certificate from licensed vets', 'Thoroughly checked before joining your family']
const WAY_HOME = [
  ['Reserve your puppy', 'Tell us which puppy has captured your heart.'],
  ['Personalized consultation', "We finalize details with you and share updates on your puppy's journey."],
  ['Import and arrival', 'We manage health checks, travel arrangements, and documentation.'],
  ['Welcome home', 'We help your new puppy settle in and ensure a smooth transition into your home.'],
]

// the red bookmark down the left edge grows as you read down the page
function Bookmark() {
  const [h, setH] = useState(85)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      setH(Math.round(85 + p * (doc.scrollHeight - 85 - 300)))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <span className="bookmark" style={{ height: h }} aria-hidden="true" />
}

function Label({ n, children }) {
  return (
    <p className="label-row">
      <span className="label-num">{n}</span>
      <span className="hand text-[1.15rem] text-rust">{children}</span>
    </p>
  )
}

function Neighbour({ p, dir }) {
  if (!p) return <div />
  return (
    <Link to={`/puppies/${p.slug}`} className={`neighbour ${dir === 'next' ? 'is-next' : ''}`}>
      {dir === 'prev' && p.cover && <img src={p.cover.url} alt="" loading="lazy" />}
      <span>
        <span className="hand block text-[0.9rem]">{dir === 'prev' ? 'Previous pup' : 'Next pup'}</span>
        <strong>{p.title}</strong>
      </span>
      {dir === 'next' && p.cover && <img src={p.cover.url} alt="" loading="lazy" />}
    </Link>
  )
}

export default function PuppyDetail() {
  const { slug } = useParams()
  const { wa } = useSite()
  const { data, error, loading, reload } = useApi(() => api.puppy(slug), [slug])
  const puppy = data?.puppy
  usePageMeta(puppy ? `${puppy.title}${puppy.name ? `, ${puppy.breed}` : ''}` : 'Puppy', puppy ? `Meet ${puppy.name || `this ${puppy.breed}`} – ${puppy.sexLabel}, ${puppy.age}. Real photos and details from TeddyPups U.A.E.` : undefined)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (loading) return <Loading />
  if (error?.status === 404) return <NotFound what="puppy" />
  if (error) return <ApiError error={error} onRetry={reload} />

  const gone = puppy.status === 'gone_home'
  const who = puppy.name || `this ${puppy.breed}`
  const backTo = gone ? '/gone-home' : '/puppies'
  const imported = puppy.origin === 'imported'
  const ask = gone
    ? `Hi TeddyPups! I saw that ${puppy.name || `the ${puppy.breed}`} has gone home. Do you have a similar puppy available?`
    : `Hi! I'd love to know more about ${who}${puppy.name ? ` (${puppy.breed})` : ''}.`

  return (
    <div className="detail">
      <Bookmark />
      <div className="container-page pb-24 pt-8">
        <nav aria-label="Breadcrumb" className="text-[0.95rem]">
          <Link to={backTo} className="text-rust underline underline-offset-4">{gone ? 'Gone home' : 'Available puppies'}</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{puppy.title}</span>
        </nav>
        <div className="mt-2"><Label n={1}>hello, it&apos;s me</Label></div>

        <div className="detail-top">
          <Gallery images={puppy.images} label={who} />

          <div className="detail-side">
            <article className="info-card sketch-box">
              <span className="info-tape" aria-hidden="true" />
              <Mascot pose="peek" className="info-peek" />
              <span className="status-pill">
                <PawIcon size={14} className="text-rust" />
                {gone ? 'Gone home ♥' : 'Available'}
              </span>
              <h1 className="mt-3 text-[clamp(3.6rem,6.2vw,5.8rem)] leading-[0.95]">{puppy.title}</h1>
              {puppy.name && <p className="mt-1 text-[1.1rem] text-ink/80">{puppy.breed}</p>}
              <dl className="facts">
                <div><dt className="hand">Breed</dt><dd>{puppy.breed}</dd></div>
                <div><dt className="hand">Boy or girl</dt><dd className="capitalize">{puppy.sexLabel}</dd></div>
                <div><dt className="hand">Age</dt><dd>{puppy.age}</dd></div>
                <div><dt className="hand">Where</dt><dd>{puppy.whereLabel}</dd></div>
              </dl>
              {gone ? (
                <>
                  <p className="mt-6 rounded-2xl bg-sand-200/70 px-4 py-3 text-[0.98rem]">{who === puppy.name ? puppy.name : 'This puppy'} has found a loving family. Looking for something similar? We would love to help.</p>
                  <a href={wa(ask)} target="_blank" rel="noreferrer" className="btn btn-leaf mt-5 w-full !py-4">Ask for a similar puppy</a>
                  <Link to="/puppies" className="btn btn-outline mt-3 w-full !py-3.5">See available puppies</Link>
                </>
              ) : (
                <>
                  <a href={wa(ask)} target="_blank" rel="noreferrer" className="btn btn-leaf mt-7 w-full !py-4">Ask about {who} on WhatsApp</a>
                  <a href="#enquire" className="btn btn-outline mt-3 w-full !py-3.5">Send an enquiry</a>
                </>
              )}
            </article>

            <section className="incl-card" aria-labelledby="incl-title">
              <Label n={2}>what comes with {puppy.name || 'every pup'}</Label>
              <h2 id="incl-title" className="mt-1 text-[1.9rem] leading-tight">Every Teddy Pup comes</h2>
              <ul className="mt-3 space-y-2.5">
                {INCLUDED.map((t) => (
                  <li key={t} className="flex items-start gap-3"><Check size={22} strokeWidth={3} className="mt-0.5 shrink-0 text-rust" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {imported && (
          <section className="way-home" aria-labelledby="way-title">
            <Label n={3}>the way home</Label>
            <h2 id="way-title" className="mt-2 text-[clamp(2.2rem,3.9vw,3.5rem)] leading-none">Coming home from abroad</h2>
            <ol className="way-steps">
              {WAY_HOME.map(([t, d], i) => (
                <li key={t}>
                  <span className="way-num">{i + 1}</span>
                  {i < WAY_HOME.length - 1 && <span className="way-paws" aria-hidden="true" />}
                  <h3 className="mt-5 text-[1.3rem]">{t}</h3>
                  <p className="mt-1.5 text-[1rem] leading-relaxed text-ink/80">{d}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <EnquiryForm
          key={puppy.slug}
          puppy={puppy}
          who={who}
          defaultMessage={ask}
          heading={gone ? `Looking for a puppy like ${puppy.name || 'this one'}?` : undefined}
        />

        <nav className="neighbours" aria-label="More puppies">
          <Neighbour p={puppy.prev} dir="prev" />
          <Neighbour p={puppy.next} dir="next" />
        </nav>
      </div>
    </div>
  )
}
