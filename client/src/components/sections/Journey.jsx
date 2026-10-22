import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Home } from 'lucide-react'
import useReducedMotion from '../../hooks/useReducedMotion'
import Mascot from '../ui/Mascot'
import { PawIcon } from '../ui/Doodles'

const BREEDS = [
  ['Maltipoo', 'maltipoo'],
  ['Pomeranian', 'pomeranian'],
  ['Poodle', 'poodle'],
  ['Cavapoo', 'cavapoo'],
  ['Shih Tzu', 'shih-tzu'],
]
const PHOTOS = [0, 1, 2, 3].map((i) => `/images/home/showroom-00${i}.webp`)

// The little phone: chat messages appear one after another as the visitor reaches each step
function Phone({ step, steps }) {
  return (
    <div className="phone" role="img" aria-label="A WhatsApp chat with TeddyPups">
      <div className="phone-screen">
        <div className="phone-head">
          <img src="/images/logo.webp" alt="" width="34" height="34" />
          <div>
            <strong>TeddyPups U.A.E.</strong>
            <span>online</span>
          </div>
        </div>
        <div className="phone-chat">
          <div className="bubble bubble-out">Hi TeddyPups! I'd love to know more about your puppies.</div>
          {step >= 1 && (
            <div className="bubble bubble-in msg-in">
              {steps[0]?.text}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {BREEDS.map(([label, slug]) => (
                  <Link key={slug} to={`/puppies?breed=${slug}`} className="bubble-chip">{label}</Link>
                ))}
              </div>
            </div>
          )}
          {step >= 2 && (
            <>
              <div className="bubble bubble-in bubble-photos msg-in">
                <div className="grid grid-cols-2 gap-1">
                  {PHOTOS.map((src) => (
                    <img key={src} src={src} alt="" loading="lazy" />
                  ))}
                </div>
              </div>
              <div className="bubble bubble-in msg-in">{steps[1]?.text}</div>
            </>
          )}
          {step >= 3 && (
            <>
              <div className="bubble bubble-in bubble-photos msg-in">
                <div className="video-thumb">
                  <img src={PHOTOS[1]} alt="" loading="lazy" />
                  <span><Play size={16} fill="currentColor" aria-hidden="true" /></span>
                </div>
              </div>
              <div className="bubble bubble-in msg-in">
                {steps[2]?.text}
                <svg viewBox="0 0 220 56" className="route" aria-hidden="true">
                  <path d="M12 44 C 50 14, 96 12, 150 34 S 190 30, 198 24" fill="none" stroke="#a24a1a" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" />
                  <circle cx="12" cy="44" r="5" fill="#a24a1a" />
                </svg>
                <span className="route-home"><Home size={18} aria-hidden="true" /></span>
              </div>
            </>
          )}
        </div>
        <div className="phone-input">
          <span>Say hello on WhatsApp</span>
          <i aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M3 20.5V3.5L22 12 3 20.5zm2-3.100L16.800 12 5 6.600v3.800L12 12l-7 1.600v3.800z" /></svg>
          </i>
        </div>
      </div>
    </div>
  )
}

// "Your puppy journey": on big screens the phone stays on screen while the three steps scroll past
export default function Journey({ steps = [] }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const [active, setActive] = useState(1)
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)

  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const pinned = wide && !reduced
  useEffect(() => {
    if (!pinned) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const range = el.offsetHeight - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / range)) : 0
      setActive(Math.min(steps.length, Math.max(1, Math.floor(p * steps.length) + 1)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [pinned, steps.length])

  const shown = pinned ? active : steps.length // on small screens show the whole conversation

  return (
    <section ref={ref} className={`journey ${pinned ? 'is-pinned' : ''}`} style={pinned ? { height: `${steps.length * 62 + 38}vh` } : undefined} aria-labelledby="journey-title">
      <div className="journey-sticky">
        <div className="container-page journey-grid">
          <div className="journey-copy">
            <h2 id="journey-title" className="text-[clamp(2.7rem,5vw,4.5rem)] leading-[0.98]">Your puppy journey</h2>
            <p className="mt-4 max-w-[30rem] text-[1.1rem] leading-relaxed text-ink/90">
              A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
            </p>
            <ol className="mt-8 space-y-6">
              {steps.map((s) => (
                <li key={s.step} className={`journey-step ${shown >= s.step ? 'is-on' : ''} ${shown === s.step ? 'is-current' : ''}`}>
                  <span className="journey-num">{s.step}</span>
                  <div>
                    <h3 className="text-[1.6rem]">{s.title}</h3>
                    <p className="mt-1 max-w-[27rem] text-[1.02rem] leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/how-it-works" className="btn btn-outline mt-9 !px-6 !py-3.5">How it works</Link>
          </div>

          <div className="journey-phone">
            <Phone step={shown} steps={steps} />
            <div className="journey-pup">
              {shown === 2 && <span className="speech">ooh, photos!</span>}
              <Mascot pose="sit" className="h-full w-full" />
            </div>
            <PawIcon className="journey-paw" size={26} />
          </div>
        </div>
      </div>
    </section>
  )
}
