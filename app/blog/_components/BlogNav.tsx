'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Locale } from '@/lib/site'
import { blogIndexPath } from '@/lib/blog/format'
import { DISCORD_INVITE } from '../../v3/content'

/**
 * BlogNav — the site's cinematic-dark floating frosted pill, adapted for
 * the blog. Matches the main landing's `.v3-nav` exactly (brand → home,
 * section anchors, purple "Join our Discord" CTA) with two
 * blog-specific additions:
 *   - "Blog" is the active route (it links to this locale's index).
 *   - an EN/VI globe that switches the article/locale (the blog is
 *     bilingual; the landing is English-only), pointed at `altHref`.
 *
 * Section links target the homepage anchors (`/#loop` …) so they work
 * from any blog route. On ≤760px everything collapses into a frosted
 * drawer, same as the landing.
 */
const SECTIONS = [
  { label: 'How it works', href: '/#loop' },
  { label: 'Setup', href: '/#environment' },
  { label: 'Departments', href: '/#departments' },
  { label: 'Journey', href: '/#journey' },
]

export default function BlogNav({
  locale,
  altHref,
}: {
  locale: Locale
  altHref: string
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const otherLang = locale === 'en' ? 'vi' : 'en'
  const otherLangName = otherLang === 'vi' ? 'Tiếng Việt' : 'English'

  const Globe = (
    <Link
      href={altHref}
      className="bx-nav-globe"
      hrefLang={otherLang}
      aria-label={`Switch language (currently ${locale.toUpperCase()})`}
      title={otherLangName}
      onClick={close}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        width="18"
        height="18"
      >
        <circle cx="12" cy="12" r="10" />
        <ellipse cx="12" cy="12" rx="4" ry="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    </Link>
  )

  return (
    <div className={`v3-nav-wrap${open ? ' is-open' : ''}`}>
      <nav className="v3-nav" aria-label="Primary">
        <Link href="/" className="v3-nav-brand" onClick={close}>
          Codepet
        </Link>
        <ul className="v3-nav-links">
          {SECTIONS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="v3-nav-link" onClick={close}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={blogIndexPath(locale)}
              className="v3-nav-link is-active"
              aria-current="page"
              onClick={close}
            >
              Blog
            </Link>
          </li>
        </ul>
        {Globe}
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="v3-nav-cta"
        >
          Join our Discord
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
          {SECTIONS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="v3-nav-menu-link"
                tabIndex={open ? 0 : -1}
                onClick={close}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={blogIndexPath(locale)}
              className="v3-nav-menu-link is-active"
              aria-current="page"
              tabIndex={open ? 0 : -1}
              onClick={close}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href={altHref}
              className="v3-nav-menu-link"
              hrefLang={otherLang}
              tabIndex={open ? 0 : -1}
              onClick={close}
            >
              {otherLangName}
            </Link>
          </li>
        </ul>
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="v3-nav-menu-cta"
          tabIndex={open ? 0 : -1}
          onClick={close}
        >
          Join our Discord
        </a>
      </div>
    </div>
  )
}
