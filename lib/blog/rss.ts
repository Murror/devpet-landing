import type { Locale } from '@/lib/site'
import { SITE_URL, absoluteUrl } from '@/lib/site'
import { getAllPosts } from './posts'
import { getCategory } from './categories'
import { blogIndexPath, postPath } from './format'
import { blogStrings } from './ui-strings'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rfc822(dateIso: string): string {
  return new Date(`${dateIso}T12:00:00Z`).toUTCString()
}

/** Build an RSS 2.0 feed document for a locale's blog. */
export function buildRssFeed(locale: Locale): string {
  const s = blogStrings(locale)
  const posts = getAllPosts(locale)
  const feedUrl = absoluteUrl(`${blogIndexPath(locale)}/feed.xml`)
  const selfTitle = `${s.metaIndexTitle}`
  const lastBuild = posts[0] ? rfc822(posts[0].updated ?? posts[0].date) : new Date(0).toUTCString()

  const items = posts
    .map((p) => {
      const url = absoluteUrl(postPath(locale, p.slug))
      const cat = getCategory(p.category)?.label[locale]
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      ${cat ? `<category>${escapeXml(cat)}</category>` : ''}
      <description>${escapeXml(p.description)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(selfTitle)}</title>
    <link>${absoluteUrl(blogIndexPath(locale))}</link>
    <description>${escapeXml(s.metaIndexDescription)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <generator>${SITE_URL}</generator>
${items}
  </channel>
</rss>
`
}
