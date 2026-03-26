import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import MeetYourPet from '@/components/MeetYourPet'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import MidCTA from '@/components/MidCTA'
import SkillTreePreview from '@/components/SkillTreePreview'
import Testimonials from '@/components/Testimonials'
import FinalCTA from '@/components/FinalCTA'
import CharacterPicker from '@/components/CharacterPicker'
import PetGuide from '@/components/PetGuide'

export default function Home() {
  return (
    <main className="relative">
      <CharacterPicker />
      <PetGuide />
      <Nav />
      <Hero />
      <MeetYourPet />
      <HowItWorks />
      <Features />
      <MidCTA />
      <SkillTreePreview />
      <Testimonials />
      <FinalCTA />
    </main>
  )
}
