'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { ENVIRONMENT } from '../content'

/**
 * Environment — Codepet's guided Claude Code setup. The "recommended setup"
 * panel wires itself up when it scrolls into view: rows slide in staggered,
 * the four toggles flip ON one-by-one with a click-pulse, and a sheen sweeps
 * the glass. Reduced-motion: arrives fully on, no sequence.
 */
export default function Environment() {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-live')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-live')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="environment" className="v3-section">
      <div className="v3-env-grid">
        <Reveal>
          <div>
            <p className="v3-eyebrow">{ENVIRONMENT.eyebrow}</p>
            <h2 className="v3-h2">
              <SplitText text={ENVIRONMENT.headlineLead} className="v3-lead" />{' '}
              <SplitText text={ENVIRONMENT.headlineAccent} className="it" />
            </h2>
            <p className="v3-sub">{ENVIRONMENT.sub}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="v3-env-panel" ref={panelRef}>
            <span className="v3-env-aura" aria-hidden="true" />
            <div className="v3-env-panel-title">
              <span className="v3-env-live" aria-hidden="true" />
              {ENVIRONMENT.panelTitle}
            </div>
            <div className="v3-env-rows">
              {ENVIRONMENT.items.map((it, i) => (
                <div
                  key={it.name}
                  className="v3-env-row"
                  style={{ ['--ri']: i, ['--c']: it.color } as CSSProperties}
                >
                  <span className="v3-env-node" aria-hidden="true" />
                  <div className="v3-env-text">
                    <div className="v3-env-name">{it.name}</div>
                    <div className="v3-env-desc">{it.desc}</div>
                  </div>
                  <span className="v3-env-toggle" aria-hidden="true"><span /></span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
