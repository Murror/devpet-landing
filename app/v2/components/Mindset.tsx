'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * Mindset — Section 5 of the /v2 landing.
 *
 * Composition:
 *   - Purple (#9538CF) background band
 *   - 4 pixel-art orbs in the four corners as decorative anchors
 *   - Centered text column: "Codepet" eyebrow → 3-line all-caps
 *     headline → pixel-art green pill CTA
 *
 * ─── Scroll-linked parallax (inkgames.com reference) ──────────
 * The four orbs drift outward from the text at different speeds
 * as the reader scrolls through the section. Approaching from
 * below, the corner orbs sit *closer* to the headline; as the
 * section scrolls past, they drift *further out*, so the whole
 * composition reads as a floating photo-collage.
 *
 * Driven by one rAF-throttled scroll listener that writes a
 * normalised progress value --p to the section root:
 *     --p = -1  → section entering from below
 *     --p =  0  → section centred in the viewport
 *     --p =  1  → section has scrolled past above
 * Each orb multiplies --p by its own per-slot speed/direction
 * variables (--spd-x, --spd-y) in CSS, so JS stays trivial and
 * each orb can be tuned independently.
 */

// New icon set (user-supplied PNGs in public/v2/orbs/). Same class
// structure as before, so the parallax effect carries over without
// any CSS changes.
const orbs = [
  { src: '/v2/orbs/orb-pink-heart.png',   className: 'v2-mindset-orb v2-mindset-orb--tl', alt: '' },
  { src: '/v2/orbs/orb-blue-diamond.png', className: 'v2-mindset-orb v2-mindset-orb--tr', alt: '' },
  { src: '/v2/orbs/orb-green-gem.png',    className: 'v2-mindset-orb v2-mindset-orb--bl', alt: '' },
  { src: '/v2/orbs/orb-gold-egg.png',     className: 'v2-mindset-orb v2-mindset-orb--br', alt: '' },
] as const

export default function Mindset() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let ticking = false

    // Parallax — continuous scroll-linked drift for the 4 orbs AND
    // a separate "enter progress" variable used by the text block so
    // its slide-down reveal happens gradually with scroll rather than
    // snapping in all at once when the section first appears.
    const update = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || 1

      // --p: signed progress for orb parallax (-1..0..1)
      const sectionCentre = rect.top + rect.height / 2
      const viewportCentre = vh / 2
      const raw = (sectionCentre - viewportCentre) / (vh / 2 + rect.height / 2)
      const clamped = Math.max(-1, Math.min(1, raw))
      section.style.setProperty('--p', clamped.toFixed(4))

      // --enter-p: unsigned progress (0..1) for the text reveal.
      // 0 when the section's top is at the bottom of the viewport,
      // 1 once the section's top has risen to ~40% from the viewport
      // bottom. Stretching the curve over ~60% of a viewport of scroll
      // makes the slide feel deliberate rather than abrupt.
      const enterRaw = (vh - rect.top) / (vh * 0.6)
      const enterClamped = Math.max(0, Math.min(1, enterRaw))
      section.style.setProperty('--enter-p', enterClamped.toFixed(4))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="mindset" ref={sectionRef} className="v2-mindset">
      {orbs.map((orb) => (
        <Image
          key={orb.src}
          src={orb.src}
          alt={orb.alt}
          width={240}
          height={240}
          className={orb.className}
          unoptimized
          aria-hidden="true"
        />
      ))}

      <div className="v2-mindset-inner">
        <p className="v2-mindset-eyebrow">{t.v2.mindset.eyebrow}</p>

        <h2 className="v2-mindset-headline">
          <span className="line">{t.v2.mindset.titleLine1}</span>
          <span className="line">{t.v2.mindset.titleLine2}</span>
          <span className="line">{t.v2.mindset.titleLine3}</span>
        </h2>

        {/* Pixel-art pill CTA — same two-layer pattern as the
            product form button. Outer <a> owns the drop-shadow
            outline, inner <span> owns the clip-path silhouette and
            the green body fill. Splitting the layers sidesteps the
            Chrome quirk where `filter` on a clipped element gets
            cropped by the clip-path. */}
        <a
          href="#product"
          className="v2-mindset-cta"
          aria-label={t.v2.mindset.ctaAria}
        >
          <span className="v2-mindset-cta-body">{t.v2.mindset.cta}</span>
        </a>
      </div>
    </section>
  )
}
