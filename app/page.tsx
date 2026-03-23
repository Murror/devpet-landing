import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import MeetYourPet from '@/components/MeetYourPet'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <MeetYourPet />
      <FinalCTA />
    </main>
  )
}
