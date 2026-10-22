import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'
import Mascot from '../components/ui/Mascot'

// `what` is "page" for unknown addresses, or "puppy" when /puppies/<slug> does not exist
export default function NotFound({ what = 'page' }) {
  usePageMeta('Not found')
  const puppy = what === 'puppy'
  return (
    <div className="paper">
      <div className="container-page flex flex-col items-center py-24 text-center md:py-32">
        <Mascot pose="sit" eyes="closed" className="h-36 w-36" />
        <p className="hand mt-4 text-[1.2rem] text-rust">404, sniff sniff…</p>
        <h1 className="mt-2 text-[clamp(2.8rem,6vw,4.8rem)]">{puppy ? 'We could not find that puppy' : 'This page ran away'}</h1>
        <p className="mt-4 max-w-md text-[1.05rem] text-ink/80">
          {puppy ? 'Maybe they already found a family. Have a look at everyone who is waiting for a home right now.' : 'The page you are looking for does not exist or has moved. Let us take you somewhere friendly.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/puppies" className="btn btn-primary !px-6 !py-3.5">See available puppies</Link>
          <Link to="/" className="btn btn-outline !px-6 !py-3.5">Back to the home page</Link>
        </div>
      </div>
    </div>
  )
}
