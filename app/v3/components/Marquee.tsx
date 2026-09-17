'use client'

import { useEffect, useRef } from 'react'

/**
 * Marquee — a ghost-type scroller that reacts to scroll. A base drift runs
 * always; scroll velocity (from SmoothScroll, on window.__v3vel) speeds it
 * up and nudges its direction, with a velocity-driven skew/stretch on fast
 * flicks. Reduced-motion falls back to the pure-CSS loop (no JS transform).
 */
const PHRASES = [
  'Never build alone',
  'From idea to company',
  'A cofounder who shows up',
  'You — with backup',
]

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    track.parentElement?.classList.add('v3-marquee--js')
    let x = 0
    let last = 0
    let raf = 0
    // Pause the drift while the marquee is off-screen (no point animating a
    // band you can't see — it just eats a frame-budget slice every tick).
    let visible = true
    const frame = (t: number) => {
      const dt = last ? Math.min(64, t - last) : 16
      last = t
      const vel = (window as unknown as { __v3vel?: number }).__v3vel || 0
      const speed = 0.045 + Math.min(0.55, Math.abs(vel) * 0.012) // px/ms: drift + boost
      x -= speed * dt
      x -= vel * 0.22 // nudge by scroll direction/velocity
      const half = track.scrollWidth / 2
      if (half) {
        while (x <= -half) x += half
        while (x > 0) x -= half
      }
      const skew = Math.max(-7, Math.min(7, vel * 0.05))
      const stretch = 1 + Math.min(0.05, Math.abs(vel) * 0.004)
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg) scaleX(${stretch.toFixed(3)})`
      if (visible) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible) { last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame) }
      },
      { rootMargin: '80px' },
    )
    io.observe(track)

    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [])

  // Two copies of the sequence → seamless wrap.
  const items = [...PHRASES, ...PHRASES]
  return (
    <div className="v3-marquee" aria-hidden="true">
      <div className="v3-marquee-track" ref={trackRef}>
        {items.map((p, i) => (
          <span key={i} className="v3-marquee-item">
            {p}
            <span className="star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
