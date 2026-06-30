'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { ENVIRONMENT } from '../content'

/**
 * Environment — Codepet's guided Claude Code setup as an alternating (zigzag)
 * feature list with a stack of "wow" effects:
 *  • directional reveal — image slides in from its side, option from the other
 *  • inner parallax — the image drifts inside its frame as you scroll
 *  • 3D cursor tilt + glare on each image
 *  • active-row scroll focus — the centred row blooms; its toggle latches ON
 *  • ghost index numerals + a slow animated gradient frame
 */
export default function Environment() {
  const zigRef = useRef<HTMLDivElement>(null)

  // Scroll-linked: active-row focus + inner-image parallax.
  useEffect(() => {
    const zig = zigRef.current
    if (!zig) return
    const rows = Array.from(zig.querySelectorAll<HTMLElement>('.v3-env-zrow'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows.forEach((r) => r.classList.add('was-active'))
      return
    }
    let raf = 0
    const update = () => {
      const vh = window.innerHeight
      const center = vh / 2
      let best = -1
      let bestDist = Infinity
      rows.forEach((row, i) => {
        const r = row.getBoundingClientRect()
        const rowCenter = r.top + r.height / 2
        const inner = row.querySelector<HTMLElement>('.v3-env-zimg-inner')
        if (inner) inner.style.transform = `translateY(${(((rowCenter - center) / vh) * 30).toFixed(1)}px)`
        if (r.bottom > 0 && r.top < vh) {
          const dist = Math.abs(rowCenter - center)
          if (dist < bestDist) { bestDist = dist; best = i }
        }
      })
      rows.forEach((row, i) => {
        const on = i === best
        row.classList.toggle('is-active', on)
        if (on) row.classList.add('was-active')
      })
      zig.classList.toggle('has-active', best >= 0)
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Per-image 3D tilt + glare.
  const tilt = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - py) * 6).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((px - 0.5) * 8).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
  }
  const reset = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <section id="environment" className="v3-section">
      <Reveal>
        <div className="v3-env-intro">
          <p className="v3-eyebrow">{ENVIRONMENT.eyebrow}</p>
          <h2 className="v3-h2">
            <SplitText text={ENVIRONMENT.headlineLead} className="v3-lead" />{' '}
            <SplitText text={ENVIRONMENT.headlineAccent} className="it" />
          </h2>
          <p className="v3-sub">{ENVIRONMENT.sub}</p>
        </div>
      </Reveal>

      <div className="v3-env-zigzag" ref={zigRef}>
        {ENVIRONMENT.items.map((it, i) => (
          <Reveal key={it.name} className="v3-env-zreveal">
            <div className="v3-env-zrow" style={{ ['--c']: it.color } as CSSProperties}>
              <div className="v3-env-zimg" onMouseMove={tilt} onMouseLeave={reset}>
                <div className="v3-env-zimg-inner">
                  <Image src={it.image} alt="" fill sizes="(max-width: 760px) 100vw, 560px" unoptimized />
                </div>
                <span className="v3-env-zglare" aria-hidden="true" />
              </div>
              <div className="v3-env-zbody">
                <span className="v3-env-znum" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="v3-env-node" aria-hidden="true" />
                <h3 className="v3-env-zname">{it.name}</h3>
                <p className="v3-env-zdesc">{it.desc}</p>
                <span className="v3-env-toggle" aria-hidden="true"><span /></span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
