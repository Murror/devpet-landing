'use client'

import { useEffect, useRef } from 'react'

/**
 * Constellation — the hero's "company as a constellation".
 *
 * A lightweight Canvas-2D particle field (no three.js, so the
 * landing stays fast): eight glowing department nodes orbit a
 * central glow while a haze of drifting motes floats behind them.
 * Faint lines connect the centre to each node, so it reads as a
 * living company map rather than random sparkles. The whole field
 * parallaxes gently toward the cursor.
 *
 * Mirrors the product's own 3D "Overview" company map, reimagined
 * as a calm, cinematic-dark backdrop. Respects reduced-motion by
 * rendering a single static frame.
 */

// Department accent colours — same order/identity as the product.
const NODE_COLORS = [
  '#2563EB', // eng
  '#FF8C42', // mkt
  '#2DD4BF', // ops
  '#FDB022', // fin
  '#9333EA', // legal
  '#A855F7', // design
  '#7C3AED', // sales
  '#FF6B9D', // support
]

export default function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Phones: skip the constellation entirely. A full-screen 2D canvas
    // animating motes + orbiting nodes + shooting stars is a real per-frame
    // GPU/CPU cost even confined to the hero, and it's a screen-blended
    // layer on top of everything. The static hero image + nebula glow carry
    // the look on mobile. (The canvas is also display:none there via CSS.)
    if (window.matchMedia('(max-width: 820px)').matches) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Pause the animation loop while the hero (and its canvas) is scrolled
    // out of view — a constellation of motes + shooting stars redrawing every
    // frame is wasted GPU/CPU once you're deeper in the page, and on mobile
    // that idle load is enough to stutter the scroll.
    let visible = true

    let w = 0, h = 0, cx = 0, cy = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Pointer parallax (eased toward the real cursor position).
    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }

    // Background haze — many tiny slow motes.
    type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number }
    let motes: Mote[] = []

    // Eight orbiting department nodes.
    type Node = { angle: number; speed: number; radius: number; r: number; color: string; wob: number }
    let nodes: Node[] = []

    // Occasional shooting stars streaking across the field.
    type Shoot = { x: number; y: number; vx: number; vy: number; life: number; max: number }
    let shoots: Shoot[] = []
    let nextShoot = 90

    function rand(seed: number) {
      // deterministic-ish pseudo random from an index so SSR/repaint
      // stays visually stable enough; varies by index, no Math.random
      // dependency for layout (only used at init).
      const x = Math.sin(seed * 999.13) * 10000
      return x - Math.floor(x)
    }

    function build() {
      const rect = canvas!.getBoundingClientRect()
      w = rect.width; h = rect.height
      cx = w / 2; cy = h * 0.46
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.floor(w * dpr)
      canvas!.height = Math.floor(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const baseR = Math.min(w, h) * 0.30
      nodes = NODE_COLORS.map((color, i) => ({
        angle: (i / NODE_COLORS.length) * Math.PI * 2,
        speed: (reduce ? 0 : 0.00018) * (1 + rand(i) * 0.5),
        radius: baseR * (0.7 + rand(i + 7) * 0.6),
        r: 2.6 + rand(i + 3) * 2.2,
        color,
        wob: rand(i + 11) * Math.PI * 2,
      }))

      shoots = []
      nextShoot = 90
      const count = Math.min(150, Math.floor((w * h) / 9000))
      motes = Array.from({ length: count }, (_, i) => ({
        x: rand(i) * w,
        y: rand(i + 100) * h,
        r: 0.4 + rand(i + 200) * 1.4,
        vx: (rand(i + 300) - 0.5) * 0.12,
        vy: (rand(i + 400) - 0.5) * 0.12,
        a: 0.15 + rand(i + 500) * 0.5,
      }))
    }

    let t = 0
    let raf = 0

    function frame() {
      t += 1
      ctx!.clearRect(0, 0, w, h)

      // ease parallax
      eased.x += (target.x - eased.x) * 0.05
      eased.y += (target.y - eased.y) * 0.05
      const px = eased.x, py = eased.y

      // ── background motes ──
      for (const m of motes) {
        if (!reduce) { m.x += m.vx; m.y += m.vy }
        if (m.x < 0) m.x = w; if (m.x > w) m.x = 0
        if (m.y < 0) m.y = h; if (m.y > h) m.y = 0
        const twinkle = reduce ? m.a : m.a * (0.6 + 0.4 * Math.sin((t * 0.02) + m.x))
        ctx!.beginPath()
        ctx!.arc(m.x + px * 0.4, m.y + py * 0.4, m.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(200,190,255,${twinkle})`
        ctx!.fill()
      }

      // central glow
      const cglx = cx + px, cgly = cy + py
      const grad = ctx!.createRadialGradient(cglx, cgly, 0, cglx, cgly, 120)
      grad.addColorStop(0, 'rgba(124,58,237,0.55)')
      grad.addColorStop(0.5, 'rgba(124,58,237,0.14)')
      grad.addColorStop(1, 'rgba(124,58,237,0)')
      ctx!.fillStyle = grad
      ctx!.fillRect(cglx - 120, cgly - 120, 240, 240)

      // ── nodes + connectors ──
      const positions: { x: number; y: number; color: string; r: number }[] = []
      for (const n of nodes) {
        n.angle += n.speed * 16
        const wob = Math.sin(t * 0.01 + n.wob) * 8
        const nx = cx + Math.cos(n.angle) * (n.radius + wob) + px * 1.6
        const ny = cy + Math.sin(n.angle) * (n.radius + wob) * 0.62 + py * 1.6
        positions.push({ x: nx, y: ny, color: n.color, r: n.r })
      }

      // connector lines: centre → node
      for (const p of positions) {
        ctx!.beginPath()
        ctx!.moveTo(cglx, cgly)
        ctx!.lineTo(p.x, p.y)
        const lg = ctx!.createLinearGradient(cglx, cgly, p.x, p.y)
        lg.addColorStop(0, 'rgba(167,139,250,0.22)')
        lg.addColorStop(1, 'rgba(167,139,250,0)')
        ctx!.strokeStyle = lg
        ctx!.lineWidth = 1
        ctx!.stroke()
      }

      // nodes (glow + core) — additive blending for a real bloom
      ctx!.globalCompositeOperation = 'lighter'
      for (const p of positions) {
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8)
        g.addColorStop(0, p.color + 'dd')
        g.addColorStop(0.4, p.color + '40')
        g.addColorStop(1, p.color + '00')
        ctx!.fillStyle = g
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = '#fff'
        ctx!.fill()
      }

      // ── shooting stars ──
      if (!reduce) {
        nextShoot -= 1
        if (nextShoot <= 0) {
          const s = t
          shoots.push({
            x: rand(s) * w * 0.7,
            y: rand(s + 1) * h * 0.32,
            vx: 6 + rand(s + 2) * 5,
            vy: 2.2 + rand(s + 3) * 2,
            life: 0,
            max: 55 + rand(s + 4) * 35,
          })
          nextShoot = 240 + Math.floor(rand(s + 5) * 360)
        }
        for (const sh of shoots) {
          sh.life += 1
          sh.x += sh.vx
          sh.y += sh.vy
          const k = 1 - sh.life / sh.max
          const tailX = sh.x - sh.vx * 9
          const tailY = sh.y - sh.vy * 9
          const lg = ctx!.createLinearGradient(tailX, tailY, sh.x, sh.y)
          lg.addColorStop(0, 'rgba(200,190,255,0)')
          lg.addColorStop(1, `rgba(220,210,255,${Math.max(0, k) * 0.9})`)
          ctx!.strokeStyle = lg
          ctx!.lineWidth = 1.6
          ctx!.beginPath()
          ctx!.moveTo(tailX, tailY)
          ctx!.lineTo(sh.x, sh.y)
          ctx!.stroke()
        }
        shoots = shoots.filter((s) => s.life < s.max && s.x < w + 40 && s.y < h + 40)
      }
      ctx!.globalCompositeOperation = 'source-over'

      if (!reduce && visible) raf = requestAnimationFrame(frame)
    }

    function onPointer(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5)
      const ny = (e.clientY / window.innerHeight - 0.5)
      target.x = nx * 40
      target.y = ny * 30
    }

    build()
    frame()
    if (!reduce) window.addEventListener('pointermove', onPointer)
    const onResize = () => { build() ; if (reduce) frame() }
    window.addEventListener('resize', onResize)

    // Only run the loop while the canvas is on (or near) screen.
    let io: IntersectionObserver | null = null
    if (!reduce) {
      io = new IntersectionObserver(
        ([e]) => {
          visible = e.isIntersecting
          if (visible) { cancelAnimationFrame(raf); frame() }
        },
        { rootMargin: '120px' },
      )
      io.observe(canvas)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      io?.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="v3-hero-canvas" aria-hidden="true" />
}
