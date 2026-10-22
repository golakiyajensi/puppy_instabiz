import { Link, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import useApi from '../hooks/useApi'
import { api } from '../services/api'
import { Loading, ApiError } from '../components/ui/ApiState'
import Mascot from '../components/ui/Mascot'
import PuppyCard from '../components/ui/PuppyCard'
import { Squiggle } from '../components/ui/Doodles'
import GoneStrip from '../components/sections/GoneStrip'

// the three "where" choices; "Everywhere" simply clears the filter
const WHERE = [
  { key: 'imported', label: 'Imported', params: { origin: 'imported' } },
  { key: 'teacup', label: 'Korean Teacup', params: { teacup: '1' } },
]
const FALLBACK_BREEDS = ['Maltipoo', 'Pomeranian', 'Poodle', 'Cavapoo', 'Shih Tzu']

export default function Puppies() {
  usePageMeta('Available puppies', 'Browse the teacup and designer puppies currently available from TeddyPups in Dubai. Real photos of every puppy, with imported and local options.')
  const [params, setParams] = useSearchParams()
  const origin = params.get('origin') || ''
  const teacup = params.get('teacup') || ''
  const breed = params.get('breed') || ''
  const sex = params.get('sex') || ''

  const { data, error, loading, reload } = useApi(
    () => api.puppies({ status: 'available', origin, teacup, breed, sex }),
    [origin, teacup, breed, sex],
  )
  // the breed chips come from the database, so keep the last list while a new filter loads
  const breeds = data?.breeds?.length ? data.breeds : FALLBACK_BREEDS.map((n) => ({ slug: n.toLowerCase().replace(/\s+/g, '-'), name: n }))

  const setFilter = (changes) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    setParams(next, { replace: true })
  }
  const toggle = (key, value) => setFilter({ [key]: params.get(key) === value ? '' : value })
  const everywhere = !origin && !teacup
  const activeWhere = (w) => (w.key === 'teacup' ? teacup === '1' : origin === 'imported')

  const total = data?.count ?? 0
  const filtered = Boolean(origin || teacup || breed || sex)

  return (
    <div className="paper">
      <section className="container-page pb-20 pt-10 md:pt-14">
        <div className="sketch-head">
          <div>
            <p className="hand text-[1.15rem] text-rust">from Teddy&apos;s sketchbook</p>
            <h1 className="relative mt-1 w-fit text-[clamp(3.2rem,9.5vw,8.8rem)] leading-[0.95]">
              Available puppies
              <Squiggle className="absolute -bottom-4 left-0 h-[22px] w-full text-[#c2662e]" color="currentColor" />
            </h1>
            <p className="mt-10 max-w-[34rem] text-[1.12rem] leading-relaxed text-ink/85">
              Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
            </p>
          </div>
          <figure className="selfie" aria-hidden="true">
            <span className="selfie-hm hand">hm?</span>
            <div className="selfie-circle"><Mascot pose="sit" className="h-[78%] w-auto" /></div>
            <figcaption className="hand">self-portrait</figcaption>
          </figure>
        </div>

        <div className="filter-box sketch-box" role="group" aria-label="Filter puppies">
          <span className="filter-tape" aria-hidden="true" />
          <div className="filter-row">
            <span className="filter-label hand">where</span>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="chip" aria-pressed={everywhere} onClick={() => setFilter({ origin: '', teacup: '' })}>Everywhere</button>
              {WHERE.map((w) => (
                <button key={w.key} type="button" className="chip" aria-pressed={activeWhere(w)} onClick={() => (activeWhere(w) ? setFilter(Object.fromEntries(Object.keys(w.params).map((k) => [k, '']))) : setFilter({ origin: '', teacup: '', ...w.params }))}>
                  {w.label}
                </button>
              ))}
              {origin === 'local' && (
                <button type="button" className="chip" aria-pressed="true" onClick={() => setFilter({ origin: '' })}>
                  In Dubai <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label hand">breed</span>
            <div className="flex flex-wrap gap-3">
              {breeds.map((b) => (
                <button key={b.slug} type="button" className="chip" aria-pressed={breed === b.slug} onClick={() => toggle('breed', b.slug)}>
                  {b.name}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label hand">boy or girl</span>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="chip" aria-pressed={sex === 'boy'} onClick={() => toggle('sex', 'boy')}>Boys</button>
              <button type="button" className="chip" aria-pressed={sex === 'girl'} onClick={() => toggle('sex', 'girl')}>Girls</button>
            </div>
          </div>
        </div>

        <p className="hand mt-10 text-[1.1rem]" aria-live="polite">
          {loading ? 'fetching puppies…' : `${total} ${total === 1 ? 'puppy' : 'puppies'} looking for a home`}
        </p>

        {error && <ApiError error={error} onRetry={reload} />}
        {loading && !data && <Loading />}

        {data && total > 0 && (
          <ul className={`pup-grid ${loading ? 'opacity-60' : ''}`}>
            {data.puppies.map((p, i) => (
              <li key={p.id}>
                <PuppyCard puppy={p} index={i} />
              </li>
            ))}
          </ul>
        )}

        {data && total === 0 && !loading && (
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 text-center">
            <Mascot pose="sit" eyes="closed" className="h-32 w-32" />
            <h2 className="text-3xl">No puppies match that yet</h2>
            <p className="text-ink/75">
              {filtered ? 'Try removing a filter, or message us on WhatsApp and we will look for the right match.' : 'New puppies arrive all the time. Message us and we will let you know.'}
            </p>
            {filtered && (
              <button type="button" className="btn btn-primary" onClick={() => setParams({}, { replace: true })}>Show all puppies</button>
            )}
            <Link to="/contact" className="btn btn-outline">Ask us on the contact page</Link>
          </div>
        )}
      </section>

      <GoneStrip />
    </div>
  )
}
