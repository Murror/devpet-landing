import type { MetadataRoute } from 'next'
import { SITE_URL, LOCALES, absoluteUrl } from '@/lib/site'
import { getAllPosts } from '@/lib/blog/posts'
import { CATEGORIES } from '@/lib/blog/categories'
import { blogIndexPath, postPath, categoryPath } from '@/lib/blog/format'

/**
 * Site map covering the marketing pages and the full bilingual blog.
 *
 * Each multilingual entry carries `alternates.languages` so search
 * engines see the EN/VI variants as translations of one another rather
 * than duplicate content. Post `lastModified` uses the article's
 * `updated` date when present, else its publish date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Marketing pages (single canonical URL, IP-based locale at runtime).
  entries.push({
    url: SITE_URL,
    changeFrequency: 'weekly',
    priority: 1,
  })
  entries.push({
    url: absoluteUrl('/privacy'),
    changeFrequency: 'yearly',
    priority: 0.3,
  })

  // Blog indexes, one crawlable URL per locale, linked via hreflang.
  for (const locale of LOCALES) {
    entries.push({
      url: absoluteUrl(blogIndexPath(locale)),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, absoluteUrl(blogIndexPath(l))])
        ),
      },
    })
  }

  // Category pages.
  for (const locale of LOCALES) {
    for (const c of CATEGORIES) {
      entries.push({
        url: absoluteUrl(categoryPath(locale, c.slug)),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, absoluteUrl(categoryPath(l, c.slug))])
          ),
        },
      })
    }
  }

  // Articles. Only locales the post exists in get hreflang alternates.
  for (const locale of LOCALES) {
    for (const post of getAllPosts(locale)) {
      entries.push({
        url: absoluteUrl(postPath(locale, post.slug)),
        lastModified: new Date(`${post.updated ?? post.date}T12:00:00Z`),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            post.availableLocales.map((l) => [l, absoluteUrl(postPath(l, post.slug))])
          ),
        },
      })
    }
  }

  return entries
}
