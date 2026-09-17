import Intro from './components/Intro'
import Atmosphere from './components/Atmosphere'
import CursorGlow from './components/CursorGlow'
import Spotlights from './components/Spotlights'
import SmoothScroll from './components/SmoothScroll'
import Nav from './components/Nav'
import Hero from './components/Hero'
import PetBand from './components/PetBand'
import Marquee from './components/Marquee'
import Loop from './components/Loop'
import Environment from './components/Environment'
import Departments from './components/Departments'
import Journey from './components/Journey'
import FinalCta from './components/FinalCta'

/**
 * /v3 — the cinematic-dark Codepet rebuild (draft).
 * Fixed layers (intro, atmosphere, cursor glow, nav) sit outside the
 * skewed scroll content. SmoothScroll drives Lenis + the velocity skew
 * on `main` (.v3-skewer). Promoting to `/` is a one-line swap.
 */
export default function V3Page() {
  return (
    <>
      <Intro />
      <Atmosphere />
      <CursorGlow />
      <Spotlights />
      <SmoothScroll />
      <Nav />
      <main className="v3-skewer">
        <Hero />
        <PetBand />
        <Marquee />
        <Loop />
        <Environment />
        <Departments />
        <Journey />
        <FinalCta />
      </main>
    </>
  )
}
