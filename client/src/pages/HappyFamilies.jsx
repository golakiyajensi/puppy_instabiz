import { useEffect, useMemo, useState } from 'react'
import usePageMeta from '../hooks/usePageMeta'
import useApi from '../hooks/useApi'
import { api } from '../services/api'
import { Loading, ApiError } from '../components/ui/ApiState'
import Reveal from '../components/ui/Reveal'
import { HeartOutline, PawIcon } from '../components/ui/Doodles'

const TAPES = ['#f1e0a6', '#f6c9cf', '#cfe3f3', '#f1e0a6', '#e8d9b8']
const TILTS = [-2.4, 1.2, -0.8, 2.1, -1.5, 0.9, -2.1, 1.6, -0.5, 2.4]

// number of columns of the photo wall for the current screen width
function useColumnCount() {
  const get = () => (window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : window.innerWidth >= 421 ? 2 : 1)
  const [count, setCount] = useState(get)
  useEffect(() => {
    const onResize = () => setCount(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return count
}

export default function HappyFamilies() {
  usePageMeta('Happy families', 'Beautiful moments from the families who welcomed a TeddyPups puppy into their homes.')
  const photos = useApi(() => api.familyPhotos(), [])
  const quotes = useApi(() => api.testimonials(), [])
  const quote = quotes.data?.testimonials?.[0]
  const list = photos.data?.photos ?? []
  const count = useColumnCount()
  // deal the photos out like cards, so the wall reads left to right and top to bottom
  const columns = useMemo(() => {
    const cols = Array.from({ length: count }, () => [])
    list.forEach((p, i) => cols[i % count].push({ p, i }))
    return cols
  }, [list, count])

  return (
    <div className="happy-page">
      <section className="container-page pb-24 pt-10 md:pt-14">
        <div className="happy-head">
          <div>
            <p className="hand text-[1.15rem] text-rust">our wall of happy endings</p>
            <h1 className="mt-2 text-[clamp(3.8rem,9.5vw,8.6rem)] leading-[0.95]">
              Happy families
              <HeartOutline size="0.4em" className="ml-[0.2em] inline-block align-baseline text-[#c2662e]" />
            </h1>
            <p className="mt-9 max-w-[38rem] text-[1.15rem] leading-relaxed text-ink/85">
              Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends.
            </p>
            <p className="hand mt-6 text-[1.1rem] text-rust" aria-live="polite">{photos.data ? `${photos.data.count} moments and counting` : ' '}</p>
          </div>
          {quote && (
            <figure className="note">
              <span className="note-tape" aria-hidden="true" />
              <blockquote>&ldquo;{quote.quote}&rdquo;</blockquote>
              <figcaption className="hand">{quote.name}, {quote.location}</figcaption>
            </figure>
          )}
        </div>

        {photos.loading && <Loading label="gathering happy moments…" />}
        {photos.error && <ApiError error={photos.error} onRetry={photos.reload} />}

        <div className="happy-wall" style={{ '--cols': count }}>
          {columns.map((col, c) => (
            <ul key={c} className="happy-col">
              {col.map(({ p, i }) => (
                <li key={p.id}>
                  <Reveal as="figure" className="polaroid happy-polaroid" style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}>
                    <span className="tape" style={{ background: TAPES[i % TAPES.length], rotate: `${(i % 2 ? 1 : -1) * (3 + (i % 5))}deg`, marginLeft: i % 3 === 0 ? '-72px' : '-34px' }} aria-hidden="true" />
                    {i % 3 !== 1 && <PawIcon size={22} className="happy-paw" />}
                    <img src={p.url} alt={p.alt || p.caption || 'A happy TeddyPups family with their puppy'} loading={i < 8 ? 'eager' : 'lazy'} />
                    <figcaption className="hand">{p.caption || ' '}</figcaption>
                  </Reveal>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>
    </div>
  )
}
