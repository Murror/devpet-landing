import { deflateSync } from 'node:zlib'
import type { CategorySlug } from '@/lib/blog/categories'

/**
 * Deterministic generative cover art — lush PIXEL-ART landscapes.
 *
 * The blog has no photography, so each post gets a unique scene generated
 * from a seed derived from its slug: a dithered sunset / dusk / pastel sky,
 * puffy multi-tone clouds, a low sun, hazily layered mountains, a forest
 * tree line, and a flowering meadow (or a mirrored lake). Everything is
 * painted onto a coarse COLS×ROWS cell grid and encoded server-side as a
 * tiny PNG (via Node's zlib), shown crisp with `image-rendering: pixelated`.
 * A real raster keeps the heavy per-pixel dithering off the DOM (an inline
 * SVG would need tens of thousands of <rect>s). Same slug → same art
 * (SSR-safe, no external image requests).
 */

const COLS = 192
const ROWS = 108

// ── seeded rng ──
function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── colour utils ──
const hx = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
const toHex = (c: [number, number, number]) => '#' + c.map((v) => clamp(v).toString(16).padStart(2, '0')).join('')
const mix = (a: string, b: string, t: number): string => {
  const A = hx(a)
  const B = hx(b)
  return toHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t])
}
const light = (c: string, t: number) => mix(c, '#ffffff', t)
const dark = (c: string, t: number) => mix(c, '#1a1430', t)

// 4×4 ordered (Bayer) dithering for gradient transitions.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]
const bthr = (x: number, y: number) => (BAYER[y & 3][x & 3] + 0.5) / 16

// ── themes (sky bands top→horizon, plus scene colours) ──
type Theme = {
  sky: string[]
  star: string | null
  stars: number
  sun: string | null
  sunGlow: string | null
  cloud: { light: string; mid: string; shadow: string }
  mtns: [string, string, string]
  forest: string
  grass: { light: string; mid: string; dark: string }
  flower: string[]
  horizon: number
  water: boolean
}

const THEMES: Record<string, Theme> = {
  sunset: {
    sky: ['#6E78C8', '#8E84D6', '#B486D8', '#D98FC0', '#F0A8A0', '#F6C78C'],
    star: '#CFE0FF', stars: 5, sun: '#FBE7A6', sunGlow: '#F6C78C',
    cloud: { light: '#FBD6E0', mid: '#E79FC2', shadow: '#C77FB0' },
    mtns: ['#9E8AD8', '#7A6BC0', '#46407E'], forest: '#33356B',
    grass: { light: '#7FB36A', mid: '#5E944F', dark: '#33614A' },
    flower: ['#E2495A', '#F2D24A'], horizon: 0.62, water: false,
  },
  lake: {
    sky: ['#7C6FC0', '#B07BC8', '#E58FB0', '#F4A689', '#F7C07E', '#F6D79A'],
    star: null, stars: 0, sun: '#FBEAB0', sunGlow: '#F6C78C',
    cloud: { light: '#FBD2B8', mid: '#EE9CA6', shadow: '#C97FA8' },
    mtns: ['#8E7CC8', '#6E5FA8', '#4A4080'], forest: '#3A3470',
    grass: { light: '#6CA35C', mid: '#4F8048', dark: '#2E5740' },
    flower: ['#E85D6A'], horizon: 0.46, water: true,
  },
  pastel: {
    sky: ['#8FC5E8', '#A9CFEC', '#CFD7EE', '#EEC9E2', '#F3D2E6', '#F7DCEC'],
    star: null, stars: 0, sun: null, sunGlow: null,
    cloud: { light: '#FFFFFF', mid: '#F3CFE4', shadow: '#DDA9CE' },
    mtns: ['#A9C0E8', '#8AA8E0', '#6E86C8'], forest: '#2F5560',
    grass: { light: '#9FD06A', mid: '#7BB94F', dark: '#3E6B3A' },
    flower: ['#EFA8D2', '#F7C0DE'], horizon: 0.6, water: false,
  },
}
const THEME_NAMES = Object.keys(THEMES)

// ── grid ──
type Grid = string[][]
type R = () => number
const makeGrid = (): Grid => Array.from({ length: ROWS }, () => new Array<string>(COLS).fill('#000000'))
const set = (g: Grid, x: number, y: number, c: string) => {
  if (y >= 0 && y < ROWS && x >= 0 && x < COLS) g[y][x] = c
}

function sky(g: Grid, th: Theme): number {
  const horizonRow = Math.round(ROWS * th.horizon)
  const bands = th.sky
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const p = Math.min(1, Math.max(0, y / horizonRow))
      const scaled = p * (bands.length - 1)
      let i = Math.floor(scaled)
      if (i >= bands.length - 1) i = bands.length - 2
      const f = scaled - i
      g[y][x] = f > bthr(x, y) ? bands[i + 1] : bands[i]
    }
  }
  return horizonRow
}

function stars(g: Grid, th: Theme, rng: R) {
  if (!th.star) return
  for (let i = 0; i < th.stars; i++) {
    const x = 4 + Math.floor(rng() * (COLS - 8))
    const y = 2 + Math.floor(rng() * ROWS * 0.28)
    for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]] as const) set(g, x + dx, y + dy, th.star)
    if (rng() > 0.5) for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]] as const) set(g, x + dx, y + dy, th.star)
  }
}

function sun(g: Grid, th: Theme, rng: R, horizonRow: number) {
  if (!th.sun || !th.sunGlow) return
  const cx = Math.round(COLS * (0.4 + rng() * 0.3))
  const cy = Math.round(horizonRow - 2 - rng() * 6)
  const r = Math.round(COLS * 0.07 + rng() * 4)
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const d = Math.hypot(x - cx, y - cy)
    if (d < r * 2.2) g[y][x] = mix(g[y][x], th.sunGlow, (1 - d / (r * 2.2)) * 0.5)
  }
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const d = Math.hypot(x - cx, y - cy)
    if (d <= r) g[y][x] = d > r - 2 ? light(th.sun, 0) : th.sun
  }
}

function cloudBank(g: Grid, th: Theme, rng: R) {
  const c = th.cloud
  const count = 3 + Math.floor(rng() * 3)
  for (let k = 0; k < count; k++) {
    const by = Math.round(ROWS * (0.12 + rng() * 0.34))
    const span = Math.round(COLS * (0.18 + rng() * 0.28))
    const sx = Math.round(rng() * (COLS - span))
    const lobes = 3 + Math.floor(rng() * 4)
    const top = new Array<number>(COLS).fill(Infinity)
    for (let l = 0; l < lobes; l++) {
      const lx = sx + Math.round((l / (lobes - 1)) * span) + Math.round((rng() * 2 - 1) * 4)
      const lr = 3 + Math.round(rng() * 5)
      const ly = by - Math.round(lr * 0.6) - Math.round(rng() * 2)
      for (let x = lx - lr; x <= lx + lr; x++) {
        const dy = Math.sqrt(Math.max(0, lr * lr - (x - lx) * (x - lx)))
        const t = Math.round(ly - dy)
        if (x >= 0 && x < COLS && t < top[x]) top[x] = t
      }
    }
    for (let x = sx - 2; x <= sx + span + 2; x++) {
      if (x < 0 || x >= COLS || top[x] === Infinity) continue
      const t0 = top[x]
      for (let y = t0; y <= by; y++) {
        if (y < 0 || y >= ROWS) continue
        let col: string
        if (y - t0 <= 1) col = c.light
        else if (y >= by - 1) col = c.shadow
        else col = c.mid
        if (y === by - 2 && bthr(x, y) > 0.5) col = c.shadow
        g[y][x] = col
      }
    }
  }
}

function ridge(rng: R, base: number, amp: number, rough: number): number[] {
  const pts = new Array<number>(COLS)
  const ph1 = rng() * 6.28
  const ph2 = rng() * 6.28
  const f1 = 1 + rng() * 1.5
  const f2 = 2.5 + rng() * 2.5
  for (let x = 0; x < COLS; x++) {
    pts[x] = base + Math.sin((x / COLS) * Math.PI * f1 + ph1) * amp + Math.sin((x / COLS) * Math.PI * f2 + ph2) * amp * 0.4 + (rng() * 2 - 1) * rough
  }
  return pts
}

function mountains(g: Grid, th: Theme, rng: R, horizonRow: number) {
  const layers = th.mtns
  for (let li = 0; li < layers.length; li++) {
    const base = horizonRow - (layers.length - 1 - li) * Math.round(ROWS * 0.06) - 2
    const amp = Math.round(ROWS * (0.06 + li * 0.03))
    const col = layers[li]
    const pts = ridge(rng, base, amp, li + 1)
    for (let x = 0; x < COLS; x++) {
      const t = Math.round(pts[x])
      for (let y = t; y < horizonRow + 1; y++) set(g, x, y, col)
      set(g, x, t, light(col, 0.18))
    }
  }
}

function forest(g: Grid, th: Theme, rng: R, horizonRow: number) {
  const baseY = horizonRow
  const col = th.forest
  let x = 0
  while (x < COLS) {
    if (rng() > 0.45) {
      const h = 2 + Math.floor(rng() * 5)
      const w = h
      for (let yy = 0; yy < h; yy++) {
        const ww = Math.round((1 - yy / h) * w)
        for (let xx = -ww; xx <= ww; xx++) set(g, x + xx, baseY - h + yy, col)
      }
      set(g, x, baseY - 1, dark(col, 0.2))
      x += Math.max(2, w)
    } else x += 1 + Math.floor(rng() * 3)
  }
  for (let xx = 0; xx < COLS; xx++) set(g, xx, baseY, col)
}

function grass(g: Grid, th: Theme, rng: R, horizonRow: number) {
  const gr = th.grass
  const top = horizonRow + 1
  const H = ROWS - top
  for (let x = 0; x < COLS; x++) {
    const jag = top + (rng() < 0.5 ? 0 : 1)
    for (let y = jag; y < ROWS; y++) {
      const p = (y - jag) / (ROWS - jag)
      g[y][x] = p < 0.18 ? gr.light : p < 0.72 ? gr.mid : gr.dark
    }
    set(g, x, jag - 1, rng() < 0.5 ? gr.dark : gr.mid)
  }
  for (let i = 0; i < COLS * 1.3; i++) {
    const x = Math.floor(rng() * COLS)
    const y = top + Math.floor(rng() * H)
    const len = 1 + Math.floor(rng() * 2)
    for (let k = 0; k < len; k++) set(g, x, y + k, gr.dark)
  }
  for (let i = 0; i < COLS * 0.6; i++) set(g, Math.floor(rng() * COLS), top + Math.floor(rng() * H * 0.6), gr.light)
}

function flowers(g: Grid, th: Theme, rng: R, horizonRow: number) {
  const top = horizonRow + 2
  const H = ROWS - top
  const clusters = Math.round(COLS * 0.16)
  for (let c = 0; c < clusters; c++) {
    const cx = Math.floor(rng() * COLS)
    const cy = top + Math.floor((0.25 + rng() * 0.75) * H)
    const cnt = 2 + Math.floor(rng() * 5)
    for (let i = 0; i < cnt; i++) {
      const x = cx + Math.round((rng() * 2 - 1) * 5)
      const y = cy + Math.round((rng() * 2 - 1) * 3)
      if (y < top + 1) continue
      const p = (y - top) / H
      const col = th.flower[Math.floor(rng() * th.flower.length)]
      set(g, x, y, col)
      if (p > 0.5 && rng() > 0.4) {
        set(g, x + 1, y, col)
        set(g, x, y - 1, light(col, 0.25))
        if (rng() > 0.6) set(g, x, y + 1, th.grass.dark)
      } else if (rng() > 0.6) set(g, x, y - 1, light(col, 0.2))
    }
  }
}

function water(g: Grid, th: Theme, rng: R, horizonRow: number) {
  const waterTop = horizonRow + 1
  for (let y = waterTop; y < ROWS; y++) {
    const srcY = horizonRow - (y - waterTop)
    for (let x = 0; x < COLS; x++) {
      const c = srcY >= 0 ? g[srcY][x] : th.sky[0]
      g[y][x] = mix(c, '#5a6db0', 0.18)
    }
  }
  for (let y = waterTop; y < ROWS; y += 2 + Math.floor(rng() * 2)) {
    for (let x = 0; x < COLS; x++) if ((x + y) % 3 === 0) g[y][x] = light(g[y][x], 0.12)
  }
  for (let x = 0; x < COLS; x++) if (rng() > 0.8) set(g, x, waterTop, th.grass.dark)
}

function build(slug: string, category: CategorySlug): Grid {
  const rng = makeRng(hashString(`${slug}|${category}`))
  const th = THEMES[THEME_NAMES[hashString(`${slug}|theme`) % THEME_NAMES.length]]
  const g = makeGrid()
  const horizonRow = sky(g, th)
  stars(g, th, rng)
  sun(g, th, rng, horizonRow)
  cloudBank(g, th, rng)
  mountains(g, th, rng, horizonRow)
  if (th.water) water(g, th, rng, horizonRow)
  else {
    forest(g, th, rng, horizonRow)
    grass(g, th, rng, horizonRow)
    flowers(g, th, rng, horizonRow)
  }
  return g
}

// ── minimal PNG encoder (truecolour, no alpha) ──
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf: Buffer): number {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function pngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}
function gridToPngDataUri(g: Grid): string {
  const cache = new Map<string, [number, number, number]>()
  const raw = Buffer.alloc(ROWS * (1 + COLS * 3))
  let o = 0
  for (let y = 0; y < ROWS; y++) {
    raw[o++] = 0 // filter: none
    for (let x = 0; x < COLS; x++) {
      const hex = g[y][x]
      let rgb = cache.get(hex)
      if (!rgb) { rgb = hx(hex); cache.set(hex, rgb) }
      raw[o++] = rgb[0]
      raw[o++] = rgb[1]
      raw[o++] = rgb[2]
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(COLS, 0)
  ihdr.writeUInt32BE(ROWS, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // colour type: truecolour
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
  return `data:image/png;base64,${png.toString('base64')}`
}

export default function CoverArt({
  slug,
  category,
  className,
}: {
  slug: string
  category: CategorySlug
  className?: string
}) {
  const href = gridToPngDataUri(build(slug, category))
  return (
    <svg
      className={className}
      viewBox={`0 0 ${COLS} ${ROWS}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href={href}
        x="0"
        y="0"
        width={COLS}
        height={ROWS}
        preserveAspectRatio="xMidYMid slice"
        imageRendering="pixelated"
      />
    </svg>
  )
}
