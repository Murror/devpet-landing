import Link from 'next/link'
import type { Locale } from '@/lib/site'
import { blogIndexPath } from '@/lib/blog/format'

/**
 * BlogFooter — the site's cinematic-dark `.v3-footer` (pixel brand,
 * hairline top rule, muted links) instead of the old white v2 band, so
 * the blog closes the same way the landing does. Section links point at
 * the homepage anchors; "Blog" stays on this locale's index.
 */
export default function BlogFooter({ locale }: { locale: Locale }) {
  const tagline =
    locale === 'vi'
      ? 'Ghi chép thực chiến từ hành trình xây dựng cùng AI.'
      : 'Field notes from building with AI, in the open.'

  const links = [
    { label: locale === 'vi' ? 'Trang chủ' : 'Home', href: '/' },
    { label: locale === 'vi' ? 'Cách hoạt động' : 'How it works', href: '/#loop' },
    { label: 'Blog', href: blogIndexPath(locale) },
  ]

  const year = 2026

  return (
    <footer className="v3-footer bx-footer">
      <div className="bx-footer-brand-wrap">
        <div className="v3-footer-brand">Codepet</div>
        <p className="v3-footer-tag">{tagline}</p>
      </div>
      <ul className="v3-footer-links">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
      <p className="v3-footer-copy">
        © {year} Codepet · {locale === 'vi' ? 'Xây bởi Outcasts' : 'Built by Outcasts'}
      </p>
    </footer>
  )
}
