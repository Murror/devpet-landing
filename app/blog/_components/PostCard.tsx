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

export default function PostCard({
  post,
  locale,
}: {
  post: PostMeta
  locale: Locale
}) {
  const category = getCategory(post.category)
  const accentClass = category ? ACCENT_CLASS[category.accent] : ''

  return (
    <Link href={postPath(locale, post.slug)} className="blog-card" data-category={post.category}>
      <div className="blog-card-cover">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.coverAlt || ''} loading="lazy" />
        ) : (
          <CoverArt slug={post.slug} category={post.category} />
        )}
        {category && (
          <span className={`blog-card-badge ${accentClass}`}>
            {category.label[locale]}
          </span>
        )}
      </div>

      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span>{formatDate(post.date, locale)}</span>
          <span className="blog-dot" />
          <span>{formatReadingTime(post.readingMinutes, locale)}</span>
        </div>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.description}</p>
      </div>
    </Link>
  )
}
