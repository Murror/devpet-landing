'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll — Lenis inertia scrolling + a subtle scroll-velocity
 * skew applied to the page content (.v3-skewer). In-page anchor links
 * are routed through Lenis so they glide. Disabled for reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    // On phones/tablets skip the per-scroll skew + parallax math: it forces
    // a transform recalc on every section each frame and thrashes layout
    // with getBoundingClientRect, which stutters touch scrolling. Native
    // momentum + static atmosphere feels smoother there (matches desktop).
    const light = window.matchMedia('(max-width: 820px)').matches

    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    // Parallax depth layers — elements tagged [data-parallax] drift against
    // the scroll by a per-element speed. Cached once; recomputed each scroll.
    const parallax = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    ).map((el) => ({ el, speed: parseFloat(el.dataset.parallax || '0') }))
    const vh = () => window.innerHeight

    // Scroll-velocity skew → CSS var read by each section (.v3-skewer > *).
    lenis.on('scroll', () => {
      const vel = (lenis as { velocity?: number }).velocity ?? 0
      // Expose raw velocity for the scroll-reactive marquee (kept on mobile).
      ;(window as unknown as { __v3vel?: number }).__v3vel = vel
      if (light) return

      const v = Math.max(-0.7, Math.min(0.7, vel * 0.025))
      document.documentElement.style.setProperty('--vskew', `${v.toFixed(3)}deg`)

      for (const { el, speed } of parallax) {
        const r = el.getBoundingClientRect()
        const center = r.top + r.height / 2 - vh() / 2
        el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`
      }
    })

    // Route in-page anchors through Lenis for a smooth glide.
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href') || ''
      if (id.length < 2) return
      const target = document.querySelector(id)
      if (target) { ev.preventDefault(); lenis.scrollTo(target as HTMLElement, { offset: -90 }) }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])

  return null
}
