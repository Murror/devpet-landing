'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * Skill Trees — Section 7 of the /v2 landing.
 *
 * Yellow (#FCBE1C) band with "SKILL TREE ■" corner label (top-right),
 * a two-tone intro paragraph, and 4 tier cards laid out in a
 * zigzag cascade (red → green → purple → blue).
 *
 * The stagger is pure CSS grid — each card is assigned an explicit
 * grid-column/grid-row via a modifier class (see fonts.css). The
 * component itself just renders the data array in order, so adding
 * a 5th tier means adding one entry + one CSS rule.
 *
 * Scroll-triggered enter animation matches the Framer Scroll
 * Animation panel:
 *   • Trigger: Section in View (threshold 0.15)
 *   • Preset: Slide In Bottom — Opacity 0, Offset Y +150, Transition Spring
 *   • Transition: stiffness 200, damping 35, mass 1 (overdamped
 *     spring — approximated in CSS by an ease-out curve with no
 *     overshoot)
 *   • Staggered delays per card: 0s / 0.1s / 0.2s / 0.3s
 * An IntersectionObserver toggles `.is-in-view` on the section;
 * CSS handles the delay cascade via nth-child on the modifier
 * classes (see fonts.css).
 *
 * Tier copy is copied verbatim from the Framer editor panels.
 * Card fills match the Framer Fill values exactly: #E24B4A,
 * #029902, #9538CF, #1C40CF.
 */
// Tier titles + bodies live in t.v2.skillTrees and are looked up by
// the per-tier `tierKey`. Numeric labels (1..4) and modifier classes
// stay constant.
const tiers = [
  { num: 1, tierKey: 'tier1' as const, modifier: 'v2-skilltrees-card--1' },
  { num: 2, tierKey: 'tier2' as const, modifier: 'v2-skilltrees-card--2' },
  { num: 3, tierKey: 'tier3' as const, modifier: 'v2-skilltrees-card--3' },
  { num: 4, tierKey: 'tier4' as const, modifier: 'v2-skilltrees-card--4' },
] as const

/**
 * Decorative pixel-art orbs that sit in the "empty" grid cell
 * opposite each card (zigzag counterpoint). One orb per tier row.
 * Modifier classes (`--1..--4`) pin each orb into the correct grid
 * cell via .v2-skilltrees-orb--N rules in fonts.css.
 *
 * Currently using the Frame 27–30 PNGs added to /public/v2/orbs/.
 * Mapping assumes: 27=orange, 28=pink, 29=purple, 30=blue (the
 * order they were uploaded to chat). Placement mirrors the Framer
 * demo — orb color contrasts with its adjacent card color:
 *   • card 1 red    → blue orb   (Frame 30)
 *   • card 2 green  → pink orb   (Frame 28)
 *   • card 3 purple → orange orb (Frame 27)
 *   • card 4 blue   → purple orb (Frame 29)
 * If any mapping is off, swap `src` values around — the modifier
 * class controls position, not color.
 */
const orbs = [
  {
    src: '/v2/orbs/Frame%2030.png',
    alt: '',
    modifier: 'v2-skilltrees-orb--1',
  },
  {
    src: '/v2/orbs/Frame%2028.png',
    alt: '',
    modifier: 'v2-skilltrees-orb--2',
  },
  {
    src: '/v2/orbs/Frame%2027%20(1).png',
    alt: '',
    modifier: 'v2-skilltrees-orb--3',
  },
  {
    src: '/v2/orbs/Frame%2029.png',
    alt: '',
    modifier: 'v2-skilltrees-orb--4',
  },
] as const

export default function SkillTrees() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement | null>(null)

  // Per-element IntersectionObserver-driven reveal.
  //
  // Previous implementation read getBoundingClientRect for every
  // .v2-skilltrees-reveal target on every scroll frame and wrote
  // a --scroll-progress CSS variable per element, which the CSS
  // then mapped to opacity + transform. The per-frame layout reads
  // + style writes were the source of the up/down scroll stutter
  // the user reported.
  //
  // New approach: each target element gets its own IntersectionObserver
  // entry. When the element crosses into view (gated by rootMargin
  // so it has to be meaningfully on-screen, not just peeking in
  // from below), we add `.is-revealed` and the CSS handles the
  // transition. The browser owns the timing — no scroll listener,
  // no per-frame work, no stutter on reverse scroll.
  //
  // Trade-off: the reveal no longer reverses when scrolling back
  // up. Once a card is revealed, it stays revealed. This matches
  // every other section on the site that uses class-toggle reveals
  // (Hero entrance, Get Good cards) and is the right call for
  // mobile perf — scroll-scrubbed animations were always going to
  // be expensive to keep smooth on phone hardware.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const targets = Array.from(
      section.querySelectorAll<HTMLElement>('.v2-skilltrees-reveal')
    )
    if (targets.length === 0) return

    // Respect reduced-motion users — show everything immediately.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      for (const el of targets) el.classList.add('is-revealed')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            // Once revealed, stop observing this element — no
            // need to keep paying the IntersectionObserver tax
            // for elements that are already done animating.
            observer.unobserve(entry.target)
          }
        }
      },
      {
        // Element only triggers when its top has scrolled into the
        // upper 75% of the viewport — same threshold feel as the
        // old scroll-driven version's 25% trigger offset, just
        // expressed via rootMargin instead of a per-frame check.
        rootMargin: '0px 0px -25% 0px',
        threshold: 0,
      }
    )

    for (const el of targets) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skill-trees"
      ref={sectionRef}
      className="v2-skilltrees"
    >
      <span className="v2-corner-label v2-corner-label--tl">
        {t.v2.skillTrees.cornerLabel}
      </span>

      <p className="v2-skilltrees-intro">
        {t.v2.skillTrees.introLead}
        <br />
        <span className="muted">{t.v2.skillTrees.introMuted}</span>
      </p>

      <div className="v2-skilltrees-cards">
        {tiers.map((tier) => (
          <article
            key={tier.num}
            className={`v2-skilltrees-card ${tier.modifier}`}
          >
            <span className="v2-skilltrees-card-number" aria-hidden="true">
              {tier.num}
            </span>
            <h3 className="v2-skilltrees-card-title">
              {t.v2.skillTrees[`${tier.tierKey}Title` as const]}
            </h3>
            <p className="v2-skilltrees-card-body">
              {t.v2.skillTrees[`${tier.tierKey}Body` as const]}
            </p>
          </article>
        ))}

        {/* Decorative orbs — each sits in the empty grid cell
            opposite its tier card, mirroring the Framer comp's
            zigzag balance. aria-hidden because they're pure
            flourish; screen readers can skip. */}
        {orbs.map((orb) => (
          <div
            key={orb.modifier}
            className={`v2-skilltrees-orb ${orb.modifier}`}
            aria-hidden="true"
          >
            <Image
              src={orb.src}
              alt={orb.alt}
              width={240}
              height={240}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Codepet signup CTA — pixel-pill matching the Mindset /
          Get Good pattern, but red-on-yellow to read against the
          SkillTrees band. Points to #product (the only place on
          this page that captures emails); FinalCta no longer
          carries a form. */}
      {/* Intentionally NOT given the `v2-skilltrees-reveal` class.
          The reveal IntersectionObserver only picks up elements
          present at mount; even when this CTA was in the list,
          the observer's `is-revealed` toggle wasn't sticking and
          left it stuck at opacity 0. The button sits below the
          already-animated tier cards, so showing it without its
          own slide-in is the simplest fix and reads fine. */}
      <a
        href="#product"
        className="v2-skilltrees-cta"
        aria-label={t.v2.skillTrees.ctaAria}
      >
        <span className="v2-skilltrees-cta-body">{t.v2.skillTrees.cta}</span>
      </a>
    </section>
  )
}
