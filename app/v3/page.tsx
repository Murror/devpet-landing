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
import { getReleaseState } from '@/lib/releaseServer'
import { ReleaseProvider } from '@/lib/ReleaseProvider'

/**
 * /v3 — the cinematic-dark Codepet rebuild (draft).
 * Fixed layers (intro, atmosphere, cursor glow, nav) sit outside the
 * skewed scroll content. SmoothScroll drives Lenis + the velocity skew
 * on `main` (.v3-skewer). Promoting to `/` is a one-line swap.
 */
export default async function V3Page() {
  // Asked here, on the server, so the HTML that reaches the browser already has the right
  // call to action. Deciding it client-side meant shipping a guess and correcting it after
  // hydration — visible as a flash on the primary CTA, and never corrected at all for
  // crawlers. See lib/releaseServer.ts.
  const release = await getReleaseState()

  return (
    <ReleaseProvider value={release}>
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
    </ReleaseProvider>
  )
}
