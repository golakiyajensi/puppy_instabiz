import Mascot from './Mascot'

// Shown while a page waits for the API
export function Loading({ label = 'fetching puppies…' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center" role="status" aria-live="polite">
      <Mascot pose="sit" className="h-28 w-28 animate-float" />
      <p className="hand text-lg text-rust">{label}</p>
    </div>
  )
}

// Shown when the API cannot be reached or answers with an error
export function ApiError({ error, onRetry }) {
  const offline = error?.network
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-20 text-center" role="alert">
      <Mascot pose="sit" eyes="closed" className="h-32 w-32" />
      <h2 className="text-3xl">{offline ? "We can't reach the server" : 'Something went wrong'}</h2>
      <p className="text-ink/75">
        {offline
          ? 'The website could not talk to its API. If you are running it locally, start the backend (npm run dev in /server) and make sure the MySQL database is set up (npm run db:setup).'
          : error?.message || 'Please try again in a moment.'}
      </p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
