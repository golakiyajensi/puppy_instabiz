import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import useApi from '../hooks/useApi'
import useLetterForm from '../hooks/useLetterForm'
import { api } from '../services/api'
import { useSite } from '../context/SiteContext'
import Mascot from '../components/ui/Mascot'
import { PawIcon } from '../components/ui/Doodles'

const optionLabel = (p) => (p.name ? `${p.name} (${p.breed}, ${p.sexLabel})` : `${p.breed} (${p.sexLabel})`)

// one blank in the "Dear TeddyPups" sentence
function Blank({ id, label, error, width, className = '', ...props }) {
  return (
    <input id={id} name={id} aria-label={label} aria-invalid={error ? 'true' : undefined} className={`blank ${className}`} style={{ width }} {...props} />
  )
}

export default function Contact() {
  usePageMeta('Visit & contact', 'Get in touch with TeddyPups U.A.E. Write us a letter, message us on WhatsApp, or visit our showroom in Downtown Dubai.')
  const { site, wa } = useSite()
  const [params] = useSearchParams()
  const { data } = useApi(() => api.puppies({ status: 'available' }), [])
  const puppies = data?.puppies ?? []

  const form = useLetterForm({
    initial: { name: '', phone: '', email: '', location: '', puppySlug: '', message: '', website: '' },
    send: (body) => api.sendContact(body),
  })
  const { values, errors, status, message, set, submit, reset, setValues } = form
  const errorList = useMemo(() => Object.entries(errors).filter(([, v]) => v), [errors])

  // /contact?puppy=<slug> opens the letter with that puppy already chosen
  const wanted = params.get('puppy')
  useEffect(() => {
    if (wanted) setValues((v) => ({ ...v, puppySlug: wanted }))
  }, [wanted, setValues])

  return (
    <div className="contact-page">
      <section className="container-page pb-24 pt-10 md:pt-14">
        <div className="contact-head">
          <h1 className="text-[clamp(3.6rem,9.5vw,8.6rem)] leading-[0.92]">Get in touch with us</h1>
          <p className="max-w-[30rem] text-[1.15rem] leading-relaxed text-ink/85 lg:mb-4">
            Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we&apos;d love to hear from you!
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-side">
            <a href={wa()} target="_blank" rel="noreferrer" className="btn btn-leaf !px-6 !py-3.5">WhatsApp {site.phoneDisplay}</a>
            <div className="mt-9">
              <p className="hand text-[1.05rem]">call us</p>
              <a href={`tel:${site.phoneTel}`} className="contact-link">{site.phoneDisplay}</a>
            </div>
            <div className="mt-6">
              <p className="hand text-[1.05rem]">email</p>
              <a href={`mailto:${site.email}`} className="contact-link break-all">{site.email}</a>
            </div>

            <div className="visit-card">
              <div className="visit-awning" aria-hidden="true" />
              <div className="visit-body">
                <div className="visit-text">
                  <h2 className="text-[1.9rem] leading-[1.1]">Visit us in Downtown Dubai</h2>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/85">Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.</p>
                  <p className="mt-4 flex items-start gap-2.5 font-semibold"><PawIcon size={14} className="mt-1.5 shrink-0 text-rust" />{site.address}</p>
                  <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-outline mt-5 !bg-cream">Open in Google Maps</a>
                </div>
                <img src="/images/home/showroom-000.webp" alt="A teddy bear puppy held up in the TeddyPups showroom" className="visit-photo" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="letter-wrap">
            <form className="letter-form sketch-box" onSubmit={submit} noValidate data-prefix="">
              <span className="letter-stamp" aria-hidden="true"><PawIcon size={30} className="text-[#c2662e]" /></span>
              {status === 'sent' ? (
                <div className="flex min-h-[26rem] flex-col items-start justify-center gap-4 py-10 pl-6 pr-4" role="status">
                  <CheckCircle2 className="text-leaf" size={46} aria-hidden="true" />
                  <h2 className="hand text-[2rem] text-rust">Letter posted!</h2>
                  <p className="max-w-md text-[1.1rem] leading-relaxed">{message}</p>
                  <button type="button" className="btn btn-outline mt-2" onClick={reset}>Write another letter</button>
                </div>
              ) : (
                <>
                  <h2 className="hand pl-6 text-[1.9rem] font-semibold text-rust">Dear TeddyPups,</h2>
                  <div className="letter-text">
                    <p>
                      my name is <Blank id="name" label="Your name" value={values.name} onChange={set('name')} error={errors.name} width="13.5rem" autoComplete="name" />, and you can reach me on{' '}
                      <Blank id="phone" label="Phone or WhatsApp" type="tel" placeholder="+971 50 123 4567" value={values.phone} onChange={set('phone')} error={errors.phone} width="12rem" autoComplete="tel" /> or by email at{' '}
                      <Blank id="email" label="Email (optional)" type="email" placeholder="optional" value={values.email} onChange={set('email')} error={errors.email} width="14rem" autoComplete="email" />.
                    </p>
                    <p>
                      I live in <Blank id="location" label="Where you live (optional)" placeholder="e.g. Dubai Marina" value={values.location} onChange={set('location')} error={errors.location} width="12rem" autoComplete="address-level2" />, and I&apos;m curious about{' '}
                      <span className="blank-select">
                        <select id="puppySlug" name="puppySlug" aria-label="Puppy you're interested in (optional)" value={values.puppySlug} onChange={set('puppySlug')}>
                          <option value="">any puppy (not sure yet)</option>
                          {puppies.map((p) => <option key={p.id} value={p.slug}>{optionLabel(p)}</option>)}
                        </select>
                      </span>.
                    </p>
                  </div>
                  <label htmlFor="message" className="sr-only">Your message (optional)</label>
                  <textarea id="message" name="message" rows={4} className="lined" placeholder="Anything else you'd like to tell us…" value={values.message} onChange={set('message')} aria-invalid={errors.message ? 'true' : undefined} />
                  <div className="sr-only" aria-hidden="true">
                    <label>Website<input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={set('website')} /></label>
                  </div>

                  {(errorList.length > 0 || (status === 'error' && message)) && (
                    <div role="alert" className="letter-errors">
                      {status === 'error' && message && <p>{message}</p>}
                      <ul>{errorList.map(([k, v]) => <li key={k}>{v}</li>)}</ul>
                    </div>
                  )}

                  <div className="letter-foot">
                    <span className="hand text-[1.05rem]">with love, a future puppy parent</span>
                    <button type="submit" className="btn btn-primary !px-7 !py-3.5" disabled={status === 'sending'}>{status === 'sending' ? 'Posting…' : 'Post my letter'}</button>
                  </div>
                </>
              )}
            </form>
            <Mascot pose="sit" className="letter-pup" />
          </div>
        </div>
      </section>
    </div>
  )
}
