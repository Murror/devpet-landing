'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

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
// Pet sprites stay constant; quote/name/role come from t.v2.testimonials
// at render. itemKey lets us look them up via `${itemKey}Quote`, etc.
const testimonials = [
  { pet: '/v2/pets/5-yellow-bear.png', alt: 'Yellow bear companion', itemKey: 'item1' as const },
  { pet: '/v2/pets/2-green-owl.png',   alt: 'Green owl companion',   itemKey: 'item2' as const },
  { pet: '/v2/pets/7-blue-penguin.png', alt: 'Blue penguin companion', itemKey: 'item3' as const },
] as const

export default function Testimonials() {
  const { t } = useLocale()
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
          <h2 className="v2-testimonials-title">{t.v2.testimonials.title}</h2>
          <p className="v2-testimonials-subtitle">{t.v2.testimonials.subtitle}</p>
        </header>

        <ul className="v2-testimonials-list">
          {/* Loop variable renamed to `item` to avoid colliding with
              the `t` translation alias from useLocale(). */}
          {testimonials.map((item, i) => (
            <li
              key={i}
              className="v2-testimonials-item"
              data-stagger={i * 40}
            >
              <div className="v2-testimonials-pet">
                <Image
                  src={item.pet}
                  alt={item.alt}
                  width={180}
                  height={180}
                  unoptimized
                />
              </div>
              <figure className="v2-testimonials-card">
                <blockquote className="v2-testimonials-quote">
                  {t.v2.testimonials[`${item.itemKey}Quote` as const]}
                </blockquote>
                <figcaption className="v2-testimonials-attr">
                  <span className="v2-testimonials-name">
                    {t.v2.testimonials[`${item.itemKey}Name` as const]}
                  </span>
                  <span className="v2-testimonials-role">
                    {t.v2.testimonials[`${item.itemKey}Role` as const]}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* Codepet signup CTA — pixel-pill matching the section
            chain. Purple-on-pink so it sits cleanly against the
            testimonials band. Points to #product where the email
            form lives. Sits at the bottom of the section, after
            the three quote cards. */}
        <a
          href="#product"
          className="v2-testimonials-cta"
          aria-label={t.v2.testimonials.ctaAria}
        >
          <span className="v2-testimonials-cta-body">{t.v2.testimonials.cta}</span>
        </a>
      </div>
    </section>
  )
}
