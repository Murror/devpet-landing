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

    // Mobile / touch: use the browser's NATIVE scrolling. Lenis layers a JS
    // scroll loop on top of iOS's already-smooth momentum, and the
    // scroll-driven velocity skew (which re-transforms all 7 full-height
    // sections every frame) + parallax add per-frame work the mobile GPU
    // can't keep up with — that's the hitching. Native scroll is smoother
    // here; the ambient atmosphere (nebula, grain, glow) is pure CSS and
    // stays. Anchor links glide via CSS scroll-behavior instead (see v3.css).
    if (window.matchMedia('(max-width: 820px)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    // Parallax depth layers — elements tagged [data-parallax] drift against
    // the scroll by a per-element speed. Each element's document-space centre
    // is measured ONCE (on load + resize); the scroll handler then derives
    // its viewport position from window.scrollY alone. This keeps the per-
    // frame work transform-only — no getBoundingClientRect during scroll,
    // which is what made touch scrolling thrash layout.
    let vh = window.innerHeight
    const parallax = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    ).map((el) => ({ el, speed: parseFloat(el.dataset.parallax || '0'), docCenter: 0 }))

    const applyParallax = (sy: number) => {
      for (const p of parallax) {
        const center = p.docCenter - sy - vh / 2
        p.el.style.transform = `translate3d(0, ${(-center * p.speed).toFixed(1)}px, 0)`
      }
    }
    const measureParallax = () => {
      vh = window.innerHeight
      // Clear transforms so the measured rect is the element's real position.
      for (const p of parallax) p.el.style.transform = ''
      const sy = window.scrollY
      for (const p of parallax) {
        const r = p.el.getBoundingClientRect()
        p.docCenter = r.top + sy + r.height / 2
      }
      applyParallax(sy)
    }

    // Scroll-velocity skew → CSS var read by each section (.v3-skewer > *).
    lenis.on('scroll', () => {
      const vel = (lenis as { velocity?: number }).velocity ?? 0
      // Expose raw velocity for the scroll-reactive marquee.
      ;(window as unknown as { __v3vel?: number }).__v3vel = vel

      const v = Math.max(-0.7, Math.min(0.7, vel * 0.025))
      document.documentElement.style.setProperty('--vskew', `${v.toFixed(3)}deg`)

      applyParallax(window.scrollY)
    })

    measureParallax()
    window.addEventListener('resize', measureParallax)
    window.addEventListener('load', measureParallax)

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
      window.removeEventListener('resize', measureParallax)
      window.removeEventListener('load', measureParallax)
      lenis.destroy()
    }
  }, [])

  return null
}
