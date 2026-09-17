'use client'

import { useRef, type MouseEvent } from 'react'
import Constellation from './Constellation'
import HeroShader from './HeroShader'
import HeroCta from './HeroCta'
import { HERO } from '../content'

/**
 * Hero — the magical centrepiece. A near-black canvas where the
 * eight departments orbit a central glow (Constellation), an
 * elegant headline with a load mask-reveal, and a glass "app window"
 * that recreates the product's Company view from the real covers
 * (tilts toward the cursor in 3D).
 */
export default function Hero() {
  const winRef = useRef<HTMLDivElement>(null)

  function onWinMove(e: MouseEvent) {
    const el = winRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateX(${12 - py * 14}deg) rotateY(${px * 16}deg)`
  }
  function onWinLeave() {
    if (winRef.current) winRef.current.style.transform = 'rotateX(12deg)'
  }

  return (
    <header id="top" className="v3-hero">
      <div className="v3-hero-bg" aria-hidden="true" />
      <HeroShader />
      <Constellation />

      <div className="v3-hero-stage">
        <div className="v3-hero-inner">
          <h1 className="v3-hero-headline">
            <span className="v3-line-mask"><span>{HERO.headlineLead}</span></span>
            <span className="v3-line-mask v3-line-mask--2"><span className="it">{HERO.headlineAccent}</span></span>
          </h1>
          <p className="v3-hero-sub">{HERO.sub}</p>
          <HeroCta />
        </div>
      </div>

      {/* Glass app window — byte's copilot panel (a distinct product
          surface from the Departments grid below, so nothing repeats) */}
      <div className="v3-window-wrap" onMouseMove={onWinMove} onMouseLeave={onWinLeave}>
        <div className="v3-window" ref={winRef}>
          <div className="v3-window-bar">
            <span className="v3-window-dot" style={{ background: '#ff5f57' }} />
            <span className="v3-window-dot" style={{ background: '#febc2e' }} />
            <span className="v3-window-dot" style={{ background: '#28c840' }} />
            <span className="v3-window-title">CODEPET — byte</span>
          </div>
          <div className="v3-copilot">
            <div className="v3-copilot-head">
              <span className="v3-copilot-avatar" aria-hidden="true" />
              <div>
                <div className="v3-copilot-name">byte</div>
                <div className="v3-copilot-status">guiding · Codepet</div>
              </div>
            </div>
            <div className="v3-copilot-msg">
              Welcome back. Let’s start where it counts — Codepet takes the first
              pass, and you make the calls.
            </div>
            <div className="v3-copilot-chips">
              <span className="v3-copilot-chip">Start with Engineering</span>
              <span className="v3-copilot-chip">Draft my launch post</span>
              <span className="v3-copilot-chip">Open the roadmap</span>
            </div>
            <div className="v3-copilot-input">Ask byte anything about your company…</div>
          </div>
        </div>
      </div>
    </header>
  )
}
