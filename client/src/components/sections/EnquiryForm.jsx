import { CheckCircle2 } from 'lucide-react'
import { api } from '../../services/api'
import useLetterForm from '../../hooks/useLetterForm'
import Field from '../ui/Field'
import { PawIcon } from '../ui/Doodles'
import { useSite } from '../../context/SiteContext'

// "4 · dear TeddyPups…" card on a puppy page: sends the visitor's details to POST /api/enquiries
export default function EnquiryForm({ puppy, who, defaultMessage, heading }) {
  const { wa } = useSite()
  const form = useLetterForm({
    initial: { name: '', phone: '', email: '', area: '', message: defaultMessage, website: '' },
    send: (body) => api.sendEnquiry({ ...body, puppySlug: puppy.slug }),
  })
  const { values, errors, status, message, set, submit } = form

  return (
    <section id="enquire" className="letter sketch-box" aria-labelledby="enquire-title">
      <span className="letter-stamp" aria-hidden="true"><PawIcon size={30} className="text-[#c2662e]" /></span>
      <div className="letter-grid">
        <div>
          <p className="label-row"><span className="label-num">4</span><span className="hand text-[1.15rem] text-rust">dear TeddyPups…</span></p>
          <h2 id="enquire-title" className="mt-2 text-[clamp(2.3rem,4vw,3.4rem)] leading-[0.98]">{heading || `Ask about ${who}`}</h2>
          <p className="mt-4 max-w-[24rem] text-[1.02rem] leading-relaxed text-ink/85">
            Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.
          </p>
          <a href={wa(defaultMessage)} target="_blank" rel="noreferrer" className="mt-4 inline-block font-semibold text-leaf underline underline-offset-4">Chat on WhatsApp instead</a>
        </div>

        {status === 'sent' ? (
          <div className="flex flex-col items-start gap-3 self-center rounded-3xl bg-[#eaf5ee] p-7" role="status">
            <CheckCircle2 className="text-leaf" size={40} aria-hidden="true" />
            <h3 className="text-[1.9rem]">Thank you, {values.name.split(' ')[0]}!</h3>
            <p className="text-ink/85">{message}</p>
            <button type="button" className="btn btn-outline mt-2" onClick={form.reset}>Send another enquiry</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate data-prefix="enq-" className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field id="enq-name" label="Your name" required value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            <Field id="enq-phone" label="Phone or WhatsApp" required type="tel" value={values.phone} onChange={set('phone')} error={errors.phone} hint="With country code, e.g. +971 50 123 4567" autoComplete="tel" />
            <Field id="enq-email" label="Email" optional type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            <Field id="enq-area" label="Your area" optional value={values.area} onChange={set('area')} error={errors.area} hint="e.g. Dubai Marina" autoComplete="address-level2" />
            {/* spam trap: hidden from people, bots tend to fill it */}
            <div className="sr-only" aria-hidden="true">
              <label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} name="website" /></label>
            </div>
            <Field id="enq-message" as="textarea" rows={4} label="Message" optional className="sm:col-span-2" value={values.message} onChange={set('message')} error={errors.message} />
            {status === 'error' && message && <p role="alert" className="sm:col-span-2 rounded-xl bg-[#fdeceb] px-4 py-3 text-[0.95rem] font-semibold text-[#8f1d17]">{message}</p>}
            <div className="sm:col-span-2">
              <button type="submit" className="btn btn-primary !px-7 !py-3.5" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
