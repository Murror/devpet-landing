'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

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
const tiers = [
  {
    num: 1,
    title: 'Foundations',
    body:
      "Every builder starts here. You'll learn to ask AI for what you " +
      "actually want, read errors without panic, find your way around " +
      "your editor, and start spotting sharp code from sloppy — one " +
      "small win at a time.",
    modifier: 'v2-skilltrees-card--1',
  },
  {
    num: 2,
    title: 'Context & Structure',
    body:
      "Now you're feeding AI the right fuel. Set up context that sticks, " +
      "write rules files your pet actually follows, document as you " +
      "build, and lay out projects that scale instead of collapsing on you.",
    modifier: 'v2-skilltrees-card--2',
  },
  {
    num: 3,
    title: 'Develop',
    body:
      "This is where your reps start paying off. Move fluently between " +
      "Cursor, Claude Code, and VS Code, keep scope from sprawling, " +
      "reuse a design system instead of redrawing it, and iterate on " +
      "prompts until they sing.",
    modifier: 'v2-skilltrees-card--3',
  },
  {
    num: 4,
    title: 'Expert',
    body:
      "The tier you earn. Think in user personas, stretch context " +
      "windows without losing the plot, architect AI into your product, " +
      "and build a second brain that compounds every project you ship.",
    modifier: 'v2-skilltrees-card--4',
  },
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
  const sectionRef = useRef<HTMLElement | null>(null)

  // Scroll-linked reveal — each card's opacity + translateY are tied
  // directly to how far it has scrolled through the viewport, so the
  // cards appear/disappear continuously as the user scrolls (not a
  // one-shot trigger).
  //
  // For each card on every scroll frame we compute a progress value
  // in [0, 1]:
  //   • 0 while the card is fully below the viewport (hidden,
  //     shifted down by 150px)
  //   • ramps up as the card enters from the bottom, hitting 1 once
  //     its top has moved 25% into the viewport (fully visible, in
  //     place)
  //   • stays at 1 while the card is comfortably in view
  //   • ramps back down as the card exits off the top (bottom edge
  //     from 25% down → 0)
  //   • 0 once the card has scrolled fully above the viewport
  //
  // We write that number to a CSS custom property (--scroll-progress)
  // on the card so the CSS can drive opacity + transform off of it.
  // requestAnimationFrame coalesces scroll events so we never do
  // more work than one frame.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    // Every element we want scroll-linked shares the `.v2-skilltrees-reveal`
    // class. Today that's the intro paragraph + each of the 4 cards, but
    // anything marked reveal will pick up the same behavior.
    const targets = Array.from(
      section.querySelectorAll<HTMLElement>('.v2-skilltrees-reveal')
    )
    if (targets.length === 0) return

    // Respect users who've opted out of motion — skip the linking and
    // just show the content at its resting state.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      for (const el of targets) el.style.setProperty('--scroll-progress', '1')
      return
    }

    let rafId: number | null = null

    // Mobile gets a tighter entry ramp + a delayed trigger so each
    // card reveals as it actually scrolls into view, instead of all
    // four cards beginning to fade in simultaneously when the section
    // first enters the viewport (the wider 45% desktop ramp made
    // overlapping reveals at narrow heights).
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const update = () => {
      rafId = null
      const vh = window.innerHeight
      // Desktop: 45% ramp, no trigger threshold (legacy feel).
      // Mobile: 18% ramp + start at 25% inside viewport so elements
      // only begin animating once they're meaningfully on-screen.
      const entryRamp = vh * (isMobile ? 0.18 : 0.45)
      const triggerOffset = isMobile ? vh * 0.25 : 0
      const exitRamp = vh * 0.25
      for (const el of targets) {
        const rect = el.getBoundingClientRect()
        // (vh - triggerOffset) - rect.top: how far past the trigger
        // line the element's top is. Positive = entering / entered;
        // negative = still below the trigger line.
        const entry = Math.max(
          0,
          Math.min(1, ((vh - triggerOffset) - rect.top) / entryRamp)
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

    update() // initial paint — set values before first scroll
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
      id="skill-trees"
      ref={sectionRef}
      className="v2-skilltrees"
    >
      <span className="v2-corner-label v2-corner-label--tl">Skill Tree</span>

      <p className="v2-skilltrees-intro v2-skilltrees-reveal">
        A simple and efficient workflow to bring your vision to life.
        <br />
        <span className="muted">
          From the first call to final delivery, every step is designed for
          clarity and efficiency.
        </span>
      </p>

      <div className="v2-skilltrees-cards">
        {tiers.map((tier) => (
          <article
            key={tier.num}
            className={`v2-skilltrees-card v2-skilltrees-reveal ${tier.modifier}`}
          >
            <span className="v2-skilltrees-card-number" aria-hidden="true">
              {tier.num}
            </span>
            <h3 className="v2-skilltrees-card-title">{tier.title}</h3>
            <p className="v2-skilltrees-card-body">{tier.body}</p>
          </article>
        ))}

        {/* Decorative orbs — each sits in the empty grid cell
            opposite its tier card, mirroring the Framer comp's
            zigzag balance. aria-hidden because they're pure
            flourish; screen readers can skip. */}
        {orbs.map((orb) => (
          <div
            key={orb.modifier}
            className={`v2-skilltrees-orb v2-skilltrees-reveal ${orb.modifier}`}
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
    </section>
  )
}
