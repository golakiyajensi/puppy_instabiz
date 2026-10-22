// One labelled form field with its hint and error message wired up for screen readers.
export default function Field({ id, label, required, optional, hint, error, as = 'input', className = '', ...props }) {
  const Tag = as
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[0.92rem] font-semibold leading-tight">
        {label}
        {required && <span className="text-rust" aria-hidden="true"> *</span>}
        {optional && <span className="font-normal text-ink/70"> (optional)</span>}
      </label>
      <Tag id={id} name={id} className="field-input mt-1.5" aria-invalid={error ? 'true' : undefined} aria-required={required || undefined} aria-describedby={describedBy} {...props} />
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-[0.8rem] text-ink/70">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-[0.82rem] font-semibold text-[#b3261e]">{error}</p>}
    </div>
  )
}
