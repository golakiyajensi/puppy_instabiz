import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useSite } from '../../context/SiteContext'

// Big photo with previous / next buttons, a counter and a row of thumbnails.
// A "video" slide shows its poster picture: the demo has no video files, so Play opens WhatsApp to ask for the clip.
export default function Gallery({ images = [], label }) {
  const { wa } = useSite()
  const [at, setAt] = useState(0)
  const count = images.length

  useEffect(() => setAt(0), [images])
  const go = (step) => setAt((i) => (i + step + count) % count)
  const current = images[at]
  if (!count) return null

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }

  return (
    <div className="gallery" role="group" aria-roledescription="carousel" aria-label={`Photos of ${label}`} onKeyDown={onKey}>
      <div className="gallery-frame">
        <img key={current.url} src={current.url} alt={current.alt || label} className="gallery-img" />
        {current.isVideo && (
          <a className="gallery-play" href={wa(`Hi TeddyPups! Could you send me the video of ${label}?`)} target="_blank" rel="noreferrer" aria-label={`Ask for the video of ${label} on WhatsApp`}>
            <Play size={28} fill="currentColor" aria-hidden="true" />
          </a>
        )}
        {count > 1 && (
          <>
            <button type="button" className="gallery-nav gallery-prev" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={20} /></button>
            <span className="gallery-count" aria-live="polite">{at + 1} / {count}</span>
            <button type="button" className="gallery-nav gallery-next" onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={20} /></button>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="gallery-thumbs">
          {images.map((img, i) => (
            <li key={img.url}>
              <button type="button" className={`thumb ${i === at ? 'is-on' : ''}`} onClick={() => setAt(i)} aria-label={`Show photo ${i + 1}${img.isVideo ? ' (video)' : ''}`} aria-current={i === at}>
                <img src={img.url} alt="" loading="lazy" />
                {img.isVideo && <span className="thumb-play"><Play size={16} fill="currentColor" aria-hidden="true" /></span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
