import Link from 'next/link'
import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { postPath, formatDate, formatReadingTime } from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'
import CoverArt from './CoverArt'

/**
 * Compact article tile — the scannable long-tail listing beneath the
 * featured lead + zigzag highlights. Cover (or the generative CoverArt
 * fallback) on top, a category eyebrow, a clamped title, and date ·
 * reading time. Category hue drives the eyebrow + hover glow via
 * `data-category` (→ --cat). Server component (CoverArt encodes a PNG
 * server-side); it's rendered on the server and handed to MoreGrid.
 */
export default function PostTile({
  post,
  locale,
}: {
  post: PostMeta
  locale: Locale
}) {
  const category = getCategory(post.category)
  const href = postPath(locale, post.slug)

  return (
    <Link href={href} className="bx-tile" data-category={post.category}>
      <div className="bx-tile-cover">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.coverAlt || ''} loading="lazy" />
        ) : (
          <CoverArt slug={post.slug} category={post.category} />
        )}
        <div className="bx-tile-scrim" aria-hidden="true" />
      </div>
      <div className="bx-tile-body">
        {category && (
          <span className="bx-eyebrow" data-category={post.category}>
            {category.label[locale]}
          </span>
        )}
        <h3 className="bx-tile-title">{post.title}</h3>
        <div className="bx-meta">
          <span>{formatDate(post.date, locale)}</span>
          <span className="bx-dot" />
          <span>{formatReadingTime(post.readingMinutes, locale)}</span>
        </div>
      </div>
    </Link>
  )
}
