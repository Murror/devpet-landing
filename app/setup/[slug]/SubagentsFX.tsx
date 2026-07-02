'use client'

/**
 * Subagents signature — a task-token relay. A glowing token travels along a
 * rail, pausing at each specialist chip; every chip lights as the token
 * reaches it, then hands off to the next — "Codepet routes each job to the
 * agent built for it, then reports back to you." Autonomous (no pointer),
 * CSS keyframes only (transform/opacity), and it freezes cleanly under
 * reduced-motion. Chips sit at 12 / 37 / 63 / 88 % so the token's arrival
 * times line up with each chip's staggered glow delay.
 */
const STOPS = [
  { at: 12, label: 'Route',  delay: '0.2s' },
  { at: 37, label: 'Draft',  delay: '1.9s' },
  { at: 63, label: 'Verify', delay: '3.6s' },
  { at: 88, label: 'Report', delay: '5.3s' },
]

export default function SubagentsFX() {
  return (
    <div className="sp-sa" aria-hidden="true">
      <div className="sp-sa-rail" />
      {STOPS.map((s) => (
        <div key={s.label} className="sp-sa-chip" style={{ left: `${s.at}%`, animationDelay: s.delay }}>
          <span className="sp-sa-dot" />
          <span className="sp-sa-label">{s.label}</span>
        </div>
      ))}
      <span className="sp-sa-token" />
    </div>
  )
}
