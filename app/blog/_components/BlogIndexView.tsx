import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { blogStrings } from '@/lib/blog/ui-strings'
import CategoryChips from './CategoryChips'
import PostCard from './PostCard'
import FeaturedCard from './FeaturedCard'
import NewsletterBand from './NewsletterBand'

/**
 * Blog listing surface — cinematic-dark, aligned to the main site.
 * An atmospheric hero (eyebrow → editorial headline with a Playfair
 * italic accent → tagline → frosted topic filters), a large featured
 * lead story, a newsletter band, then a glass card grid. Reused by the
 * blog home and each category page (category pages drop the lead +
 * newsletter).
 */
export default function BlogIndexView({
  locale,
  posts,
  title,
  tagline,
  activeSlug = 'all',
  lead = true,
}: {
  locale: Locale
  posts: PostMeta[]
  title: string
  tagline: string
  activeSlug?: string
  lead?: boolean
}) {
  const s = blogStrings(locale)
  const useLead = lead && posts.length > 0
  const leadPost = useLead ? posts[0] : null
  const rest = useLead ? posts.slice(1) : posts

  // Render the final word of the title as an italic gradient accent
  // (matches the landing's "second brain" headline treatment).
  const words = title.trim().split(/\s+/)
  const accent = words.length > 1 ? words.pop() : ''
  const head = words.join(' ')

  const eyebrow =
    activeSlug === 'all'
      ? locale === 'vi'
        ? 'Ghi chép'
        : 'Field notes'
      : locale === 'vi'
        ? 'Chủ đề'
        : 'Topic'

  return (
    <main>
      <section className={`bx-hero${lead ? ' bx-hero--media' : ''}`}>
        {lead && (
          <div className="bx-hero-bg" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/blog/hero/hero-bg.jpg" alt="" />
            <div className="bx-hero-bg-scrim" />
          </div>
        )}
        <div className="bx-hero-inner">
          <p className="bx-hero-eyebrow">{eyebrow}</p>
          <h1 className="bx-hero-title">
            {head}
            {accent && (
              <>
                {' '}
                <span className="it">{accent}</span>
              </>
            )}
          </h1>
          <p className="bx-hero-sub">{tagline}</p>
          <div className="bx-hero-tabs">
            <CategoryChips locale={locale} activeSlug={activeSlug} />
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="bx-container">
          <p className="bx-empty">{s.empty}</p>
        </div>
      ) : (
        <>
          {leadPost && (
            <div className="bx-container">
              <FeaturedCard post={leadPost} locale={locale} />
            </div>
          )}

          {lead && (
            <div className="bx-container">
              <NewsletterBand locale={locale} />
            </div>
          )}

          {rest.length > 0 && (
            <div className="bx-container" id="latest">
              <p className="bx-section-label">
                {activeSlug === 'all' ? s.latest : s.allTopics}
              </p>
              <div className="bx-grid">
                {rest.map((post, i) => (
                  <PostCard key={post.slug} post={post} locale={locale} index={i} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
