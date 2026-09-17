'use client'

import { Children, useState, type ReactNode } from 'react'

/**
 * "Load more" wrapper for the compact tile grid. Every tile is rendered on
 * the server (so the server-only CoverArt works and every post link stays
 * in the DOM for SEO); this only collapses the list to `step` tiles and
 * reveals `step` more on each click — no data refetch, just visibility.
 */
export default function MoreGrid({
  children,
  step = 9,
  moreLabel,
}: {
  children: ReactNode
  step?: number
  moreLabel: string
}) {
  const items = Children.toArray(children)
  const [shown, setShown] = useState(Math.min(step, items.length))
  const remaining = items.length - shown

  return (
    <>
      <div className="bx-tilegrid">
        {items.map((child, i) => (
          <div key={i} className="bx-tile-cell" hidden={i >= shown}>
            {child}
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <div className="bx-more-wrap">
          <button
            type="button"
            className="bx-more-btn"
            onClick={() => setShown((n) => Math.min(n + step, items.length))}
          >
            {moreLabel}
            <span className="bx-more-count">{remaining}</span>
          </button>
        </div>
      )}
    </>
  )
}
