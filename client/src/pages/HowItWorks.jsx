import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, HeartHandshake, Dog, Truck, Plane, MessageSquareText, HeartPulse, Bookmark, MessagesSquare, Home } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import useInView from '../hooks/useInView'
import { useSite } from '../context/SiteContext'
import Mascot from '../components/ui/Mascot'
import Reveal from '../components/ui/Reveal'

const MODES = {
  dubai: {
    label: 'In Dubai',
    sub: 'meet in person',
    title: 'Meet your puppy in person',
    text: ["Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks."],
    place: 'Downtown Dubai',
    steps: [
      [Search, 'Explore our puppies', 'Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information.'],
      [HeartHandshake, 'Choose your puppy', 'Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions.'],
      [Dog, 'Meet before you choose', 'Spend time bonding before making your decision.'],
      [Truck, 'Pick-up or delivery', 'Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably.'],
    ],
  },
  imported: {
    label: 'Imported',
    sub: 'order upon request',
    title: 'Order upon request',
    text: [
      "Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.",
      "From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you.",
    ],
    place: 'Europe · Korea',
    steps: [
      [Bookmark, 'Reserve your puppy', 'Browse our selection of available breeds and place a reservation for the teacup puppy that captures your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences.'],
      [MessagesSquare, 'Personalized consultation', "Once your reservation is confirmed, we will work closely with you to finalize details and provide updates on your puppy's journey."],
      [Plane, 'Import and arrival', 'We manage all aspects of the import process, including health checks, travel arrangements, and necessary documentation. Your puppy will be carefully transported and will arrive ready to join your family.'],
      [Home, 'Welcome home', 'Upon arrival, we provide support to help your new puppy acclimate to their new environment. Our team is available for any additional assistance and to ensure a smooth transition into your home.'],
    ],
  },
}
const TINTS = ['#fbe0b2', '#fbe0dc', '#dfeaf8', '#e0efe2']

const PROMISE = [
  ['Hand-selected breeders', 'We work only with breeders who uphold the highest ethical and health standards.'],
  ['Full transparency', 'Photos, videos, and health certificates are shared before your puppy travels.'],
  ['Safe, stress-free delivery', 'We handle every detail of the import process, so your puppy arrives happy, healthy, and ready to love you.'],
]
const DELIVERY = [
  ['Take your puppy home the same day', 'Local puppies are available immediately — visit, fall in love, and go home together.'],
  ['Delivery within Dubai', 'Prefer to stay home? We deliver your puppy to your door within Dubai, safely and comfortably.'],
  ['Safe international cargo', 'We handle all the paperwork and ensure comfortable travel so your puppy arrives happy and stress-free.'],
  ['Worldwide delivery', 'We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.'],
]
const WHY = [
  [Plane, 'International cargo', 'We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.'],
  [MessageSquareText, 'Support 24/7', "Our team is available 24/7 to answer your questions and assist you through every step of the adoption process. From choosing your puppy to post-delivery support — we're just a message away."],
  [HeartPulse, 'Health guarantee', 'All our puppies come with a verified health certificate from licensed vets. We ensure every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.'],
]
const CHIPS = [['two-ways', 'Two ways home'], ['promise', 'Our premium puppy promise'], ['delivery', 'Delivery & collection'], ['why', 'Why choose us']]

function Skyline({ sun }) {
  const s = { fill: 'none', stroke: '#8f6b45', strokeOpacity: 0.7, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' }
  return (
    <svg viewBox="0 0 540 240" className="how-sky" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      {sun && <circle cx="400" cy="70" r="50" fill="#f4c566" />}
      <path {...s} d="M8 232 H532 M30 232 V170 h28 V232 M66 232 V204 h26 V232 M110 232 V150 h34 V232 M168 232 V170 l30 -14 V232 M222 232 V96 l14 -26 l8 -58 l8 58 l14 26 V232 M280 232 V150 l32 14 V232 M326 232 V190 h30 V232 M362 232 V112 h34 V232 M410 232 V174 h28 V232 M446 232 V150 h30 V232 M484 232 V196 h30 V232" />
    </svg>
  )
}

export default function HowItWorks() {
  usePageMeta('How it works', 'Two ways to bring home a TeddyPups puppy: meet in our Downtown Dubai showroom or order a premium breed imported from Korea and Europe. Delivery and health guarantee included.')
  const { wa } = useSite()
  const [mode, setMode] = useState('dubai')
  const [promiseRef, stamped] = useInView({ threshold: 0.25 })
  const m = MODES[mode]

  return (
    <div className="how-page">
      <section className="container-page pt-10 md:pt-14">
        <div className="how-head">
          <h1 className="text-[clamp(3.6rem,9.5vw,8.4rem)] leading-[0.92]">How it works</h1>
          <p className="max-w-[28rem] text-[1.12rem] leading-relaxed text-ink/85 lg:pt-3">
            Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.
          </p>
        </div>
        <nav className="mt-8 flex flex-wrap gap-3" aria-label="On this page">
          {CHIPS.map(([id, label], i) => (
            <a key={id} href={`#${id}`} className="how-chip"><b>{i + 1}</b>{label}</a>
          ))}
        </nav>

        {/* 1 · two ways home */}
        <section id="two-ways" className="how-section" aria-labelledby="two-ways-title">
          <div className="how-ways-head">
            <div>
              <p className="hand text-[1.1rem] text-rust">choose your way</p>
              <h2 id="two-ways-title" className="mt-1 text-[clamp(2.8rem,5vw,4.4rem)] leading-none">Two ways home</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="toggle" role="tablist" aria-label="Choose how you meet your puppy">
                {Object.entries(MODES).map(([key, v]) => (
                  <button key={key} type="button" role="tab" aria-selected={mode === key} className={mode === key ? 'is-on' : ''} onClick={() => setMode(key)}>
                    <strong>{v.label}</strong><span>{v.sub}</span>
                  </button>
                ))}
              </div>
              <Mascot pose="sit" className="hidden h-auto w-[104px] md:block" />
            </div>
          </div>

          <div className="how-ways-body" key={mode}>
            <div className="how-fade">
              <h3 className="text-[clamp(2.2rem,3.6vw,3.1rem)] leading-[1.02]">{m.title}</h3>
              {m.text.map((t) => <p key={t} className="mt-4 max-w-[36rem] text-[1.1rem] leading-relaxed text-ink/85">{t}</p>)}
            </div>
            <div className="how-art how-fade">
              <span className="hand how-art-label">{m.place}</span>
              {mode === 'dubai' ? (
                <><span className="how-sun" /><Skyline /></>
              ) : (
                <div className="how-route">
                  <svg viewBox="0 0 500 240" aria-hidden="true"><path d="M30 200 Q 150 40 330 80 Q 440 100 470 160" fill="none" stroke="#a24a1a" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1 9" /><circle cx="30" cy="200" r="6" fill="#a24a1a" /><circle cx="470" cy="160" r="6" fill="#a24a1a" /></svg>
                  <span className="hand" style={{ left: '4%', top: '88%' }}>Europe · Korea</span>
                  <span className="hand" style={{ left: '92%', top: '70%' }}>Dubai</span>
                  <Plane className="how-plane" size={86} strokeWidth={1.4} aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          <ol className="how-steps">
            {m.steps.map(([Icon, title, text], i) => (
              <li key={title}>
                <span className="how-icon" style={{ background: TINTS[i] }}><Icon size={26} strokeWidth={1.8} aria-hidden="true" /></span>
                <p className="mt-4 font-display text-[0.95rem] font-extrabold text-rust">Step {i + 1}</p>
                <h3 className="mt-0.5 text-[1.35rem] leading-tight">{title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink/80">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 2 · promise */}
        <section id="promise" className="how-section" aria-labelledby="promise-title">
          <div ref={promiseRef} className={`promise ${stamped ? 'is-stamped' : ''}`}>
            <p className="hand text-[1.1rem] text-rust">puppy passport</p>
            <h2 id="promise-title" className="mt-1 max-w-[10ch] text-[clamp(2.8rem,5.4vw,4.8rem)] leading-[0.95]">Our premium puppy promise</h2>
            <div className="promise-grid">
              {PROMISE.map(([t, d], i) => (
                <div key={t} className="stamp-cell" style={{ '--i': i }}>
                  <div className={`stamp stamp-${i}`}><span>{t}</span></div>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 · delivery */}
        <section id="delivery" className="how-section" aria-labelledby="delivery-title">
          <div className="how-delivery">
            <div>
              <h2 id="delivery-title" className="text-[clamp(2.8rem,5.4vw,4.8rem)] leading-[0.95]">Delivery &amp; collection</h2>
              <p className="mt-5 max-w-[34rem] text-[1.12rem] leading-relaxed text-ink/85">From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably and arrives safely.</p>
              <dl className="delivery-list">
                {DELIVERY.map(([t, d]) => (
                  <div key={t}><dt className="font-display text-[1.2rem] font-extrabold leading-tight">{t}</dt><dd className="mt-1.5 text-[0.98rem] leading-relaxed text-ink/80">{d}</dd></div>
                ))}
              </dl>
            </div>
            <Reveal className="how-route how-route-big">
              <Skyline />
              <svg viewBox="0 0 500 240" aria-hidden="true" className="how-route-line"><path d="M40 190 Q 130 90 280 70 Q 420 60 470 150" fill="none" stroke="#a24a1a" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1 9" /><circle cx="40" cy="190" r="6" fill="#a24a1a" /><circle cx="470" cy="150" r="6" fill="#a24a1a" /></svg>
              <span className="hand" style={{ left: '8%', top: '86%' }}>Korea</span>
              <span className="hand" style={{ left: '92%', top: '66%' }}>Dubai</span>
              <Plane className="how-plane" size={110} strokeWidth={1.3} aria-hidden="true" />
            </Reveal>
          </div>
        </section>

        {/* 4 · why */}
        <section id="why" className="how-section" aria-labelledby="why-title">
          <div className="how-why">
            <div>
              <h2 id="why-title" className="text-[clamp(2.8rem,5.4vw,4.8rem)] leading-[0.95]">Why choose us</h2>
              <p className="mt-6 max-w-[30rem] text-[1.12rem] leading-relaxed text-ink/85">We&apos;re here to help you find a new family member. From the moment you visit our site to the joyful day your puppy arrives at your door, we&apos;re with you every step of the way. Our mission is to make the entire adoption process smooth, transparent, and full of love.</p>
            </div>
            <ul className="why-list">
              {WHY.map(([Icon, t, d]) => (
                <li key={t}><Icon size={40} strokeWidth={1.4} className="mt-1 shrink-0 text-rust" aria-hidden="true" /><div><h3 className="text-[1.45rem] leading-tight">{t}</h3><p className="mt-1.5 text-[1rem] leading-relaxed text-ink/85">{d}</p></div></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="how-cta" aria-labelledby="how-cta-title">
          <div>
            <h2 id="how-cta-title" className="text-[clamp(2.3rem,4.6vw,4rem)] leading-[1]">Unique and high quality puppies</h2>
            <p className="mt-4 max-w-[40rem] text-[1.1rem] leading-relaxed text-ink/85">When you choose TeddyPups, you can trust that you&apos;re getting a puppy of the highest quality. We also provide guidance and support to new pet owners, offering advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={wa()} target="_blank" rel="noreferrer" className="btn btn-leaf !px-6 !py-3.5">Ask us on WhatsApp</a>
              <Link to="/puppies" className="btn btn-outline !px-6 !py-3.5">See available puppies</Link>
            </div>
          </div>
          <Mascot pose="walk" className="how-cta-pup" />
        </section>
      </section>
    </div>
  )
}
