'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties } from 'react'
import { ENVIRONMENT, SETUP_ORDER } from '../content'

/**
 * Environment ("BUILT ON CLAUDE CODE") — a cinematic "universe" gallery.
 * A pinned section whose full-bleed panels slide horizontally as you
 * scroll: each panel is a large image with an oversized ultra-thin title
 * anchored low, a small tagline, a ghost index numeral and a "Discover"
 * affordance — the panel media drifts with a slow parallax as it crosses
 * the viewport. Below 820px / reduced-motion it falls back to a stacked
 * list (same DOM, no pinning).
 */
export default function Environment() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Mobile keeps the horizontal slide but skips the per-panel parallax:
    // that loop calls getBoundingClientRect on every panel each frame, and
    // those layout reads add up on a phone. The slide alone reads great.
    const lite = window.matchMedia('(max-width: 820px)').matches
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
      if (lite) return
      // Slow parallax on each panel's media as it crosses the viewport.
      const vw = window.innerWidth
      track.querySelectorAll<HTMLElement>('.v3-uni-media-inner').forEach((m) => {
        const r = m.getBoundingClientRect()
        const c = (r.left + r.width / 2 - vw / 2) / vw
        m.style.transform = `translateX(${(c * -26).toFixed(1)}px) scale(1.12)`
      })
    }

    const measure = () => {
      active = !reduce // pinned on mobile too (parallax skipped — see lite)
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

  return (
    <section id="environment" className="v3-uni v3-no-skew" ref={wrapRef}>
      <div className="v3-uni-sticky">
        <div className="v3-uni-head">
          <p className="v3-eyebrow">{ENVIRONMENT.eyebrow}</p>
          <h2 className="v3-uni-h2">
            <span className="v3-lead">{ENVIRONMENT.headlineLead}</span>{' '}
            <span className="it">{ENVIRONMENT.headlineAccent}</span>
          </h2>
        </div>

        <div className="v3-uni-track" ref={trackRef}>
          {ENVIRONMENT.items.map((it, i) => (
            <article
              key={it.name}
              className="v3-uni-panel"
              style={{ ['--c']: it.color } as CSSProperties}
            >
              <div className="v3-uni-media">
                <div className="v3-uni-media-inner">
                  <Image src={it.image} alt="" fill sizes="90vw" unoptimized />
                </div>
                <span className="v3-uni-scrim" aria-hidden="true" />
              </div>
              <div className="v3-uni-overlay">
                <span className="v3-uni-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="v3-uni-foot">
                  <div className="v3-uni-foot-text">
                    <span className="v3-uni-tagline">{it.desc}</span>
                    <h3 className="v3-uni-title">{it.name}</h3>
                  </div>
                  <a href={`/setup/${SETUP_ORDER[i]}`} className="v3-uni-discover">
                    Discover
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
