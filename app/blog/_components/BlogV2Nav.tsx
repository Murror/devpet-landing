'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Locale } from '@/lib/site'
import { blogIndexPath } from '@/lib/blog/format'
import en from '@/lib/i18n/en.json'
import vi from '@/lib/i18n/vi.json'

/**
 * Blog top nav — reuses the landing's `.v2-nav` markup and styles so it
 * looks identical to the main site (white sticky bar, centered pixel
 * wordmark, uppercase links, red CTA pill, mobile hamburger).
 *
 * Differences from the landing Nav, all because the blog is a separate,
 * locale-fixed surface:
 *   - Section links point at the home page (`/#product`) instead of
 *     in-page anchors, so they work from any blog route.
 *   - The language control is a real link to the mirror URL in the
 *     other locale (`altHref`) rather than an in-memory toggle, so it
 *     actually switches the blog's language.
 *   - Labels come from the route locale, not IP detection.
 *
 * We keep it lightweight: no headroom hide-on-scroll JS (the CSS makes
 * it sticky); only the mobile menu needs state.
 */
export default function BlogV2Nav({
  locale,
  altHref,
}: {
  locale: Locale
  altHref: string
}) {
  const t = (locale === 'vi' ? vi : en).v2.nav
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  const otherLang = locale === 'en' ? 'vi' : 'en'
  const otherLangName = otherLang === 'vi' ? 'Tiếng Việt' : 'English'

  return (
    <nav className={`v2-nav${menuOpen ? ' v2-nav--menu-open' : ''}`} aria-label={t.primaryAria}>
      <div className="v2-nav-inner v2-nav-inner--enter">
        <button
          type="button"
          className="v2-nav-hamburger"
          aria-label={menuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={menuOpen}
          aria-controls="blog-nav-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <ul id="blog-nav-menu" className="v2-nav-links">
          <li>
            <Link href="/#product" className="v2-nav-link" onClick={close}>{t.product}</Link>
          </li>
          <li>
            <Link href="/#get-good" className="v2-nav-link" onClick={close}>{t.getGood}</Link>
          </li>
          <li>
            <Link href="/#skill-trees" className="v2-nav-link" onClick={close}>{t.skillTree}</Link>
          </li>
          <li>
            <Link href={blogIndexPath(locale)} className="v2-nav-link" onClick={close}>{t.blog}</Link>
          </li>
        </ul>

        <Link href="/" className="v2-nav-wordmark" aria-label={t.homeAria} onClick={close}>
          <Image
            src="/v2/codepet-wordmark.png"
            alt={t.wordmarkAlt}
            width={1215}
            height={240}
            priority
            unoptimized
          />
        </Link>

        <div className="v2-nav-right">
          {/* Globe links to the same content in the other language. */}
          <Link
            href={altHref}
            className="v2-nav-lang-globe"
            hrefLang={otherLang}
            aria-label={`Switch language (currently ${locale.toUpperCase()})`}
            title={otherLangName}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              width="24"
              height="24"
            >
              <circle cx="12" cy="12" r="10" />
              <ellipse cx="12" cy="12" rx="4" ry="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </Link>
          <Link href="/#product" className="v2-nav-cta" onClick={close}>
            <span className="v2-nav-cta-body">{t.startJourney}</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
