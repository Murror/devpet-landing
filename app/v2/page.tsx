import Nav from './components/Nav'
import Hero from './components/Hero'
import Product from './components/Product'
import Stats from './components/Stats'
import Mindset from './components/Mindset'
import GetGood from './components/GetGood'
import SkillTrees from './components/SkillTrees'
import Testimonials from './components/Testimonials'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import InstallPrompt from './components/InstallPrompt'
import CopyGuard from './components/CopyGuard'

export default function V2LandingPage() {
  return (
    <main id="top" className="relative bg-black text-white">
      <CopyGuard />
      <Nav />
      <InstallPrompt />
      <Hero />
      {/* Blue "canvas" band that holds the Product section. The
          Product's rounded-corner card sits inside this wrapper so
          that the area around its rounded edges reads as blue
          (matching the Hero) rather than the page's black ground. */}
      <div className="v2-product-wrap">
        <Product />
      </div>
      <Stats />
      <Mindset />
      <GetGood />
      <SkillTrees />
      <Testimonials />
      <FinalCta />
      <Footer />
    </main>
  )
}
