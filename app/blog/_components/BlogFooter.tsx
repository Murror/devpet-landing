import Link from 'next/link'
import type { Locale } from '@/lib/site'
import { localePrefix } from '@/lib/site'
import { blogIndexPath } from '@/lib/blog/format'
import { blogStrings } from '@/lib/blog/ui-strings'

export default function BlogFooter({ locale }: { locale: Locale }) {
  const s = blogStrings(locale)
  const home = localePrefix(locale) || '/'
  return (
    <footer className="blog-footer">
      <div className="blog-footer-inner">
        <span>© 2026 Codepet · MURROR</span>
        <nav aria-label="Footer">
          <Link href={home}>{s.brandHome}</Link>
          {' · '}
          <Link href={blogIndexPath(locale)}>Blog</Link>
          {' · '}
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  )
}
