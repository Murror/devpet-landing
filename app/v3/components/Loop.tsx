'use client'

import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { LOOP } from '../content'

/**
 * Loop — Codepet's core promise as a self-running cycle:
 * Execute → Deliver → Approve. A glowing energy thread + travelling pulse
 * links the three frosted steps, a highlight cycles through them so the
 * loop visibly "runs", and the Execute card shows a live log typing itself
 * out (the product's plain-language log). Reduced-motion: static + lit.
 */
const LOG_LINES = [
  '› reading project files…',
  '› drafting the landing page…',
  '› writing 6 components…',
  '› running the build…',
  '✓ preview is ready for you',
]

export default function Loop() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % LOOP.steps.length),
      2100,
    )
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="loop" className="v3-section">
      <Reveal>
        <p className="v3-eyebrow">{LOOP.eyebrow}</p>
        <h2 className="v3-h2">
          <SplitText text={LOOP.headlineLead} className="v3-lead" />{' '}
          <SplitText text={LOOP.headlineAccent} className="it" />
        </h2>
        <p className="v3-sub">{LOOP.sub}</p>
      </Reveal>

      <div className="v3-loop-grid">
        <div className="v3-loop-thread" aria-hidden="true">
          <span className="v3-loop-pulse" />
        </div>
        {LOOP.steps.map((s, i) => (
          <Reveal key={s.key} delay={i * 150}>
            <div className={`v3-step v3-spot${active === i ? ' is-active' : ''}`}>
              <span className="v3-step-num">0{i + 1}</span>
              <h3 className="v3-step-label">{s.label}</h3>
              <p className="v3-step-desc">{s.desc}</p>
              {i === 0 && <LiveLog />}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/** A tiny terminal that types the log lines on a loop. */
function LiveLog() {
  const [text, setText] = useState('')
  const ref = useRef({ line: 0, ch: 0, hold: 0, t0: 0 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(LOG_LINES[LOG_LINES.length - 1])
      return
    }
    let raf = 0
    const st = ref.current
    const tick = (t: number) => {
      if (!st.t0) st.t0 = t
      const line = LOG_LINES[st.line % LOG_LINES.length]
      if (st.hold > 0) {
        if (t - st.t0 > st.hold) {
          st.hold = 0
          st.t0 = t
          st.ch = 0
          st.line = (st.line + 1) % LOG_LINES.length
          setText('')
        }
      } else if (t - st.t0 > 48) {
        st.t0 = t
        st.ch++
        setText(line.slice(0, st.ch))
        if (st.ch >= line.length) st.hold = 1400 // pause on the finished line
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="v3-step-log" aria-hidden="true">
      <span className="v3-step-log-text">{text}</span>
      <span className="v3-step-log-caret" />
    </div>
  )
}
