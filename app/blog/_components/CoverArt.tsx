import type { CategorySlug } from '@/lib/blog/categories'

/**
 * Deterministic generative cover art.
 *
 * The blog has no photography, so each post gets a unique, brand-colored
 * abstract cover (à la a modern newsroom) generated as inline SVG from a
 * seed derived from its slug. Same slug → same art every render, so it's
 * SSR-safe (no hydration mismatch) and free (no image requests).
 *
 * Color comes from the post's category; the composition (shapes, sizes,
 * positions, rotations) is seeded so every post looks distinct.
 */

type Palette = { bg: [string, string]; shapes: string[] }

const PALETTES: Record<CategorySlug, Palette> = {
  'building-ai-products': {
    bg: ['#241B52', '#7B6BD8'],
    shapes: ['#A89BF2', '#FFFFFF', '#FB7185', '#FBBF24'],
  },
  'user-insights': {
    bg: ['#16224F', '#4B6CD4'],
    shapes: ['#7C9DF5', '#FFFFFF', '#A89BF2', '#34D399'],
  },
  'second-brain': {
    bg: ['#311A57', '#7C3AED'],
    shapes: ['#C4A6FF', '#FFFFFF', '#FB7185', '#FBBF24'],
  },
}

function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32 — small, fast, deterministic PRNG. */
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 1200
const H = 675

export default function CoverArt({
  slug,
  category,
  className,
}: {
  slug: string
  category: CategorySlug
  className?: string
}) {
  const palette = PALETTES[category] ?? PALETTES['building-ai-products']
  const rng = makeRng(hashString(`${slug}|${category}`))
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]
  const id = `cov-${hashString(slug).toString(36)}`

  const shapeCount = 7 + Math.floor(rng() * 5) // 7–11 shapes
  const els: React.ReactElement[] = []

  for (let i = 0; i < shapeCount; i++) {
    const cx = rng() * W
    const cy = rng() * H
    const size = 90 + rng() * 240
    const color = pick(palette.shapes)
    const filled = rng() > 0.42
    const opacity = filled ? 0.6 + rng() * 0.35 : 0.5 + rng() * 0.4
    const stroke = Math.round(6 + rng() * 8)
    const kind = Math.floor(rng() * 4)
    const rot = Math.round(rng() * 360)
    const common = filled
      ? { fill: color, opacity }
      : { fill: 'none', stroke: color, strokeWidth: stroke, opacity }

    if (kind === 0) {
      // circle / ring
      els.push(<circle key={i} cx={cx} cy={cy} r={size / 2} {...common} />)
    } else if (kind === 1) {
      // rounded square, rotated
      els.push(
        <rect
          key={i}
          x={cx - size / 2}
          y={cy - size / 2}
          width={size}
          height={size}
          rx={size * 0.16}
          transform={`rotate(${rot} ${cx} ${cy})`}
          {...common}
        />
      )
    } else if (kind === 2) {
      // triangle
      const r = size / 2
      const pts = [0, 120, 240]
        .map((a) => {
          const rad = ((a + rot) * Math.PI) / 180
          return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`
        })
        .join(' ')
      els.push(<polygon key={i} points={pts} {...common} />)
    } else {
      // pill / capsule line
      els.push(
        <rect
          key={i}
          x={cx - size / 2}
          y={cy - stroke * 1.5}
          width={size}
          height={stroke * 3}
          rx={stroke * 1.5}
          transform={`rotate(${rot} ${cx} ${cy})`}
          fill={color}
          opacity={opacity}
        />
      )
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={palette.bg[0]} />
          <stop offset="1" stopColor={palette.bg[1]} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="0" width={W} height={H} fill={`url(#${id})`} />
        {els}
      </g>
    </svg>
  )
}
