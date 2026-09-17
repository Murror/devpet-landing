'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { LOOP } from '../content'

/**
 * Loop — Codepet's core promise as a self-running cycle:
 * Execute → Deliver → Approve. The section pins and scroll scrubs the
 * three cards ONE AT A TIME: the centred card is large and sharp; as you
 * scroll it flies toward you and dissolves (blur + fade) while the next
 * rises from depth and assembles into focus. Progress dots track the beat.
 * Below 820px / reduced-motion it falls back to a plain stacked list.
 */
export default function Loop() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('.v3-loopcard--stage'))
    const n = cards.length
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Mobile runs the same 3D transition, but WITHOUT the blur dissolve — a
    // large filter:blur during scroll is the one expensive part (proven by
    // the on-device timeline). Transforms + opacity carry the effect fine.
    const noBlur = window.matchMedia('(max-width: 820px)').matches

    let active = false
    let raf = 0

    const paint = (prog: number) => {
      cards.forEach((card, i) => {
        const d = i - prog
        let z: number, y: number, s: number, rot: number, op: number, blur: number
        if (d >= 0) {
          // current + upcoming: stacked, receding into depth
          z = -d * 480
          y = d * 22
          s = Math.max(0.62, 1 - 0.08 * d)
          rot = -d * 6
          op = Math.max(0, 1 - d * 0.7)
          blur = Math.min(8, d * 4)
        } else {
          // past: flies toward the viewer and dissolves upward
          const a = -d
          z = a * 560
          y = -a * 60
          s = 1 + a * 0.5
          rot = a * 8
          op = Math.max(0, 1 - a * 1.15)
          blur = Math.min(16, a * 13)
        }
        card.style.transform = `translate(-50%,-50%) translate3d(0,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateX(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`
        card.style.opacity = op.toFixed(3)
        card.style.filter = !noBlur && blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none'
        card.style.zIndex = String(Math.round(1000 + z))
      })
    }

    const update = () => {
      if (!active) return
      const top = stage.getBoundingClientRect().top + window.scrollY
      const dist = stage.offsetHeight - window.innerHeight
      let p = (window.scrollY - top) / Math.max(1, dist)
      p = Math.min(1, Math.max(0, p))
      paint(p * (n - 1))
    }

    const clearInline = () => {
      cards.forEach((card) => {
        card.style.transform = ''
        card.style.opacity = ''
        card.style.filter = ''
        card.style.zIndex = ''
      })
    }

    const measure = () => {
      active = !reduce // pinned on mobile too (blur-free — see noBlur)
      stage.classList.toggle('is-pinned', active)
      if (active) {
        stage.style.height = `${n * window.innerHeight}px`
        update()
      } else {
        stage.style.height = ''
        clearInline()
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
    <section id="loop" className="v3-section v3-no-skew">
      <Reveal>
        <p className="v3-eyebrow">{LOOP.eyebrow}</p>
        <h2 className="v3-h2">
          <SplitText text={LOOP.headlineLead} className="v3-lead" />{' '}
          <SplitText text={LOOP.headlineAccent} className="it" />
        </h2>
        <p className="v3-sub">{LOOP.sub}</p>
      </Reveal>

      <div className="v3-loopstage" ref={stageRef}>
        <div className="v3-loopstage-sticky">
          {LOOP.steps.map((s, i) => (
            <article key={s.key} className="v3-loopcard v3-loopcard--stage">
              <div className="v3-loopcard-media">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 560px"
                  loading="lazy"
                  unoptimized
                />
              </div>
              <span className="v3-loopcard-scrim" aria-hidden="true" />
              <div className="v3-loopcard-body">
                <span className="v3-loopcard-num">0{i + 1}</span>
                <div className="v3-loopcard-foot">
                  <h3 className="v3-loopcard-title">{s.label}</h3>
                  <p className="v3-loopcard-desc">{s.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
