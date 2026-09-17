import Link from 'next/link'
import type { Locale } from '@/lib/site'
import { localePrefix } from '@/lib/site'
import type { Post, PostMeta } from '@/lib/blog/posts'
import {
  blogIndexPath,
  categoryPath,
  formatDate,
  formatReadingTime,
} from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'
import { blogStrings } from '@/lib/blog/ui-strings'
import PostCard from './PostCard'
import CoverArt from './CoverArt'
import ReadingProgress from './ReadingProgress'

export default function ArticleView({
  post,
  locale,
  related,
}: {
  post: Post
  locale: Locale
  related: PostMeta[]
}) {
  const s = blogStrings(locale)
  const category = getCategory(post.category)
  const home = localePrefix(locale) || '/'

  // Final word of the title as an italic gradient accent, matching the
  // index hero + landing headline treatment.
  const words = post.title.trim().split(/\s+/)
  const accent = words.length > 1 ? words.pop() : ''
  const head = words.join(' ')

  return (
    <main className="bx-article-main">
      <ReadingProgress />

      <article className="bx-article" data-category={post.category}>
        <header className="bx-article-head">
          <Link href={blogIndexPath(locale)} className="bx-article-back">
            {s.backToBlog}
          </Link>

          {category && (
            <Link
              href={categoryPath(locale, category.slug)}
              className="bx-eyebrow bx-article-cat"
              data-category={post.category}
            >
              {category.label[locale]}
            </Link>
          )}

          <h1 className="bx-article-title">
            {head}
            {accent && (
              <>
                {' '}
                <span className="it">{accent}</span>
              </>
            )}
          </h1>
          <p className="bx-article-dek">{post.description}</p>

          <div className="bx-meta bx-article-byline">
            <span>{formatDate(post.date, locale)}</span>
            <span className="bx-dot" />
            <span>{formatReadingTime(post.readingMinutes, locale)}</span>
            {post.updated && post.updated !== post.date && (
              <>
                <span className="bx-dot" />
                <span>
                  {s.updatedOn} {formatDate(post.updated, locale)}
                </span>
              </>
            )}
          </div>
        </header>

        {post.cover ? (
          <div className="bx-article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt={post.coverAlt || ''} />
            <div className="bx-article-cover-scrim" aria-hidden="true" />
          </div>
        ) : (
          <div className="bx-article-cover">
            <CoverArt slug={post.slug} category={post.category} />
            <div className="bx-article-cover-scrim" aria-hidden="true" />
          </div>
        )}

        {post.toc.length >= 3 && (
          <nav className="bx-toc" aria-label={s.tableOfContents}>
            <p className="bx-toc-label">{s.tableOfContents}</p>
            <ul>
              {post.toc.map((item) => (
                <li key={item.id} className={`depth-${item.depth}`}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div
          className="bx-prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="bx-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="bx-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <section className="bx-cta" aria-label={s.ctaTitle}>
        <div className="bx-cta-inner">
          <h2 className="bx-cta-title">{s.ctaTitle}</h2>
          <p className="bx-cta-body">{s.ctaBody}</p>
          <Link href={home} className="bx-cta-btn">{s.ctaButton}</Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bx-container bx-related">
          <p className="bx-section-label">{s.relatedReading}</p>
          <div className="bx-grid">
            {related.map((p, i) => (
              <PostCard key={p.slug} post={p} locale={locale} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
