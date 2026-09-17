import Link from 'next/link'
import type { Locale } from '@/lib/site'
import { CATEGORIES } from '@/lib/blog/categories'
import { blogIndexPath, categoryPath } from '@/lib/blog/format'
import { blogStrings } from '@/lib/blog/ui-strings'

/**
 * Topic filter row — frosted glass pills on the dark hero. "All
 * articles" returns to the index; each pillar links to its
 * `/blog/category/<slug>` page. Every category keeps its own hue as a
 * leading dot + hover glow (`data-category` drives the colour in CSS);
 * the active pill fills with the byte-purple gradient.
 */
export default function CategoryChips({
  locale,
  activeSlug = 'all',
}: {
  locale: Locale
  activeSlug?: string
}) {
  const s = blogStrings(locale)
  return (
    <nav className="bx-chips" aria-label={s.browseTopics}>
      <Link
        href={blogIndexPath(locale)}
        className="bx-chip"
        data-active={activeSlug === 'all'}
      >
        {s.allTopics}
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={categoryPath(locale, c.slug)}
          className="bx-chip"
          data-category={c.slug}
          data-active={activeSlug === c.slug}
        >
          <span className="bx-chip-dot" />
          {c.label[locale]}
        </Link>
      ))}
    </nav>
  )
}
