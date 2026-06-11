import Link from 'next/link'
import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { postPath, formatDate, formatReadingTime } from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'
import CoverArt from './CoverArt'

const ACCENT_CLASS: Record<string, string> = {
  primary: 'blog-accent-primary',
  info: 'blog-accent-info',
  premium: 'blog-accent-premium',
}

/** Large lead story: text panel on the left, big cover art on the right. */
export default function FeaturedCard({
  post,
  locale,
}: {
  post: PostMeta
  locale: Locale
}) {
  const category = getCategory(post.category)
  const accentClass = category ? ACCENT_CLASS[category.accent] : ''

  return (
    <Link href={postPath(locale, post.slug)} className="blog-featured">
      <div className="blog-featured-text">
        {category && (
          <span className={`blog-featured-cat ${accentClass}`}>
            {category.label[locale]}
          </span>
        )}
        <h2 className="blog-featured-title">{post.title}</h2>
        <p className="blog-featured-excerpt">{post.description}</p>
        <div className="blog-card-meta">
          <span>{formatDate(post.date, locale)}</span>
          <span className="blog-dot" />
          <span>{formatReadingTime(post.readingMinutes, locale)}</span>
        </div>
      </div>
      <div className="blog-featured-cover">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.coverAlt || ''} />
        ) : (
          <CoverArt slug={post.slug} category={post.category} />
        )}
      </div>
    </Link>
  )
}
