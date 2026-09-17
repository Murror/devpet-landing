'use client'

/**
 * Connectors signature — a living node-graph. Service nodes sit across the
 * hero; light beams flow along the edges between them (animated stroke
 * dashes), and each node pulses. Reads as "your tools, wired together."
 * Pure SVG + CSS animation (GPU-cheap, transform/opacity only); freezes
 * under reduced-motion. The colour comes from the panel accent (--c).
 */
const NODES = [
  { x: 130, y: 150 }, // 0
  { x: 340, y: 90 },  // 1
  { x: 500, y: 240 }, // 2  (hub)
  { x: 720, y: 130 }, // 3
  { x: 880, y: 300 }, // 4
  { x: 300, y: 340 }, // 5
  { x: 630, y: 400 }, // 6
  { x: 150, y: 470 }, // 7
  { x: 820, y: 500 }, // 8
]
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 2],
  [2, 6], [6, 8], [5, 7], [6, 4], [7, 6], [1, 5],
]

export default function ConnectorsFX() {
  return (
    <svg
      className="sp-cx"
      viewBox="0 0 1000 620"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="sp-cx-edges">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            style={{ animationDelay: `${(i % 6) * 0.45}s` }}
          />
        ))}
      </g>
      <g className="sp-cx-nodes">
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x} cy={n.y}
            r={i === 2 ? 7 : 4.5}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
