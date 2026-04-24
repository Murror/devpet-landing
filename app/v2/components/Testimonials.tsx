'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

/**
 * Testimonials — Section 8 of the /v2 landing.
 *
 * Pink (#FF8CC9) band matching the Framer "Social Proof" comp:
 *   - Left column: two-line heading ("real results from the beta" /
 *     "three stories. real change.")
 *   - Right column: 3 testimonial items — each a pet sprite sitting
 *     ABOVE a rounded light-grey quote card.
 *
 * Pets are pulled from /public/v2/pets/ (yellow bear, green owl,
 * blue penguin by default). Swap by editing the `testimonials`
 * array — the grid auto-flows.
 *
 * Scroll-linked reveal matches the Framer Scroll Animation panel
 * (Slide In Bottom preset — Opacity 0, Offset Y +150, Spring
 * transition with stiffness 200 / damping 35 / mass 1). Uses the
 * same scroll-progress driver as SkillTrees: the heading block and
 * each testimonial item get a `.v2-testimonials-reveal` class, and
 * a rAF-throttled scroll listener writes --scroll-progress to each
 * one every frame, which CSS then maps to opacity + translateY.
 *
 * NOTE: quote #1 and #2 are identical in the Framer comp. Leaving
 * them as-is pending unique copy from the user.
 */
const testimonials = [
  {
    // Character #1 — yellow bear PNG at /public/v2/pets/5-yellow-bear.png
    pet: '/v2/pets/5-yellow-bear.png',
    alt: 'Yellow bear companion',
    quote: '“40% broken prompts to just 12%. the pet makes me persistent.”',
    name: 'sarah k.',
    role: 'designer who codes',
  },
  {
    // Character #2 — swapped to PNG (drop file at /public/v2/pets/2-green-owl.png)
    pet: '/v2/pets/2-green-owl.png',
    alt: 'Green owl companion',
    quote: '“shipped my first saas in 6 weeks. 0 to $200 mrr.”',
    name: 'wei c.',
    role: 'indie dev',
  },
  {
    // Character #3 — swapped to PNG (drop file at /public/v2/pets/7-blue-penguin.png)
    pet: '/v2/pets/7-blue-penguin.png',
    alt: 'Blue penguin companion',
    quote: '“6 prompts for auth → 1. hours saved, more shipped.”',
    name: 'alex r.',
    role: 'solo founder',
  },
] as const

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null)

  // Scroll-linked reveal — same pattern as SkillTrees. Every element
  // marked `.v2-testimonials-reveal` has its [0..1] scroll progress
  // computed per frame and written to a CSS custom property, which
  // CSS maps to opacity + translateY. The heading block and each
  // testimonial item carry the class, so they all appear/disappear
  // continuously with scroll.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    // Cache each target + its stagger value once at setup so we're not
    // re-parsing data attributes every scroll frame. The `stagger`
    // value is in CSS pixels and delays when the item's ramp begins —
    // simulates the per-card Delay (0s / 0.1s / 0.2s / 0.3s) from the
    // Framer Transition panel, translated into scroll distance.
    const targets = Array.from(
      section.querySelectorAll<HTMLElement>('.v2-testimonials-reveal')
    ).map((el) => ({
      el,
      stagger: parseFloat(el.dataset.stagger ?? '0') || 0,
    }))
    if (targets.length === 0) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      for (const { el } of targets) {
        el.style.setProperty('--scroll-progress', '1')
      }
      return
    }

    let rafId: number | null = null

    const update = () => {
      rafId = null
      const vh = window.innerHeight
      // Entry ramp 60% of viewport height, shaped so the reveal feels
      // deliberate (longer than Skill Tree's 45%). Exit ramp is tighter
      // (25%) and GATED behind rect.top < 0 — an element still in view
      // but sitting near the top of the viewport should be at progress
      // 1, not fading out. Without the gate the cards snap-aligned at
      // the top of the section were stuck at 60–80% opacity, which
      // read as soft / washed-out edges and a pink-tinted card bg.
      const entryRamp = vh * 0.6
      const exitRamp = vh * 0.25
      for (const { el, stagger } of targets) {
        const rect = el.getBoundingClientRect()
        // The stagger offset pushes this element's entry ramp back by
        // `stagger` pixels of scroll, so each card starts appearing a
        // beat after its neighbor even though they all share the same
        // row position.
        const entry = Math.max(
          0,
          Math.min(1, (vh - rect.top - stagger) / entryRamp)
        )
        const exit =
          rect.top >= 0
            ? 1
            : Math.max(0, Math.min(1, rect.bottom / exitRamp))
        const progress = Math.min(entry, exit)
        el.style.setProperty('--scroll-progress', progress.toFixed(3))
      }
    }

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="v2-testimonials"
    >
      <div className="v2-testimonials-inner">
        <header className="v2-testimonials-heading v2-testimonials-reveal">
          <h2 className="v2-testimonials-title">real results from the beta</h2>
          <p className="v2-testimonials-subtitle">three stories. real change.</p>
        </header>

        <ul className="v2-testimonials-list">
          {testimonials.map((t, i) => (
            <li
              key={i}
              className="v2-testimonials-item v2-testimonials-reveal v2-testimonials-reveal--h"
              /* Per-card stagger in CSS pixels — ~160px per "beat"
                 so each character clearly appears after its neighbor
                 instead of nearly together. Tuned up from 50px
                 because at a shorter stagger the cards entered
                 essentially in parallel. At 160px per step: card 1
                 starts at progress 0, card 2 needs ~160px more
                 scroll to begin, card 3 needs ~320px more — about
                 one character per ~1/4 viewport of scroll. */
              data-stagger={i * 160}
            >
              <div className="v2-testimonials-pet">
                <Image
                  src={t.pet}
                  alt={t.alt}
                  width={180}
                  height={180}
                  unoptimized
                />
              </div>
              <figure className="v2-testimonials-card">
                <blockquote className="v2-testimonials-quote">
                  {t.quote}
                </blockquote>
                <figcaption className="v2-testimonials-attr">
                  <span className="v2-testimonials-name">{t.name}</span>
                  <span className="v2-testimonials-role">{t.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
