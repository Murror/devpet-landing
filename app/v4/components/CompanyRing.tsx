import type { CSSProperties } from 'react'
import { V4 } from '../content'

/**
 * CompanyRing — the eight companions arranged on a circle around the
 * headline. One founder, a whole company around them.
 *
 * Purely decorative, so aria-hidden with empty alt text. Position is
 * CSS's job: each node carries its index as --i and v4.css rotates it
 * into place, which keeps this a server component with no layout maths.
 *
 * Phase 2 replaces this with a WebGL orbit on capable devices and keeps
 * it as the fallback below 820px and under prefers-reduced-motion.
 */
export default function CompanyRing() {
  return (
    <div className="v4-ring" aria-hidden="true">
      {V4.companions.map((name, i) => (
        <span
          key={name}
          className="v4-ring-node"
          style={{ ['--i']: i } as CSSProperties}
        >
          <img src={`/characters/${name}.svg`} alt="" width={64} height={64} />
        </span>
      ))}
    </div>
  )
}
