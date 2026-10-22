import { HeartPulse, Plane, MessageSquareText, Globe } from 'lucide-react'
import useInView from '../../hooks/useInView'
import Mascot from '../ui/Mascot'

const ICONS = {
  'heart-pulse': HeartPulse,
  plane: Plane,
  chat: MessageSquareText,
  globe: Globe,
}

// "Why families trust TeddyPups": an open puppy passport that gets stamped one page-mark at a time
export default function Passport({ points = [] }) {
  const [ref, seen] = useInView({ threshold: 0.25 })

  return (
    <section className="passport-section" aria-labelledby="passport-title">
      <div ref={ref} className={`container-page ${seen ? 'is-stamped' : ''}`}>
        <div className="book">
          <div className="book-page book-left">
            <p className="hand text-[1.15rem] text-rust">puppy passport</p>
            <h2 id="passport-title" className="mt-3 max-w-[15ch] text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.95]">
              Why families trust TeddyPups
            </h2>
            <Mascot pose="sit" className="book-pup" />
          </div>
          <div className="book-page book-right">
            {points.map((p, i) => {
              const Icon = ICONS[p.icon] || Globe
              return (
                <div key={p.title} className="stamp-cell" style={{ '--i': i }}>
                  <div className={`stamp stamp-${i % 4}`}>
                    <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                    <span>{p.title}</span>
                  </div>
                  <p>{p.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
