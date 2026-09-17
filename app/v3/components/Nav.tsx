'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NAV } from '../content'
import { useReleaseAvailable } from '@/lib/useReleaseAvailable'
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
 * A "Download" entry appears here once a build is actually published. Until then the
 * product has nothing to hand over and the hero's waitlist is the honest ask — but /download
 * was reachable ONLY by typing the URL, which is the same as not existing. This is the
 * standing way in, and it costs no deploy: the day a release is cut, the link appears.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const { released } = useReleaseAvailable()

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
        {released && (
          <Link href={DOWNLOAD_PAGE} className="v3-nav-link">
            Download
          </Link>
        )}
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
          {released && (
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
          )}
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
