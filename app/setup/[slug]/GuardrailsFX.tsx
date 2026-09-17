'use client'

import { useEffect, useRef } from 'react'

/**
 * Guardrails signature — a containment field. A luminous rounded frame (the
 * "rails") holds a glowing orb. Move your cursor and the orb springs toward
 * it, but it is CLAMPED inside the frame: push past a rail and the orb
 * presses the edge (which flares) and springs back — you can feel the limit.
 * With no pointer it wanders and bumps the rails on its own. One rAF spring
 * loop (transform/opacity only); static + centred under reduced-motion.
 */
const PAD = 9 // % inset the orb is kept inside the frame

export default function GuardrailsFX() {
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const frame = frameRef.current
    const orb = orbRef.current
    if (!root || !frame || !orb) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      orb.style.left = '50%'
      orb.style.top = '50%'
      return
    }

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    let px = 50, py = 50          // orb position (% within frame)
    let vx = 0, vy = 0            // velocity
    let tx = 50, ty = 50          // target
    let press = 0
    let active = false
    let lastMove = 0
    let idleT = 0, idleTargetX = 50, idleTargetY = 50
    let raf = 0
    let now = 0

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect()
      const rawX = ((e.clientX - r.left) / r.width) * 100
      const rawY = ((e.clientY - r.top) / r.height) * 100
      tx = clamp(rawX, PAD, 100 - PAD)
      ty = clamp(rawY, PAD, 100 - PAD)
      // how hard the cursor pushes past the rail → edge flare
      press = clamp((Math.abs(rawX - tx) + Math.abs(rawY - ty)) / PAD, 0, 1)
      active = true
      lastMove = now
    }

    const tick = (t: number) => {
      now = t
      if (!active || now - lastMove > 1400) {
        // idle wander: pick a fresh near-edge target every ~1.5s so it keeps
        // drifting out and getting caught by the rails.
        active = false
        if (now - idleT > 1500) {
          idleT = now
          idleTargetX = PAD + Math.random() * (100 - 2 * PAD)
          idleTargetY = PAD + Math.random() * (100 - 2 * PAD)
        }
        tx = idleTargetX
        ty = idleTargetY
        press = Math.max(0, press - 0.04)
      }
      // spring toward target (overshoot = the "snap")
      vx = (vx + (tx - px) * 0.02) * 0.86
      vy = (vy + (ty - py) * 0.02) * 0.86
      px += vx
      py += vy
      // hard clamp — the rail never lets it out; a wall-hit adds a small flare
      if (px < PAD) { px = PAD; vx *= -0.4; press = Math.min(1, press + 0.3) }
      if (px > 100 - PAD) { px = 100 - PAD; vx *= -0.4; press = Math.min(1, press + 0.3) }
      if (py < PAD) { py = PAD; vy *= -0.4; press = Math.min(1, press + 0.3) }
      if (py > 100 - PAD) { py = 100 - PAD; vy *= -0.4; press = Math.min(1, press + 0.3) }
      orb.style.left = `${px.toFixed(2)}%`
      orb.style.top = `${py.toFixed(2)}%`
      frame.style.setProperty('--press', press.toFixed(2))
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="sp-gr" ref={rootRef} aria-hidden="true">
      <div className="sp-gr-frame" ref={frameRef}>
        <span className="sp-gr-orb" ref={orbRef} />
      </div>
    </div>
  )
}
