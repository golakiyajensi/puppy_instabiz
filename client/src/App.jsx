import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import MobileBar from './components/layout/MobileBar'
import ScrollToTop from './components/layout/ScrollToTop'
import CursorPawTrail from './components/ui/CursorPawTrail'
import { SiteProvider } from './context/SiteContext'
import Home from './pages/Home'
import Puppies from './pages/Puppies'
import PuppyDetail from './pages/PuppyDetail'
import GoneHome from './pages/GoneHome'
import HappyFamilies from './pages/HappyFamilies'
import HowItWorks from './pages/HowItWorks'
import Faq from './pages/Faq'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function Layout() {
  const { pathname } = useLocation()
  // the home page already ends in a dark section, so its footer needs no wavy edge
  const wave = pathname !== '/'
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer wave={wave} />
      <MobileBar />
      <div className="h-[72px] md:hidden" aria-hidden="true" />
      <CursorPawTrail />
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="puppies" element={<Puppies />} />
          <Route path="puppies/:slug" element={<PuppyDetail />} />
          <Route path="gone-home" element={<GoneHome />} />
          <Route path="happy-families" element={<HappyFamilies />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SiteProvider>
  )
}
