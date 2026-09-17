'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { JOURNEY } from '../content'

/**
 * Journey — a curved horizontal roadmap you travel by scrolling. The
 * section pins; each stage gets one "beat" of scroll during which a curved
 * line sweeps left→right and fills the ENTIRE screen, a glowing dot rides
 * the curve edge to edge, and that stage's (large) title is shown. Reaching
 * the next beat swaps the title and the line sweeps again. Below 820px /
 * reduced-motion it falls back to a plain vertical list.
 */
const CURVE = 'M0,150 C200,80 420,80 600,150 C780,220 1000,220 1200,150'
const VBW = 1200
const VBH = 300

export default function Journey() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const drawRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const draw = drawRef.current
    const svg = svgRef.current
    const dot = dotRef.current
    if (!wrap || !draw || !svg || !dot) return
    const stages = Array.from(wrap.querySelectorAll<HTMLElement>('.v3-hroad-stage'))
    const n = stages.length

    const place = (fill: number) => {
      const L = draw.getTotalLength()
      const pt = draw.getPointAtLength(fill * L)
      const box = svg.getBoundingClientRect()
      dot.style.left = `${((pt.x / VBW) * box.width).toFixed(1)}px`
      dot.style.top = `${((pt.y / VBH) * box.height).toFixed(1)}px`
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.classList.remove('is-pinned')
      stages.forEach((s) => s.classList.add('is-active'))
      return
    }

    let active = false
    let raf = 0

    const update = () => {
      if (!active) return
      const top = wrap.getBoundingClientRect().top + window.scrollY
      const dist = wrap.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / Math.max(1, dist)))
      const pos = p * n
      const idx = Math.min(n - 1, Math.floor(pos))
      const fill = p >= 1 ? 1 : Math.min(1, pos - idx)
      wrap.style.setProperty('--fill', fill.toFixed(4))
      place(fill)
      stages.forEach((s, i) => s.classList.toggle('is-active', i === idx))
    }

    const measure = () => {
      active = true // curved roadmap pinned on mobile too (transform/SVG only)
      wrap.classList.toggle('is-pinned', active)
      if (active) {
        wrap.style.height = `${n * window.innerHeight}px`
        update()
      } else {
        wrap.style.height = ''
        stages.forEach((s) => s.classList.add('is-active'))
      }
    }

    const onScroll = () => {
      if (!active) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="journey" className="v3-section v3-no-skew">
      <Reveal>
        <p className="v3-eyebrow">{JOURNEY.eyebrow}</p>
        <h2 className="v3-h2">
          <SplitText text={JOURNEY.headlineLead} className="v3-lead" />{' '}
          <SplitText text={JOURNEY.headlineAccent} className="it" />
        </h2>
        <p className="v3-sub">{JOURNEY.sub}</p>
      </Reveal>

      <div className="v3-hroad" ref={wrapRef}>
        <div className="v3-hroad-sticky">
          <div className="v3-hroad-lineband">
            <svg
              className="v3-hroad-svg"
              ref={svgRef}
              viewBox={`0 0 ${VBW} ${VBH}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="v3-hroad-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <path className="v3-hroad-track" d={CURVE} />
              <path className="v3-hroad-draw" ref={drawRef} d={CURVE} pathLength={1} />
            </svg>
            <span className="v3-hroad-dot" ref={dotRef} aria-hidden="true" />
          </div>

          <div className="v3-hroad-labels">
            {JOURNEY.phases.map((ph, i) => (
              <div
                key={ph.key}
                className={`v3-hroad-stage${i === 0 ? ' is-active' : ''}`}
              >
                <span className="v3-rm-idx">0{i + 1}</span>
                <h3 className="v3-hroad-title">{ph.label}</h3>
                <p className="v3-hroad-note">{ph.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
