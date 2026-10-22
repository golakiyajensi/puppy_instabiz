import { useState } from 'react'
import { validatePerson } from '../lib/validate'

// State + submit handling shared by the "Ask about <puppy>" form and the contact letter.
//   const form = useLetterForm({ initial: { name: '', ... }, send: api.sendEnquiry })
// status: 'idle' | 'sending' | 'sent' | 'error'
export default function useLetterForm({ initial, send, extra = () => ({}) }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const set = (name) => (e) => {
    const value = e.target.value
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const found = validatePerson(values)
    if (Object.keys(found).length) {
      setErrors(found)
      setStatus('idle')
      // put the cursor on the first field that needs attention
      const first = Object.keys(found)[0]
      document.getElementById(`${e.currentTarget.dataset.prefix || ''}${first}`)?.focus()
      return
    }
    setStatus('sending')
    setMessage('')
    try {
      const res = await send({ ...values, ...extra() })
      setStatus('sent')
      setMessage(res.message)
    } catch (err) {
      setStatus('error')
      setErrors(err.errors || {})
      setMessage(err.network ? 'We could not reach the server. Please try again, or message us on WhatsApp.' : err.message)
    }
  }

  const reset = () => {
    setValues(initial)
    setErrors({})
    setStatus('idle')
    setMessage('')
  }

  return { values, errors, status, message, set, submit, reset, setValues }
}
