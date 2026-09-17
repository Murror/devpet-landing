'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NAV } from '../content'
import { DOWNLOAD_PAGE } from '@/lib/download'

/**
 * Nav — a floating frosted pill, centred at the top.
 * Minimal by design (less-is-more): brand, a few anchors, and the
 * single "Join our Discord" CTA linking to the community invite.
 *
 * On phones (≤760px) the inline links + CTA collapse into a hamburger
 * that opens a frosted drawer below the pill, so the section anchors and
 * the CTA stay reachable on touch.
 *
 * The "Download" entry is ALWAYS here. It was gated on a build existing, which meant that
 * while the product was pre-launch the site had no visible way to reach /download at all —
 * and the founder's reaction to that was exactly the right one: "where is my download
 * button?". A nav entry is navigation, not a promise. The page it leads to is where the
 * honest answer lives, and that page already gives one: the public build's state, and the
 * internal test build when there is one.
 *
 * The HERO cta stays gated, and that distinction is the point. A hero button saying
 * "Download for macOS" when nothing can be downloaded IS a promise, and a broken one.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <div className={`v3-nav-wrap${open ? ' is-open' : ''}`}>
      <nav className="v3-nav" aria-label="Primary">
        <a href="#top" className="v3-nav-brand" onClick={() => setOpen(false)}>
          {NAV.brand}
        </a>
        <ul className="v3-nav-links">
          {NAV.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="v3-nav-link">{l.label}</a>
            </li>
          ))}
        </ul>
        <Link href={DOWNLOAD_PAGE} className="v3-nav-link">
          Download
        </Link>
        <a
          href={NAV.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="v3-nav-cta"
        >
          {NAV.cta}
        </a>
        <button
          type="button"
          className="v3-nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      <div className="v3-nav-menu" aria-hidden={!open}>
        <ul className="v3-nav-menu-links">
          <li>
            <Link
              href={DOWNLOAD_PAGE}
              className="v3-nav-menu-link"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              Download
            </Link>
          </li>
          {NAV.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="v3-nav-menu-link"
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={NAV.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="v3-nav-menu-cta"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          {NAV.cta}
        </a>
      </div>
    </div>
  )
}
