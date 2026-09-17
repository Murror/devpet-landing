'use client'

import { useEffect, useRef } from 'react'

/**
 * ConvergeParticles — a Canvas-2D field for the final CTA. Particles drift
 * from the edges toward a central luminous core; when the section enters
 * view they accelerate inward and the core blooms (the "byte arrives"
 * moment). Additive blending keeps it light over the dark ground. Skipped
 * entirely under prefers-reduced-motion.
 */
type P = { x: number; y: number; a: number; r: number; sp: number; tw: number }

export default function ConvergeParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    const N = 90
    const parts: P[] = []
    const seed = (p: P) => {
      p.a = Math.random() * Math.PI * 2
      p.r = (0.45 + Math.random() * 0.6) * Math.max(w, h)
      p.sp = 0.0008 + Math.random() * 0.0016
      p.tw = Math.random() * Math.PI * 2
      const cx = w / 2
      const cy = h * 0.46
      p.x = cx + Math.cos(p.a) * p.r
      p.y = cy + Math.sin(p.a) * p.r
    }
    for (let i = 0; i < N; i++) {
      const p: P = { x: 0, y: 0, a: 0, r: 0, sp: 0, tw: 0 }
      seed(p)
      parts.push(p)
    }

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Converge harder while the section is on screen.
    let pull = 0.4
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { pull = e.isIntersecting ? 1 : 0.4 }),
      { threshold: 0.25 },
    )
    io.observe(canvas)

    let raf = 0
    let t = 0
    const draw = () => {
      t += 1
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h * 0.46

      // Central bloom.
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150 + pull * 60)
      bloom.addColorStop(0, `rgba(167,139,250,${0.16 + pull * 0.14})`)
      bloom.addColorStop(1, 'rgba(167,139,250,0)')
      ctx.fillStyle = bloom
      ctx.beginPath()
      ctx.arc(cx, cy, 220, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalCompositeOperation = 'lighter'
      for (const p of parts) {
        p.r -= p.r * p.sp * (0.4 + pull) * 6
        p.a += 0.0009
        p.x = cx + Math.cos(p.a) * p.r
        p.y = cy + Math.sin(p.a) * p.r
        const tw = 0.5 + 0.5 * Math.sin(t * 0.04 + p.tw)
        const near = 1 - Math.min(1, p.r / (Math.max(w, h) * 0.5))
        const alpha = (0.15 + near * 0.55) * (0.4 + tw * 0.6)
        const size = 0.7 + near * 1.8
        ctx.fillStyle = `rgba(${200 + Math.floor(near * 55)},${180 + Math.floor(near * 40)},255,${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fill()
        if (p.r < 22) seed(p) // reached the core → respawn at the edge
      }
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} className="v3-final-canvas" aria-hidden="true" />
}
