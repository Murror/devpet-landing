'use client'

import { useState } from 'react'
import { NAV } from '../content'

/**
 * Nav — a floating frosted pill, centred at the top.
 * Minimal by design (less-is-more): brand, a few anchors, and the
 * single "Join our Discord" CTA linking to the community invite.
 *
 * On phones (≤760px) the inline links + CTA collapse into a hamburger
 * that opens a frosted drawer below the pill, so the section anchors and
 * the CTA stay reachable on touch.
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
