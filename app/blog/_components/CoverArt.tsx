import { deflateSync } from 'node:zlib'
import type { CategorySlug } from '@/lib/blog/categories'

/**
 * Deterministic generative cover art — detailed PIXEL-ART landscapes.
 *
 * The blog has no photography, so each post gets a unique scene generated
 * from a seed derived from its slug: an "alpine" forest (atmospheric,
 * snow-capped mountain ranges + layered conifers + a flowering meadow) or
 * a "meadow" of rolling hills (a winding path, bushy round trees, and a
 * dense flower field), each in one of a few colour moods. Everything is
 * painted onto a 256×144 cell grid and encoded server-side as a small PNG
 * (via Node's zlib), shown crisp with `image-rendering: pixelated`. A real
 * raster keeps the heavy per-pixel dithering off the DOM. Same slug → same
 * art (SSR-safe, no external image requests).
 */

const COLS = 256
const ROWS = 144

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
const clampByte = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
const toHex = (c: [number, number, number]) => '#' + c.map((v) => clampByte(v).toString(16).padStart(2, '0')).join('')
const mix = (a: string, b: string, t: number): string => {
  const A = hx(a)
  const B = hx(b)
  return toHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t])
}
const light = (c: string, t: number) => mix(c, '#ffffff', t)
const dark = (c: string, t: number) => mix(c, '#15203a', t)

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]
const bthr = (x: number, y: number) => (BAYER[y & 3][x & 3] + 0.5) / 16

type Grid = string[][]
type R = () => number
const makeGrid = (): Grid => Array.from({ length: ROWS }, () => new Array<string>(COLS).fill('#000000'))
const set = (g: Grid, x: number, y: number, c: string) => {
  const xi = Math.round(x)
  const yi = Math.round(y)
  if (yi >= 0 && yi < ROWS && xi >= 0 && xi < COLS) g[yi][xi] = c
}

// ── shared painters ──
function sky(g: Grid, bands: string[], horizon: number) {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const p = Math.min(1, Math.max(0, y / horizon))
      const s = p * (bands.length - 1)
      let i = Math.floor(s)
      if (i >= bands.length - 1) i = bands.length - 2
      g[y][x] = s - i > bthr(x, y) ? bands[i + 1] : bands[i]
    }
  }
}

function clouds(g: Grid, rng: R, cl: { light: string; mid: string; shadow: string }, yMin: number, yMax: number, count: number) {
  for (let k = 0; k < count; k++) {
    const by = Math.round(yMin + rng() * (yMax - yMin))
    const span = Math.round(COLS * (0.16 + rng() * 0.3))
    const sx = Math.round(rng() * (COLS - span))
    const lobes = 4 + Math.floor(rng() * 5)
    const top = new Array<number>(COLS).fill(Infinity)
    for (let l = 0; l < lobes; l++) {
      const lx = sx + Math.round((l / (lobes - 1)) * span) + Math.round((rng() * 2 - 1) * 6)
      const lr = 4 + Math.round(rng() * 7)
      const ly = by - Math.round(lr * 0.55) - Math.round(rng() * 3)
      for (let x = lx - lr; x <= lx + lr; x++) {
        const dy = Math.sqrt(Math.max(0, lr * lr - (x - lx) * (x - lx)))
        const t = Math.round(ly - dy)
        if (x >= 0 && x < COLS && t < top[x]) top[x] = t
      }
    }
    for (let x = sx - 3; x <= sx + span + 3; x++) {
      if (x < 0 || x >= COLS || top[x] === Infinity) continue
      for (let y = top[x]; y <= by; y++) {
        if (y < 0 || y >= ROWS) continue
        const d = y - top[x]
        let c = d <= 1 ? cl.light : y >= by - 1 ? cl.shadow : cl.mid
        if (y === by - 2 && bthr(x, y) > 0.6) c = cl.shadow
        if (d === 0 && bthr(x, y) > 0.7) continue // soft fluffy top edge
        g[y][x] = c
      }
    }
  }
}

function ridgeLine(rng: R, base: number, amp: number, rough: number): number[] {
  const p = new Array<number>(COLS)
  const ph1 = rng() * 6.28
  const ph2 = rng() * 6.28
  const ph3 = rng() * 6.28
  const f1 = 0.7 + rng()
  const f2 = 2 + rng() * 2
  const f3 = 4 + rng() * 3
  for (let x = 0; x < COLS; x++) {
    p[x] = base + Math.sin((x / COLS) * Math.PI * f1 + ph1) * amp + Math.sin((x / COLS) * Math.PI * f2 + ph2) * amp * 0.45 + Math.sin((x / COLS) * Math.PI * f3 + ph3) * amp * 0.2 + (rng() * 2 - 1) * rough
  }
  return p
}

function range(g: Grid, rng: R, baseRow: number, horizon: number, amp: number, rough: number, base: string, snow: boolean) {
  const r = ridgeLine(rng, baseRow, amp, rough)
  let minT = Infinity
  let maxT = -Infinity
  for (let x = 0; x < COLS; x++) {
    minT = Math.min(minT, r[x])
    maxT = Math.max(maxT, r[x])
  }
  const hi = light(base, 0.16)
  const lo = dark(base, 0.16)
  for (let x = 0; x < COLS; x++) {
    const top = Math.round(r[x])
    const peak = top < minT + (maxT - minT) * 0.42
    for (let y = top; y <= horizon; y++) {
      const d = y - top
      const span = Math.max(1, horizon - top)
      let c: string
      if (d === 0) c = hi
      else if (snow && peak && d <= 2 + Math.round((1 - (top - minT) / Math.max(1, maxT - minT)) * 3)) c = '#EAF0FA'
      else {
        c = mix(base, lo, (d / span) * 0.7)
        if (y % 3 === 0) c = light(c, 0.05)
      }
      set(g, x, y, c)
    }
  }
}

type Conifer = { trunk: string; dark: string; mid: string; lite: string }
function pine(g: Grid, cx: number, baseY: number, ht: number, pal: Conifer) {
  const trunkH = Math.max(2, Math.round(ht * 0.12))
  for (let y = baseY; y > baseY - trunkH; y--) {
    set(g, cx, y, pal.trunk)
    if (ht > 22) set(g, cx - 1, y, dark(pal.trunk, 0.2))
  }
  const topY = baseY - ht
  const tiers = Math.max(4, Math.round(ht / 7))
  const wMax = Math.max(3, Math.round(ht * 0.42))
  for (let t = 0; t < tiers; t++) {
    const y0 = Math.round(topY + (t / tiers) * ht * 0.9)
    const y1 = Math.round(topY + ((t + 1) / tiers) * ht * 0.9)
    const wB = Math.max(1, Math.round(wMax * (0.3 + (0.7 * (t + 1)) / tiers)))
    for (let y = y0; y <= y1; y++) {
      const f = (y - y0) / Math.max(1, y1 - y0)
      const rw = Math.max(0, Math.round(wB * Math.min(1, 0.25 + f)))
      for (let xx = -rw; xx <= rw; xx++) {
        const e = xx / Math.max(1, rw)
        let c = pal.mid
        if (e < -0.4) c = pal.lite
        else if (e > 0.5) c = pal.dark
        if (f > 0.82) c = pal.dark
        set(g, cx + xx, y, c)
      }
    }
  }
  set(g, cx, topY, pal.mid)
  set(g, cx, topY - 1, pal.lite)
}

function bush(g: Grid, rng: R, cx: number, cy: number, r: number, pal: Conifer) {
  const occ = Array.from({ length: ROWS }, () => new Int8Array(COLS))
  const lobes = 5 + Math.floor(rng() * 4)
  for (let l = 0; l < lobes; l++) {
    const lx = cx + Math.round((rng() * 2 - 1) * r * 0.85)
    const ly = cy + Math.round((rng() * 2 - 1) * r * 0.55)
    const lr = r * (0.45 + rng() * 0.55)
    for (let y = Math.floor(ly - lr); y <= ly + lr; y++) {
      for (let x = Math.floor(lx - lr); x <= lx + lr; x++) {
        if (y < 0 || y >= ROWS || x < 0 || x >= COLS) continue
        if ((x - lx) ** 2 + (y - ly) ** 2 <= lr * lr) occ[y][x] = 1
      }
    }
  }
  for (let y = cy + Math.round(r * 0.4); y < cy + r; y++) set(g, cx, y, pal.trunk)
  let minY = ROWS
  let maxY = 0
  const cells: [number, number][] = []
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (occ[y][x]) {
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
    cells.push([x, y])
  }
  for (const [x, y] of cells) {
    const t = (y - minY) / Math.max(1, maxY - minY)
    let c = t < 0.35 ? pal.lite : t < 0.72 ? pal.mid : pal.dark
    if (rng() > 0.78) c = t < 0.5 ? light(pal.lite, 0.12) : dark(pal.dark, 0.12)
    set(g, x, y, c)
  }
}

type Hill = { base: number; amp: number; rough: number; col: string; dark: string }
function hills(g: Grid, rng: R, specs: Hill[]) {
  for (const sp of specs) {
    const r = ridgeLine(rng, sp.base, sp.amp, sp.rough)
    for (let x = 0; x < COLS; x++) {
      const top = Math.round(r[x])
      for (let y = top; y < ROWS; y++) {
        const t = (y - top) / Math.max(1, ROWS - top)
        g[y][x] = t < 0.5 ? sp.col : mix(sp.col, sp.dark, (t - 0.5) * 1.3)
      }
      set(g, x, top, light(sp.col, 0.12))
    }
  }
}

function path(g: Grid, rng: R, col: string, startX: number, fromY: number, toY: number) {
  let x = startX
  for (let y = fromY; y > toY; y--) {
    const w = Math.max(1, Math.round(((y - toY) / (fromY - toY)) * 5) + 1)
    for (let xx = -w; xx <= w; xx++) {
      const e = Math.abs(xx) / w
      set(g, x + xx, y, e > 0.7 ? dark(col, 0.15) : e < 0.3 ? light(col, 0.1) : col)
    }
    x += (rng() * 2 - 1) * 1.1
  }
}

function flowerField(g: Grid, rng: R, top: number, cols: string[], density: number) {
  const clusters = Math.round(COLS * density)
  for (let c = 0; c < clusters; c++) {
    const cx = Math.floor(rng() * COLS)
    const cy = top + Math.floor((0.2 + rng() * 0.8) * (ROWS - top))
    const n = 3 + Math.floor(rng() * 6)
    for (let i = 0; i < n; i++) {
      const x = cx + Math.round((rng() * 2 - 1) * 6)
      const y = cy + Math.round((rng() * 2 - 1) * 4)
      if (y < top) continue
      const col = cols[Math.floor(rng() * cols.length)]
      set(g, x, y, col)
      const p = (y - top) / (ROWS - top)
      if (p > 0.45 && rng() > 0.4) {
        set(g, x + 1, y, col)
        set(g, x, y - 1, light(col, 0.3))
        if (rng() > 0.5) set(g, x - 1, y, dark(col, 0.1))
      } else if (rng() > 0.6) set(g, x, y - 1, light(col, 0.25))
    }
  }
}

function grassFG(g: Grid, rng: R, top: number, gr: { light: string; mid: string; dark: string }) {
  for (let x = 0; x < COLS; x++) {
    const jag = top + (rng() < 0.5 ? 0 : 1)
    for (let y = jag; y < ROWS; y++) {
      const p = (y - jag) / (ROWS - jag)
      g[y][x] = p < 0.2 ? gr.light : p < 0.7 ? gr.mid : gr.dark
    }
    set(g, x, jag - 1, rng() < 0.5 ? gr.dark : gr.mid)
  }
  for (let i = 0; i < COLS * 2; i++) {
    const x = Math.floor(rng() * COLS)
    const y = top + Math.floor(rng() * (ROWS - top))
    const len = 1 + Math.floor(rng() * 2)
    for (let k = 0; k < len; k++) set(g, x, y + k, gr.dark)
  }
  for (let i = 0; i < COLS; i++) set(g, Math.floor(rng() * COLS), top + Math.floor(rng() * (ROWS - top) * 0.6), gr.light)
}

// ── moods (sky / cloud / accent palettes) ──
const ALPINE_MOODS = [
  { sky: ['#9FB3E0', '#AEBEE6', '#C9C7E8', '#E7CFE0', '#F3D9D6', '#F7E6D8'], cloud: { light: '#FBF1E8', mid: '#F2D9D4', shadow: '#D9B6C4' }, flowers: ['#E8A23A', '#F2C84A', '#E8718A'] },
  { sky: ['#7FB7E6', '#9AC6EC', '#C2D8EE', '#DCE6F4', '#EAD6E8', '#F3E2DE'], cloud: { light: '#FFFFFF', mid: '#E6EEF8', shadow: '#C7D2E8' }, flowers: ['#F2C84A', '#FFFFFF', '#E8718A'] },
  { sky: ['#6E6FB8', '#9472C0', '#C77FB0', '#E89A92', '#F4B782', '#F7CE8E'], cloud: { light: '#FBE0D0', mid: '#EBB2B4', shadow: '#C98AA4' }, flowers: ['#F2C84A', '#E8718A', '#FFFFFF'] },
]
const MEADOW_MOODS = [
  { sky: ['#79C2EA', '#92CBEC', '#BFD3EE', '#E9C9E2', '#F2D2E6', '#F7DEEC'], cloud: { light: '#FFFFFF', mid: '#F3CFE6', shadow: '#DCA7D0' }, flowers: ['#9B6FD0', '#E58FC0', '#C77FE0', '#F2C0DE'] },
  { sky: ['#86C8E8', '#A6D4EC', '#CFE0F0', '#E8E0F2', '#F0D6EA', '#F6E2EE'], cloud: { light: '#FFFFFF', mid: '#E8DAF2', shadow: '#C8B2E0' }, flowers: ['#E26A8A', '#F2A6C2', '#FFFFFF', '#9B6FD0'] },
]

function alpine(g: Grid, rng: R, mood: (typeof ALPINE_MOODS)[number]) {
  const horizon = Math.round(ROWS * 0.66)
  sky(g, mood.sky, horizon)
  clouds(g, rng, mood.cloud, ROWS * 0.08, ROWS * 0.32, 5)
  range(g, rng, horizon - Math.round(ROWS * 0.2), horizon, ROWS * 0.09, 1, '#C2BEE2', true)
  range(g, rng, horizon - Math.round(ROWS * 0.12), horizon, ROWS * 0.08, 1.5, '#9AA6D2', true)
  range(g, rng, horizon - Math.round(ROWS * 0.05), horizon, ROWS * 0.07, 2, '#6E86B0', false)
  range(g, rng, horizon + Math.round(ROWS * 0.02), horizon + 6, ROWS * 0.05, 2, '#4E6E8E', false)
  const gtop = horizon
  grassFG(g, rng, gtop, { light: '#5E9A52', mid: '#3E7A44', dark: '#1E3A2A' })
  flowerField(g, rng, gtop + 2, mood.flowers, 0.14)
  for (let i = 0; i < 7; i++) pine(g, COLS * (0.06 + i * 0.13) + (rng() * 2 - 1) * 6, gtop + 2 + rng() * 3, 14 + rng() * 8, { trunk: '#33271f', dark: '#244a36', mid: '#356f49', lite: '#4d8a55' })
  pine(g, COLS * 0.12, gtop + 10, 30, { trunk: '#3a2a22', dark: '#1F4030', mid: '#2E6A44', lite: '#4F9A58' })
  pine(g, COLS * 0.9, gtop + 12, 34, { trunk: '#3a2a22', dark: '#1F4030', mid: '#2E6A44', lite: '#4F9A58' })
}

function meadow(g: Grid, rng: R, mood: (typeof MEADOW_MOODS)[number]) {
  const horizon = Math.round(ROWS * 0.5)
  sky(g, mood.sky, horizon)
  clouds(g, rng, mood.cloud, ROWS * 0.05, ROWS * 0.3, 5)
  range(g, rng, horizon - Math.round(ROWS * 0.08), horizon + Math.round(ROWS * 0.04), ROWS * 0.05, 1.5, '#A9B0DE', false)
  range(g, rng, horizon - Math.round(ROWS * 0.02), horizon + Math.round(ROWS * 0.08), ROWS * 0.045, 2, '#94A0D6', false)
  hills(g, rng, [
    { base: horizon + ROWS * 0.06, amp: ROWS * 0.04, rough: 1.2, col: '#8FC25C', dark: '#4E7E3A' },
    { base: horizon + ROWS * 0.14, amp: ROWS * 0.05, rough: 1.5, col: '#6FA84A', dark: '#3E6E32' },
    { base: horizon + ROWS * 0.24, amp: ROWS * 0.06, rough: 2, col: '#56933E', dark: '#2E5828' },
  ])
  path(g, rng, '#CBB98C', COLS * 0.5, ROWS * 0.98, horizon + ROWS * 0.1)
  flowerField(g, rng, horizon + Math.round(ROWS * 0.34), mood.flowers, 0.3)
  bush(g, rng, COLS * 0.12, ROWS * 0.55, 16, { trunk: '#5a4632', dark: '#244e7e', mid: '#3168a8', lite: '#5b97c8' })
  bush(g, rng, COLS * 0.8, ROWS * 0.62, 12, { trunk: '#5a4632', dark: '#2e6a44', mid: '#3f8a52', lite: '#67b27e' })
  bush(g, rng, COLS * 0.66, ROWS * 0.58, 9, { trunk: '#5a4632', dark: '#2e6a44', mid: '#3f8a52', lite: '#67b27e' })
}

function build(slug: string, category: CategorySlug): Grid {
  const rng = makeRng(hashString(`${slug}|${category}`))
  const g = makeGrid()
  if (hashString(`${slug}|scene`) % 2 === 0) {
    alpine(g, rng, ALPINE_MOODS[hashString(`${slug}|mood`) % ALPINE_MOODS.length])
  } else {
    meadow(g, rng, MEADOW_MOODS[hashString(`${slug}|mood`) % MEADOW_MOODS.length])
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
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
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
      if (!rgb) {
        rgb = hx(hex)
        cache.set(hex, rgb)
      }
      raw[o++] = rgb[0]
      raw[o++] = rgb[1]
      raw[o++] = rgb[2]
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(COLS, 0)
  ihdr.writeUInt32BE(ROWS, 4)
  ihdr[8] = 8
  ihdr[9] = 2
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
  const src = gridToPngDataUri(build(slug, category))
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      alt=""
      aria-hidden="true"
      decoding="async"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', imageRendering: 'pixelated' }}
    />
  )
}
