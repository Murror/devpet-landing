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
