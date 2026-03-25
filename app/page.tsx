import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import MidCTA from '@/components/MidCTA'
import SkillTreePreview from '@/components/SkillTreePreview'
import Testimonials from '@/components/Testimonials'
import MeetYourPet from '@/components/MeetYourPet'
import FinalCTA from '@/components/FinalCTA'
import ByteGuide from '@/components/ByteGuide'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <MidCTA />
      <SkillTreePreview />
      <Testimonials />
      <MeetYourPet />
      <FinalCTA />
      <ByteGuide />
    </main>
  )
}
