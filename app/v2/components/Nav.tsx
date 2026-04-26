'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/**
 * Top nav for /v2 landing.
 *
 * Layout (per "pixels" reference):
 *   [ Nav links — LEFT ] [ Codepet wordmark — CENTER, enlarged ] [ CTA — RIGHT ]
 *
 * ─── Scroll behaviour (Headroom pattern) ──────────────────────
 * Sticky at the top with a solid blue background. While the
 * reader scrolls DOWN past the nav's own height the bar slides
 * up out of view (`transform: translateY(-100%)`); on UP it
 * slides back. Near the top of the page (scrollY ≤ NAV_HEIGHT)
 * the nav is always shown so the hero opens with it in place.
 *
 * The scroll listener is rAF-throttled and ignores deltas under
 * a small threshold so micro-jitter from trackpads doesn't
 * flicker the bar.
 *
 * ─── Appear effect (on mount) ─────────────────────────────────
 * Framer spec: Enter { opacity: 0, y: -150 }, Spring physics
 * stiffness 150 / damping 25 / mass 1 → ζ ≈ 1.02, critically
 * damped, mapped to a 0.6s ease-out cubic-bezier. Staggered per
 * child (see v2-nav-drop-in keyframes in fonts.css).
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // When the user clicks an in-page nav link the browser kicks off a
  // programmatic scroll that fires the same scroll events as a user
  // dragging the wheel — which the Headroom logic below would interpret
  // as "scrolling down, hide the bar." That flicker leaves the reader
  // landing at the target section with the nav slid off-screen and a
  // ~140px empty gap (the scroll-margin-top clearance) at the top of
  // the viewport. We park a timestamp on this ref when a nav click
  // happens; while it's still in the future, the scroll handler skips
  // the hide branch and pins the nav visible. Cleared automatically
  // after the smooth-scroll settles. */
  const suppressHideUntilRef = useRef(0)

  useEffect(() => {
    let lastY = typeof window === 'undefined' ? 0 : window.scrollY
    let ticking = false
    const THRESHOLD = 8            // px of scroll needed to flip state
    const NAV_HEIGHT = 104         // approx bar height (32 + 40 + 32 padding)

    const update = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY

      // While a nav click is still smooth-scrolling the page, force
      // the bar to stay visible regardless of scroll direction.
      if (Date.now() < suppressHideUntilRef.current) {
        setHidden(false)
        lastY = currentY
        setScrolled(currentY > window.innerHeight * 0.4)
        return
      }

      // Headroom hide/show
      if (currentY <= NAV_HEIGHT) {
        setHidden(false)
        lastY = currentY
      } else if (delta > THRESHOLD) {
        setHidden(true)
        lastY = currentY
      } else if (delta < -THRESHOLD) {
        setHidden(false)
        lastY = currentY
      }

      // CTA fade trigger: hide the "Start Your Journey" pill as
      // soon as the reader has scrolled meaningfully past the
      // fold. We compare raw scrollY against 40% of the viewport —
      // reliable in every browser and independent of hydration
      // ordering or section rects. Every section below the hero
      // has its own waitlist CTA, so the nav one becomes redundant.
      setScrolled(currentY > window.innerHeight * 0.4)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    update() // initial sync on mount

    window.addEventListener('scroll', onScroll, { passive: true })
    // Also listen on document and body to cover any browser quirk
    // where scroll events fire on those instead of window.
    document.addEventListener('scroll', onScroll, { passive: true })

    // Belt-and-braces: IntersectionObserver on the hero.
    // When the hero is <50% in view, the reader is clearly past it.
    // Some setups miss a scroll event; this catches them.
    const hero = document.getElementById('hero')
    let observer: IntersectionObserver | null = null
    if (hero && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.intersectionRatio < 0.5) {
              setScrolled(true)
            } else if (window.scrollY <= window.innerHeight * 0.4) {
              setScrolled(false)
            }
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      )
      observer.observe(hero)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  // Pin the nav visible across the smooth-scroll triggered by an
  // in-nav anchor click. 1.2s covers the longest snap distance
  // comfortably without leaving the bar pinned for a noticeable
  // window after the user starts manually scrolling again.
  const handleAnchorClick = () => {
    suppressHideUntilRef.current = Date.now() + 1200
    setHidden(false)
  }

  return (
    <nav
      className={`v2-nav${scrolled ? ' v2-nav--scrolled' : ''}${hidden ? ' v2-nav--hidden' : ''}`}
      aria-label="Primary"
    >
      <div className="v2-nav-inner v2-nav-inner--enter">
        {/* LEFT — section links. Hover: thin rectangular outline
            fades in around each label via ::after pseudo-element. */}
        <ul className="v2-nav-links">
          <li>
            <a href="#product" className="v2-nav-link" onClick={handleAnchorClick}>Product</a>
          </li>
          <li>
            <a href="#get-good" className="v2-nav-link" onClick={handleAnchorClick}>Get Good</a>
          </li>
          <li>
            <a href="#skill-trees" className="v2-nav-link" onClick={handleAnchorClick}>Skill Tree</a>
          </li>
        </ul>

        {/* CENTER — Codepet wordmark, scaled up so it reads as the
            primary mark of the bar. */}
        <a href="#top" className="v2-nav-wordmark" aria-label="Codepet home" onClick={handleAnchorClick}>
          <Image
            src="/v2/codepet-wordmark.png"
            alt="Codepet"
            width={1215}
            height={240}
            priority
            unoptimized
          />
        </a>

        {/* RIGHT — persistent CTA anchors to the waitlist form.
            Two-layer pixel-art button:
              - outer <a>   : applies the black outer outline via
                              four zero-blur drop-shadows
              - inner <span>: carries the clip-path, body fill,
                              and inset highlight/shadow bevel
            Splitting the layers sidesteps the Chrome quirk where
            `filter` on the same element as `clip-path` gets
            cropped by that clip-path.

            Conditionally rendered — the entrance animation's
            `animation-fill-mode: both` kept pinning opacity:1 on
            this element, which beat every CSS-cascade attempt to
            fade it out. Yanking the node from the DOM when the
            reader is past the fold is the only fully reliable fix.
            An invisible placeholder keeps the grid's right column
            occupied so the wordmark stays visually centered. */}
        {scrolled ? (
          <span className="v2-nav-cta-placeholder" aria-hidden="true" />
        ) : (
          <a href="#waitlist" className="v2-nav-cta" onClick={handleAnchorClick}>
            <span className="v2-nav-cta-body">Start Your Journey</span>
          </a>
        )}
      </div>
    </nav>
  )
}
