'use client'

import { useRef, type CSSProperties, type MouseEvent } from 'react'
import Image from 'next/image'
import Constellation from './Constellation'
import Magnetic from './Magnetic'
import { HERO, DEPARTMENTS } from '../content'

/**
 * Hero — the magical centrepiece. A near-black canvas where the
 * eight departments orbit a central glow (Constellation), an
 * elegant headline with a load mask-reveal, and a glass "app window"
 * that recreates the product's Company view from the real covers
 * (tilts toward the cursor in 3D).
 */
export default function Hero() {
  const winRef = useRef<HTMLDivElement>(null)
  const preview = DEPARTMENTS.items.slice(0, 4)

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
      <Image
        src="/v3/hero-ascii.jpg"
        alt=""
        fill
        priority
        unoptimized
        className="v3-hero-bg"
        aria-hidden="true"
      />
      <Constellation />

      <div className="v3-hero-stage">
        <div className="v3-hero-inner">
          <h1 className="v3-hero-headline">
            <span className="v3-line-mask"><span>{HERO.headlineLead}</span></span>
            <span className="v3-line-mask v3-line-mask--2"><span className="it">{HERO.headlineAccent}</span></span>
          </h1>
          <p className="v3-hero-sub">{HERO.sub}</p>
          <div className="v3-hero-cta">
            <Magnetic>
              <a href="/download" className="v3-btn v3-btn--primary">
                <AppleMark /> {HERO.ctaPrimary}
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a href="#loop" className="v3-btn v3-btn--ghost">{HERO.ctaSecondary}</a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Glass app window — the product's Company view, from real covers */}
      <div className="v3-window-wrap" onMouseMove={onWinMove} onMouseLeave={onWinLeave}>
        <div className="v3-window" ref={winRef}>
          <div className="v3-window-bar">
            <span className="v3-window-dot" style={{ background: '#ff5f57' }} />
            <span className="v3-window-dot" style={{ background: '#febc2e' }} />
            <span className="v3-window-dot" style={{ background: '#28c840' }} />
            <span className="v3-window-title">CODEPET — YOUR COMPANY</span>
          </div>
          <div className="v3-window-grid">
            {preview.map((d) => (
              <div key={d.key} className="v3-mini">
                <Image src={d.cover} alt={d.name} width={200} height={150} unoptimized />
                <span className="v3-mini-tag" style={{ '--mini': d.color } as CSSProperties}>
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

function AppleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.36 12.78c-.02-2.13 1.74-3.15 1.82-3.2-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.58.78-3.25.78-.67 0-1.7-.76-2.8-.74-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.38 6.44 1.07 8.55.71 1.03 1.55 2.19 2.66 2.15 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.78.67 1.15-.02 1.88-1.05 2.58-2.09.81-1.19 1.15-2.35 1.17-2.41-.03-.01-2.24-.86-2.26-3.4zM14.2 6.4c.59-.72.99-1.71.88-2.7-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.6.95.08 1.92-.48 2.51-1.18z" />
    </svg>
  )
}
