'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import { DEPARTMENTS } from '../content'
import SplitText from './SplitText'

type Dept = (typeof DEPARTMENTS)['items'][number]

/**
 * DeptGallery — the eight department cards as a pinned horizontal scroll
 * gallery (the signature awwwards move): on desktop the band pins to the
 * viewport and the track slides sideways as you scroll down. Each card
 * tilts in 3D toward the cursor with a moving glare. Below 820px (or
 * reduced-motion) it falls back to a plain
 * responsive grid — same DOM, no pinning.
 */
export default function DeptGallery({ items }: { items: readonly Dept[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // ── Pinned horizontal scroll ──
  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let active = false
    let maxX = 0
    let raf = 0

    const update = () => {
      if (!active) return
      const top = wrap.getBoundingClientRect().top + window.scrollY
      const dist = wrap.offsetHeight - window.innerHeight
      let p = (window.scrollY - top) / Math.max(1, dist)
      p = Math.min(1, Math.max(0, p))
      track.style.transform = `translate3d(${(-p * maxX).toFixed(1)}px,0,0)`
    }

    const measure = () => {
      active = !reduce // pinned horizontal gallery on mobile too
      wrap.classList.toggle('is-pinned', active)
      if (active) {
        maxX = Math.max(0, track.scrollWidth - window.innerWidth)
        wrap.style.height = `${maxX + window.innerHeight}px`
      } else {
        wrap.style.height = ''
        track.style.transform = ''
      }
      update()
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

  // ── Per-card 3D tilt + glare ──
  const tilt = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = e.currentTarget
    const r = c.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    c.style.setProperty('--rx', `${((0.5 - py) * 7).toFixed(2)}deg`)
    c.style.setProperty('--ry', `${((px - 0.5) * 9).toFixed(2)}deg`)
    c.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
    c.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
    c.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
    c.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
  }
  const reset = (e: MouseEvent<HTMLElement>) => {
    const c = e.currentTarget
    c.style.setProperty('--rx', '0deg')
    c.style.setProperty('--ry', '0deg')
  }

  return (
    <div className="v3-gallery" ref={wrapRef}>
      <div className="v3-gallery-sticky">
        <div className="v3-gallery-head">
          <p className="v3-eyebrow">{DEPARTMENTS.eyebrow}</p>
          <h2 className="v3-h2">
            <SplitText text={DEPARTMENTS.headlineLead} className="v3-lead" />{' '}
            <SplitText text={DEPARTMENTS.headlineAccent} className="it" />
          </h2>
          <p className="v3-sub">{DEPARTMENTS.sub}</p>
        </div>
        <div className="v3-gallery-track" ref={trackRef}>
          {items.map((d) => (
            <article
              key={d.key}
              className="v3-dept v3-dept--tilt v3-spot"
              style={{ '--dept': d.color } as CSSProperties}
              onMouseMove={tilt}
              onMouseLeave={reset}
            >
              <div className={`v3-dept-cover${(d as { photo?: boolean }).photo ? ' v3-dept-cover--photo' : ''}`}>
                <Image src={d.cover} alt={`${d.name} cover`} fill sizes="(max-width: 520px) 100vw, 520px" unoptimized />
              </div>
              <div className="v3-dept-body">
                <span className="v3-dept-tag">{d.name.slice(0, 2)}</span>
                <h3 className="v3-dept-name">{d.name}</h3>
                <p className="v3-dept-need">{d.need}</p>
              </div>
              <span className="v3-dept-glare" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
