import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { PawIcon, Sparkle, HeartOutline } from './Doodles'
import { puppyCardLine } from '../../lib/site'

// every card gets its own colour blob, tilt and little doodle so the grid feels hand-drawn
const RINGS = ['#f6dfb2', '#d7e5f6', '#f7d9d0', '#efdcc4', '#f1e0c0', '#dbe8f5']
const TILTS = [-14, 24, -32, 12, -6, 34]

function Swirl({ color }) {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path d="M16 16c0-3 4-3 4 0s-6 5-8 0 3-10 10-9 9 9 4 14" />
    </svg>
  )
}
function Dots({ color }) {
  return (
    <svg viewBox="0 0 30 24" width="30" height="24" fill={color} aria-hidden="true">
      <circle cx="5" cy="14" r="3" /><circle cx="14" cy="6" r="2.2" /><circle cx="22" cy="14" r="3" /><circle cx="25" cy="4" r="1.6" />
    </svg>
  )
}
function Dashes({ color }) {
  return (
    <svg viewBox="0 0 26 26" width="22" height="22" stroke={color} strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6l12 3M2 14l12 3M8 21l9 2" />
    </svg>
  )
}

const DOODLES = [
  { kind: 'paw', color: '#d28a4a', left: '-4%', top: '18%' },
  { kind: 'dashes', color: '#a24a1a', left: '96%', top: '62%' },
  { kind: 'dots', color: '#2a170e', left: '38%', top: '-5%' },
  { kind: 'sparkle', color: '#cf7347', left: '92%', top: '18%' },
  { kind: 'sparkle', color: '#2a170e', left: '-3%', top: '60%' },
  { kind: 'paw', color: '#2a170e', left: '98%', top: '20%' },
  { kind: 'swirl', color: '#cf7347', left: '-5%', top: '8%' },
  { kind: null },
  { kind: 'heart', color: '#2a170e', left: '-4%', top: '52%' },
  { kind: 'heart', color: '#2a170e', left: '88%', top: '88%' },
  { kind: 'paw', color: '#cf7347', left: '50%', top: '104%' },
  { kind: 'sparkle', color: '#cf7347', left: '70%', top: '-4%' },
]

function Doodle({ d }) {
  if (!d?.kind) return null
  const style = { left: d.left, top: d.top }
  const el = {
    paw: <PawIcon size={22} />,
    sparkle: <Sparkle size={22} />,
    heart: <HeartOutline size={30} />,
    swirl: <Swirl color={d.color} />,
    dots: <Dots color={d.color} />,
    dashes: <Dashes color={d.color} />,
  }[d.kind]
  return (
    <span className="pup-doodle" style={{ ...style, color: d.color }} aria-hidden="true">
      {el}
    </span>
  )
}

export default function PuppyCard({ puppy, index = 0, tag = 'Available' }) {
  const ring = RINGS[index % RINGS.length]
  const tilt = TILTS[index % TILTS.length]
  const gone = puppy.status === 'gone_home'
  return (
    <Link to={`/puppies/${puppy.slug}`} className="pup-card" style={{ '--ring': ring, '--tilt': `${tilt}deg` }} data-col={index % 4}>
      <div className="pup-art">
        <span className="pup-ring" aria-hidden="true" />
        <span className="pup-arc pup-arc-a" aria-hidden="true" />
        <span className="pup-arc pup-arc-b" aria-hidden="true" />
        <div className="pup-photo">
          {puppy.cover && <img src={puppy.cover.url} alt={puppy.cover.alt} loading={index < 4 ? 'eager' : 'lazy'} />}
        </div>
        <span className="pup-tag hand">{gone ? 'gone home ♥' : tag}</span>
        {puppy.hasVideo && !gone && (
          <span className="pup-video">
            <Play size={10} fill="currentColor" aria-hidden="true" /> video
          </span>
        )}
        <Doodle d={DOODLES[index % DOODLES.length]} />
      </div>
      <h3 className="pup-name">{puppy.title}</h3>
      <p className="pup-meta">{puppyCardLine(puppy)}</p>
    </Link>
  )
}
