import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/site'
import { blogIndexPath } from '@/lib/blog/format'
import en from '@/lib/i18n/en.json'
import vi from '@/lib/i18n/vi.json'

/**
 * Blog footer — reuses the landing's `.v2-footer` markup/styles (white
 * band, pixel "C" logo, Open Sans nav row) so it matches the main site.
 * Like the nav, section links point at the home page and the labels
 * follow the route locale.
 */
export default function BlogV2Footer({ locale }: { locale: Locale }) {
  const m = locale === 'vi' ? vi : en
  const nav = m.v2.nav
  const footer = m.v2.footer

  const links = [
    { label: nav.home, href: '/' },
    { label: nav.product, href: '/#product' },
    { label: nav.getGood, href: '/#get-good' },
    { label: nav.skillTree, href: '/#skill-trees' },
    { label: nav.blog, href: blogIndexPath(locale) },
  ]

  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-brand">
          <Image
            src="/v2/logo/codepet-c.png"
            alt={footer.wordmarkAlt}
            width={192}
            height={240}
            unoptimized
            className="v2-footer-logo"
          />
          <p className="v2-footer-copyright">{footer.copyright}</p>
        </div>

        <nav className="v2-footer-nav" aria-label={footer.navAria}>
          <ul className="v2-footer-links">
            {links.map((link) => (
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
