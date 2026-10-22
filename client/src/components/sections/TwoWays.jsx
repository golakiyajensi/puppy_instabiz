import { Link } from 'react-router-dom'
import Mascot from '../ui/Mascot'
import Reveal from '../ui/Reveal'

// A wooden sign that points left or right
function Sign({ side, children }) {
  const left = side === 'left'
  return (
    <div className={`sign sign-${side}`}>
      <svg viewBox="0 0 320 84" preserveAspectRatio="none" className="sign-svg" aria-hidden="true">
        <path
          d={left ? 'M30 7 L313 11 L313 75 L30 79 L5 43Z' : 'M7 11 L290 7 L315 43 L290 79 L7 75Z'}
          fill="#dc9c50"
          stroke="#2a170e"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
        <path d={left ? 'M40 24 H300 M40 58 H300' : 'M18 24 H280 M18 58 H280'} stroke="#8a4f1c" strokeOpacity=".28" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="sign-text">{children}</span>
    </div>
  )
}

// Dubai skyline drawn with lines
function Skyline() {
  const stroke = { fill: 'none', stroke: '#8f6b45', strokeOpacity: 0.62, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' }
  return (
    <svg viewBox="0 0 540 240" className="skyline" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <path {...stroke} d="M8 232 H532" />
      <path {...stroke} d="M30 232 V150 h28 V232 M66 232 V204 h26 V232" />
      <path {...stroke} d="M110 232 V120 h34 V232 M118 120 V104 h18 V120" />
      <path {...stroke} d="M168 232 V150 l30 -14 V232" />
      <path {...stroke} d="M222 232 V96 l14 -26 l8 -58 l8 58 l14 26 V232" />
      <path {...stroke} d="M280 232 V130 l32 14 V232" />
      <path {...stroke} d="M326 232 V170 h30 V232 M362 232 V92 h34 V232" />
      <path {...stroke} d="M410 232 V154 h28 V232 M446 232 V130 h30 V232 M484 232 V186 h30 V232" />
    </svg>
  )
}

function Plane() {
  return (
    <svg viewBox="0 0 200 136" className="plane-svg" aria-hidden="true">
      <defs>
        <clipPath id="plane-window">
          <circle cx="104" cy="66" r="19" />
        </clipPath>
      </defs>
      <path d="M72 44 L104 6 L132 6 L116 44Z" fill="#b8541f" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <path d="M72 88 L104 128 L132 128 L116 88Z" fill="#b8541f" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <path d="M30 62 L10 36 L32 40 L44 52Z" fill="#b8541f" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <path d="M18 66 Q18 44 58 42 L152 42 Q186 44 190 66 Q186 88 152 90 L58 90 Q18 88 18 66Z" fill="#fffdf8" stroke="#2a170e" strokeWidth="4.5" strokeLinejoin="round" />
      <circle cx="104" cy="66" r="21" fill="#e8d5b5" stroke="#2a170e" strokeWidth="4" />
      <image href="/images/home/showroom-000.webp" x="82" y="40" width="44" height="52" preserveAspectRatio="xMidYMid slice" clipPath="url(#plane-window)" />
      <path d="M170 56 Q178 60 184 56" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default function TwoWays() {
  return (
    <section className="ways" aria-labelledby="ways-title">
      <div className="container-page">
        <Reveal as="h2" id="ways-title" className="ways-title">Two ways to meet your puppy</Reveal>

        <div className="ways-stage">
          <div className="ways-pole" aria-hidden="true" />
          <Sign side="left">Puppies in Dubai</Sign>
          <Sign side="right">Imported for you</Sign>

          <Reveal className="ways-col ways-left -translate-x-2">
            <div className="showroom">
              <Skyline />
              <figure className="shop">
                <div className="awning" aria-hidden="true" />
                <img src="/images/home/showroom-000.webp" alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom" loading="lazy" />
                <figcaption className="hand">In our showroom</figcaption>
              </figure>
            </div>
            <p className="ways-text">See them, love them, take them home. Come meet our locally available puppies before you decide.</p>
            <Link to="/puppies?origin=local" className="btn btn-primary">Meet local puppies</Link>
          </Reveal>

          <Reveal className="ways-col ways-right -translate-x-2" delay={120}>
            <div className="flight">
              <svg viewBox="0 0 500 240" className="flight-path" aria-hidden="true">
                <path d="M20 212 Q 110 72 268 66 Q 420 62 495 145" fill="none" stroke="#a24a1a" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1 9" />
                <circle cx="20" cy="212" r="6" fill="#a24a1a" />
                <circle cx="495" cy="145" r="6" fill="#a24a1a" />
              </svg>
              <span className="flight-label hand" style={{ left: '4%', top: '91%' }}>Korea</span>
              <span className="flight-label hand" style={{ left: '98%', top: '64%' }}>Dubai</span>
              <div className="plane"><Plane /></div>
            </div>
            <p className="ways-text">Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.</p>
            <Link to="/puppies?origin=imported" className="btn btn-primary">See imported puppies</Link>
          </Reveal>

          <Mascot pose="sit" className="ways-mascot" />
        </div>
      </div>
    </section>
  )
}
