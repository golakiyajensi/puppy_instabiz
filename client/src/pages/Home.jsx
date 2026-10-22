import usePageMeta from '../hooks/usePageMeta'
import useApi from '../hooks/useApi'
import { api } from '../services/api'
import { Loading, ApiError } from '../components/ui/ApiState'
import Hero from '../components/sections/Hero'
import MeetPups from '../components/sections/MeetPups'
import TwoWays from '../components/sections/TwoWays'
import Journey from '../components/sections/Journey'
import Passport from '../components/sections/Passport'
import HappyFamilies from '../components/sections/HappyFamilies'
import FaqTeaser from '../components/sections/FaqTeaser'
import FinalCta from '../components/sections/FinalCta'

export default function Home() {
  usePageMeta(null, 'Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide. Vaccinated, health-checked teacup puppies with delivery across the UAE.')
  const { data, error, loading, reload } = useApi(() => api.home(), [])

  if (loading) return <Loading />
  if (error) return <ApiError error={error} onRetry={reload} />

  return (
    <>
      <Hero pups={data.pups} />
      <MeetPups pups={data.pups} />
      <TwoWays />
      <Journey steps={data.journey} />
      <Passport points={data.trust} />
      <HappyFamilies testimonial={data.testimonial} photos={data.familyPhotos} />
      <FaqTeaser faqs={data.faqs} />
      <FinalCta />
    </>
  )
}
