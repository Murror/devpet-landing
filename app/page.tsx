import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WhyVibeCode from '@/components/WhyVibeCode'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import MidCTA from '@/components/MidCTA'
import SkillTreePreview from '@/components/SkillTreePreview'
import Testimonials from '@/components/Testimonials'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <WhyVibeCode />
      <HowItWorks />
      <Features />
      <MidCTA />
      <SkillTreePreview />
      <Testimonials />
      <FinalCTA />
    </main>
  )
}
