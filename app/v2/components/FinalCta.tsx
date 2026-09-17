'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * Final CTA — Section 9 of the /v2 landing.
 *
 * Promo strip that redirects visitors to the Codepet Academy
 * course site. Replaces the previous duplicate waitlist form —
 * the Product section's email signup remains the only spot on
 * this page where someone joins the list, and the existing
 * `#waitlist` anchors throughout the page now scroll to that
 * Product section instead (see Nav / Hero / Mindset / GetGood).
 *
 * Layout (matches the Framer "Slide In Top" preset):
 *   - Eyebrow / title (white text on purple band)
 *   - Subtitle / description (lighter weight)
 *   - Single pixel-pill CTA → codepet-academy.vercel.app
 *
 * Scroll-linked reveal is unchanged from the previous waitlist
 * version — same `--scroll-progress` driver that the heading
 * and subtitle map to opacity + translateY(-150→0).
 */
export default function FinalCta() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement | null>(null)

  // Scroll-linked reveal — same pattern as SkillTrees / Testimonials,
  // but the Final CTA's Framer preset is "Slide In Top": elements
  // enter FROM ABOVE (Offset Y: -150), not from below. CSS handles
  // the direction via a dedicated `.v2-finalcta-reveal` class that
  // maps --scroll-progress to opacity + translateY(-150 → 0).
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const targets = Array.from(
      section.querySelectorAll<HTMLElement>('.v2-finalcta-reveal')
    )
    if (targets.length === 0) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      for (const el of targets) el.style.setProperty('--scroll-progress', '1')
      return
    }

    let rafId: number | null = null

    const update = () => {
      rafId = null
      const vh = window.innerHeight
      // Entry ramp is 45% of the viewport — same pacing as the other
      // scroll-linked sections. Exit ramp is tighter (25%) and gated
      // so it only activates once the element's top has scrolled
      // past the viewport top (rect.top < 0), preventing a 70%-
      // opacity stuck state on snap-aligned sections.
      const entryRamp = vh * 0.45
      const exitRamp = vh * 0.25
      for (const el of targets) {
        const rect = el.getBoundingClientRect()
        const entry = Math.max(0, Math.min(1, (vh - rect.top) / entryRamp))
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
    <section id="final-cta" ref={sectionRef} className="v2-finalcta">
      {/* Title + subtitle each render as ONE line on desktop and
          TWO lines on mobile via the `.v2-finalcta-mobile-break`
          span — the wrapping span gets `display: block` only
          inside the mobile media query (see fonts.css). */}
      <h2 className="v2-finalcta-title v2-finalcta-reveal">
        {t.v2.finalCta.titleLine1}{' '}
        <span className="v2-finalcta-mobile-break">{t.v2.finalCta.titleLine2}</span>
      </h2>
      <p className="v2-finalcta-subtitle v2-finalcta-reveal">
        {t.v2.finalCta.subtitleLine1}{' '}
        <span className="v2-finalcta-mobile-break">{t.v2.finalCta.subtitleLine2}</span>
      </p>

      {/* Pixel-pill CTA — same submit-style classes as the old
          waitlist button so the visual silhouette / hover state
          is identical. Now an in-app link to /academy (proxied
          to the separate codepet-academy deployment via the
          rewrite in next.config.ts) so users stay on code-pet.com
          throughout the journey. */}
      <a
        className="v2-finalcta-submit v2-finalcta-reveal"
        href="/academy"
      >
        {t.v2.finalCta.academyButton}
      </a>
    </section>
  )
}
