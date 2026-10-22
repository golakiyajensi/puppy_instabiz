import { Link } from 'react-router-dom'
import Mascot from '../ui/Mascot'
import Reveal from '../ui/Reveal'

// tape colours and tilts differ per photo so the wall looks hand-pinned
const TAPES = ['#f0d89a', '#f3c4c9', '#f0d89a', '#f0d89a', '#e9d6a4', null, '#f0d89a', '#f0d89a']
const TILTS = [-2.2, 1.6, -0.9, 2.4, -2, 1.2, -1.4, 0.8]

function SunSkyline() {
  return (
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="skyline-night" aria-hidden="true">
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd987" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffd987" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="1040" cy="108" r="108" fill="url(#sun-glow)" />
      <circle cx="1040" cy="118" r="62" fill="#ffd27d" />
      <path
        fill="#a5592f"
        d="M0 200V150h40v-25h30v25h30v-35h30v35h40v-45h30v45h30v-40h40v40h20v-55h30v55h50v-70h30v70h40v-30h40v30h40v-25h50v25h20v-75h30v75h30V80h30v95h40v-30h30v30h30v-45h40v45h60v-70h40V60h12V45h8v15h12v40h40v-30h40v30h40v-25h50v25h40v-30h40v30h30v-40h40v40h40v-25h50v25h20v-70h40v70h30v-30h40v30h60v-45h40v45h40v-20h40v20h60v-35h40v35h50V200z"
      />
    </svg>
  )
}

export default function HappyFamilies({ testimonial, photos = [] }) {
  return (
    <section className="families" aria-labelledby="families-title">
      <div className="skyline-sky"><SunSkyline /></div>
      <div className="container-page">
        <div className="families-head">
          <Reveal>
            <h2 id="families-title" className="text-[clamp(2.8rem,5.4vw,4.9rem)] leading-[0.94] text-cream">Happy families &amp; puppies</h2>
            <p className="mt-5 max-w-[34rem] text-[1.1rem] leading-relaxed text-cream/85">
              We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
            </p>
          </Reveal>
          {testimonial && (
            <Reveal delay={150}>
              <figure className="quote">
                <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <figcaption className="hand">{testimonial.name}, {testimonial.location}</figcaption>
              </figure>
            </Reveal>
          )}
        </div>

        <div className="wall">
          <div className="wall-shelf" aria-hidden="true" />
          <Mascot pose="sit" className="wall-pup" />
          <ul className="polaroids">
            {photos.slice(0, 8).map((p, i) => (
              <li key={p.id} style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` }}>
                <Reveal as="figure" delay={(i % 4) * 90} className="polaroid">
                  {TAPES[i] && <span className="tape" style={{ background: TAPES[i], rotate: `${(i % 2 ? 1 : -1) * (6 + i)}deg` }} aria-hidden="true" />}
                  <img src={p.url} alt={p.alt || p.caption || 'A happy TeddyPups family'} loading="lazy" />
                  <figcaption className="hand">{p.caption}</figcaption>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="wall-base">
            <span className="lamp" aria-hidden="true" />
            <span className="wall-door" aria-hidden="true" />
            <Mascot pose="sit" className="wall-pup-2" />
            <Link to="/happy-families" className="btn btn-primary wall-cta">See every happy family</Link>
          </div>
        </div>
      </div>
      <div className="families-floor" aria-hidden="true" />
    </section>
  )
}
