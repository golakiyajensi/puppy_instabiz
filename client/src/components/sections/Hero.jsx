import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'
import useReducedMotion from '../../hooks/useReducedMotion'
import Mascot from '../ui/Mascot'
import { Squiggle } from '../ui/Doodles'

// height of each arch as a share of the stage (gives the skyline its rhythm)
const ARCHES = [
  { h: 42, show: 'hidden sm:flex' },
  { h: 68, show: 'flex' },
  { h: 52, show: 'flex' },
  { h: 56, show: 'flex' },
  { h: 74, show: 'flex' },
  { h: 42, show: 'hidden sm:flex' },
]
const SLOTS = ARCHES.length

export default function Hero({ pups = [] }) {
  const { wa } = useSite()
  const reduced = useReducedMotion()
  const pool = pups.filter((p) => p.cover)
  const [shown, setShown] = useState(() => Array.from({ length: SLOTS }, (_, i) => i % Math.max(pool.length, 1)))
  const [labelSlot, setLabelSlot] = useState(4)
  const nextPup = useRef(SLOTS)

  // every couple of seconds one arch swaps to the next puppy and shows its breed in a little bubble
  useEffect(() => {
    if (reduced || pool.length < 2) return undefined
    let slot = 0
    const timer = setInterval(() => {
      setShown((prev) => {
        const copy = [...prev]
        copy[slot] = nextPup.current % pool.length
        nextPup.current += 1
        return copy
      })
      setLabelSlot(slot)
      slot = (slot + 1) % SLOTS
    }, 2600)
    return () => clearInterval(timer)
  }, [reduced, pool.length])

  const slotView = (i) => {
    const pup = pool[shown[i]]
    if (!pup) return null
    return (
      <div key={i} className={`hero-slot ${ARCHES[i].show}`} style={{ height: `${ARCHES[i].h}%` }}>
        {labelSlot === i && (
          <span key={pup.slug} className="hero-label">{pup.breed}</span>
        )}
        <div className="hero-arch h-full">
          <img key={pup.slug} src={pup.cover.url} alt={pup.cover.alt} loading={i === 4 ? 'eager' : 'lazy'} />
        </div>
      </div>
    )
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container-page pt-6 text-center md:pt-10">
        <p className="hand relative mx-auto inline-block text-[1.15rem] text-rust md:text-[1.3rem]">
          every puppy is family
          <Squiggle className="absolute left-0 top-full -mt-0.5 w-full text-rust/80" color="currentColor" />
        </p>
        <h3 id="hero-title" className="hero-title mx-auto mt-5 max-w-[16ch]">
          Premium teacup puppies in Dubai
        </h3>
        <p className="mx-auto mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-ink/85 md:text-[1.1rem]">
          Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/puppies" className="btn btn-primary !px-6 !py-2">View available puppies</Link>
          <a href={wa()} target="_blank" rel="noreferrer" className="btn btn-outline !px-6 !py-3.5">Enquire on WhatsApp</a>
        </div>
      </div>

      <div className="hero-stage">
        <div className="hero-row">
          {[0, 1, 2].map(slotView)}
          <div className="hero-mascot">
            <Mascot pose="peek" className="h-auto w-full animate-float" />
          </div>
          {[3, 4, 5].map(slotView)}
        </div>
      </div>
      <div className="fence" aria-hidden="true" />
      <div className="lattice h-24 md:h-28" aria-hidden="true" />
    </section>
  )
}
