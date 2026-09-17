'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * Get Good / Code.Grow.Learn — Section 6.
 *
 * Black band matching the Framer "GET GOOD" comp:
 *   - Corner eyebrow "■ GET GOOD" at top-left (Minecraft pixel caps)
 *   - Centered display headline "CODE.GROW.LEARN"
 *   - 4-card grid of learning-loop icons
 *   - Body paragraph explaining the 4-tier skill map
 *   - White-pill "Join the waitlist" CTA
 *
 * Icons are drawn from the existing /sprites-svg/ui/ library
 * (copied into /public/v2/get-good/ so Next.js can serve them)
 * with one exception: the "Your Companion" tile reuses the
 * purple Byte from the hero pet set. Any icon can be swapped by
 * editing the `cards` array — the CSS grid auto-flows.
 *
 * The nav "Get Good" link points to this section's id=`get-good`.
 */
// Card icons stay constant; labels come from t.v2.getGood at render
// time. labelKey indexes into the namespace so we can localize without
// duplicating an English-only label here.
const cards = [
  { icon: '/v2/get-good/icon-skill-map.png',        labelKey: 'cardSkillMap' as const },
  { icon: '/v2/get-good/icon-your-companion.svg',   labelKey: 'cardYourCompanion' as const },
  { icon: '/v2/get-good/icon-real-practice.png',    labelKey: 'cardRealPractice' as const },
  { icon: '/v2/get-good/icon-honest-insights.png',  labelKey: 'cardHonestInsights' as const },
] as const

export default function GetGood() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement | null>(null)
  // IntersectionObserver fires once when ~15% of the section is in
  // view, adding `.is-in-view` to the root. CSS handles the stagger
  // via per-element transition-delay (0s / 0.1s / 0.2s / 0.3s for
  // the four cards, matching the Framer inspector values).
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // rootMargin shrinks the bottom of the viewport by 35% so the
    // section is only considered "in view" once its top has moved
    // up past 65% of the viewport — i.e. the user has actually
    // scrolled to where the headline / cards are, not when the
    // very top edge is just peeking in from below. This stops the
    // entrance animations from firing prematurely while the user
    // is still on the previous section.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setInView(true)
          else setInView(false)
        }
      },
      {
        rootMargin: '0px 0px -35% 0px',
        threshold: 0,
      }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="get-good"
      ref={sectionRef}
      className={`v2-getgood${inView ? ' is-in-view' : ''}`}
    >
      <span className="v2-corner-label v2-corner-label--tl">
        {t.v2.getGood.cornerLabel}
      </span>

      <div className="v2-getgood-inner">
        <h2 className="v2-getgood-headline">{t.v2.getGood.headline}</h2>

        <div className="v2-getgood-cards">
          {cards.map((card) => (
            <div key={card.labelKey} className="v2-getgood-card">
              <div className="v2-getgood-card-icon">
                <Image
                  src={card.icon}
                  alt=""
                  width={220}
                  height={220}
                  unoptimized
                  aria-hidden="true"
                />
              </div>
              <p className="v2-getgood-card-label">
                {t.v2.getGood[card.labelKey]}
              </p>
            </div>
          ))}
        </div>

        <p className="v2-getgood-body">{t.v2.getGood.body}</p>

        {/* Pixel-art pill CTA — same two-layer pattern as Product
            and Mindset buttons. Outer <a> owns the drop-shadow
            outline, inner <span> owns the clip-path silhouette and
            the blue body fill. */}
        <a
          href="#product"
          className="v2-getgood-cta"
          aria-label={t.v2.getGood.ctaAria}
        >
          <span className="v2-getgood-cta-body">{t.v2.getGood.cta}</span>
        </a>
      </div>
    </section>
  )
}
