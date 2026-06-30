'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { JOURNEY } from '../content'

/**
 * Journey — the roadmap as a scroll-scrubbed luminous path. As the section
 * passes through the viewport a gradient energy beam fills left→right, led
 * by a glowing comet; each phase "unlocks" as the beam reaches it (the node
 * pops with a ring pulse and its label brightens) — matching the copy,
 * "one unlocked step at a time." Progress is bound to scroll, not a one-shot
 * reveal. Reduced-motion: everything lit, no scrubbing.
 */
export default function Journey() {
  const pathRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const phases = Array.from(path.querySelectorAll<HTMLElement>('.v3-phase'))
    const n = phases.length

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.style.setProperty('--p', '1')
      phases.forEach((el) => el.classList.add('is-on'))
      return
    }

    let raf = 0
    const update = () => {
      const rect = path.getBoundingClientRect()
      // Spread the fill over a wide scroll range so the beam tracks the
      // scroll closely (gradual) instead of completing in a short burst.
      const start = window.innerHeight * 1.0 //  path enters the bottom → progress 0
      const end = window.innerHeight * 0.22 //   path nears the top    → progress 1
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      path.style.setProperty('--p', p.toFixed(4))
      const reached = p * (n - 1)
      phases.forEach((el, i) => el.classList.toggle('is-on', reached >= i - 0.35))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="journey" className="v3-section">
      <Reveal>
        <p className="v3-eyebrow">{JOURNEY.eyebrow}</p>
        <h2 className="v3-h2">
          <SplitText text={JOURNEY.headlineLead} className="v3-lead" />{' '}
          <SplitText text={JOURNEY.headlineAccent} className="it" />
        </h2>
        <p className="v3-sub">{JOURNEY.sub}</p>
      </Reveal>

      <div className="v3-journey-path" ref={pathRef}>
        <div className="v3-journey-rail" aria-hidden="true">
          <span className="v3-journey-beam" />
          <span className="v3-journey-comet" />
          <img className="v3-pet v3-pet--journey" src="/v2/pets/4-purple-byte.png" alt="" aria-hidden="true" />
        </div>
        {JOURNEY.phases.map((p, i) => (
          <div key={p.key} className="v3-phase" style={{ ['--i']: i } as CSSProperties}>
            <div className="v3-phase-dot"><i /></div>
            <h3 className="v3-phase-label">{p.label}</h3>
            <p className="v3-phase-note">{p.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
