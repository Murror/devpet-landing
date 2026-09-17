'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * Footer — Section 10 of the /v2 landing.
 *
 * Blue (#1C40CF) band matching the tier-4 "Expert" color from the
 * Skill Tree palette. Simplified layout per brief:
 *   - Pixel-art "C" logo on the left
 *   - Single inline row of the same 4 section links used by the
 *     primary nav (Home, Product, Get Good, Skill Tree)
 *   - "© 2026 All right reserved" copy below the C
 *
 * Previous layout had a second column of social-media links (X,
 * Youtube, Instagram, Contra) plus /works /about /contact routes.
 * Both groups are removed — footer mirrors the top nav only.
 *
 * Strings come from `t.v2.footer` and `t.v2.nav` so the labels track
 * whichever locale LocaleProvider has selected.
 */

export default function Footer() {
  const { t, locale } = useLocale()

  // Labels come from the same v2.nav namespace the top Nav reads from
  // — keeps the footer link text in lockstep with the header. Blog is a
  // real route (locale-matched); the rest are in-page anchors.
  const navLinks = [
    { label: t.v2.nav.home, href: '#top' },
    { label: t.v2.nav.product, href: '#product' },
    { label: t.v2.nav.getGood, href: '#get-good' },
    { label: t.v2.nav.skillTree, href: '#skill-trees' },
    { label: t.v2.nav.blog, href: locale === 'vi' ? '/vi/blog' : '/blog' },
  ]

  return (
    <footer id="footer" className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-brand">
          {/* Logo PNG at /public/v2/logo/codepet-c.png. Intrinsic
              width/height match the sprite's native 4:5 pixel
              ratio; displayed size is handled by .v2-footer-logo. */}
          <Image
            src="/v2/logo/codepet-c.png"
            alt={t.v2.footer.wordmarkAlt}
            width={192}
            height={240}
            unoptimized
            className="v2-footer-logo"
          />
          <p className="v2-footer-copyright">{t.v2.footer.copyright}</p>
        </div>

        <nav className="v2-footer-nav" aria-label={t.v2.footer.navAria}>
          <ul className="v2-footer-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="v2-footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
