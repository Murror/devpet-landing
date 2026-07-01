'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { JOURNEY } from '../content'

/**
 * Journey — the roadmap as a flowing line that draws itself on scroll.
 * A wavy vertical ribbon (SVG, with faint parallel echo strands) draws
 * from top→bottom as the section scrolls; each phase rides a bend of the
 * curve and unlocks in sequence (slides in, its node lights) the moment
 * the draw reaches it. Reduced-motion: fully drawn, all revealed.
 *
 * The curve threads the node points (viewBox 300×1500): x alternates
 * 110/190 around centre 150, so nodes sit at 50% ∓ 13.33% — matched by
 * the HTML nodes' `--nx` offset so line and dots align at any width.
 */
const WAVE =
  'M150,0 C150,80 110,70 110,150 C110,320 190,280 190,450 C190,620 110,580 110,750 C110,920 190,880 190,1050 C190,1220 110,1180 110,1350 C110,1430 150,1420 150,1500'

export default function Journey() {
  const roadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const road = roadRef.current
    if (!road) return
    const steps = Array.from(road.querySelectorAll<HTMLElement>('.v3-rm-step'))
    const n = steps.length

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      road.style.setProperty('--p', '1')
      steps.forEach((s) => s.classList.add('is-on'))
      return
    }

    let raf = 0
    const update = () => {
      const rect = road.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.8
      const p = Math.min(1, Math.max(0, (start - rect.top) / (rect.height * 0.8)))
      road.style.setProperty('--p', p.toFixed(4))
      steps.forEach((s, i) => s.classList.toggle('is-on', p >= (i + 0.5) / n))
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

      <div
        className="v3-roadmap"
        ref={roadRef}
        style={{ ['--rows']: JOURNEY.phases.length } as CSSProperties}
      >
        <svg className="v3-roadmap-svg" viewBox="0 0 300 1500" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="v3-rm-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <path className="v3-rm-echo" d={WAVE} transform="translate(9 0)" />
          <path className="v3-rm-echo" d={WAVE} transform="translate(18 0)" />
          <path className="v3-rm-echo" d={WAVE} transform="translate(-8 0)" />
          <path className="v3-rm-track" d={WAVE} />
          <path className="v3-rm-draw" d={WAVE} pathLength={1} />
        </svg>

        {JOURNEY.phases.map((ph, i) => {
          const nx = i % 2 === 0 ? '-13.33%' : '13.33%'
          const side = i % 2 === 0 ? 'right' : 'left'
          return (
            <div
              key={ph.key}
              className="v3-rm-step"
              data-side={side}
              style={{ ['--i']: i, ['--nx']: nx } as CSSProperties}
            >
              <div className="v3-rm-card">
                <span className="v3-rm-idx">0{i + 1}</span>
                <h3 className="v3-rm-label">{ph.label}</h3>
                <p className="v3-rm-note">{ph.note}</p>
              </div>
              <span className="v3-rm-node" />
            </div>
          )
        })}
      </div>
    </section>
  )
}
