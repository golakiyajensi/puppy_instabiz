import { useState } from 'react'
import { Link } from 'react-router-dom'
import useMediaQuery from '../../hooks/useMediaQuery'
import Mascot from '../ui/Mascot'
import { PawIcon } from '../ui/Doodles'

const DOOR_COLORS = ['#a24a1a', '#5a3a28', '#d4893f', '#7a4a2e', '#b8644a']

const doorLine = (p) => [p.name ? p.breed : null, p.sexLabel, p.age].filter(Boolean).join(', ') + (p.hasVideo ? ', with video' : '')

function Door({ pup, index, active, onActivate }) {
  return (
    <li
      className={`door-item${active ? ' is-active' : ''}`}
      style={{ '--door-color': DOOR_COLORS[index % DOOR_COLORS.length] }}
      onMouseEnter={onActivate}
    >
      <Link
        to={`/puppies/${pup.slug}`}
        className="door-link"
        aria-label={`${pup.title}, ${doorLine(pup)}`}
        onFocus={onActivate}
      >
        <div className="door-info">
          <h3>{pup.title}</h3>
          <p>{doorLine(pup)}</p>
        </div>
        <div className="door is-open">
          <div className="door-room">
            {pup.cover && <img src={pup.cover.url} alt={pup.cover.alt} loading="lazy" draggable="false" />}
          </div>
          <div className="door-leaf" aria-hidden="true">
            <PawIcon className="door-paw" size={44} />
            <span className="door-panel" />
            <span className="door-knob" />
          </div>
          <span className="door-tag">Available</span>
        </div>
      </Link>
    </li>
  )
}

export default function MeetPups({ pups = [] }) {
  const phone = useMediaQuery('(max-width: 767px)')
  const [activeIndex, setActiveIndex] = useState(-1)
  const visiblePups = phone ? pups.slice(0, 7) : pups

  return (
    <section className="meet" aria-labelledby="meet-title">
      <div className="meet-sticky">
        <div className="container-page meet-head">
          <div>
            <h2 id="meet-title" className="text-[clamp(2.6rem,5.2vw,4.7rem)] leading-[0.98]">Meet the pups</h2>
            <p className="mt-2 text-[1.05rem] text-ink/80 md:text-[1.15rem]">Real puppies, real photos, looking for their families right now.</p>
          </div>
          <div className="meet-actions">
            <Link to="/puppies" className="btn btn-primary hidden !px-6 !py-3.5 sm:inline-flex">Meet them all</Link>
            <Mascot pose="peek" className="meet-header-mascot" />
          </div>
        </div>

        <ul className="meet-track">
          {visiblePups.map((p, i) => (
            <Door
              key={p.slug}
              pup={p}
              index={i}
              active={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
            />
          ))}
        </ul>

        <Link to="/puppies" className="btn btn-primary meet-cta">Meet them all</Link>
      </div>
    </section>
  )
}
