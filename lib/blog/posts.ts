import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { Marked } from 'marked'
import type { Locale } from '@/lib/site'
import { LOCALES } from '@/lib/site'
import { isCategorySlug, type CategorySlug } from './categories'

/**
 * File-based blog content layer.
 *
 * Each article is a Markdown file under `content/blog/` named
 * `<slug>.<locale>.md` — e.g. `shipping-with-ai.en.md` and
 * `shipping-with-ai.vi.md` are the two language variants of the same
 * post. Sharing a slug across locales is what lets us emit correct
 * hreflang alternates: `/blog/shipping-with-ai` ↔ `/vi/blog/shipping-with-ai`.
 *
 * Everything here runs at build/request time on the server only (it
 * touches the filesystem). Never import this from a Client Component.
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const FILE_RE = /^(.+)\.(en|vi)\.md$/
const IS_PROD = process.env.NODE_ENV === 'production'

export interface PostFrontmatter {
  title: string
  description: string
  /** Publish date, ISO `YYYY-MM-DD`. */
  date: string
  /** Last-meaningful-edit date, ISO `YYYY-MM-DD`. Optional. */
  updated?: string
  category: CategorySlug
  author: string
  authorTitle?: string
  /** Root-relative cover image path, e.g. `/blog/<slug>/cover.png`. */
  cover?: string
  coverAlt?: string
  tags?: string[]
  /** Drafts are visible in dev, hidden from prod listings/sitemap. */
  draft?: boolean
  /** Pin to the top of the index as the lead story. */
  featured?: boolean
}

export interface PostMeta extends PostFrontmatter {
  slug: string
  locale: Locale
  readingMinutes: number
  /** Locales this article has a translation file for (drives hreflang). */
  availableLocales: Locale[]
}

export interface TocItem {
  id: string
  text: string
  depth: 2 | 3
}

export interface Post extends PostMeta {
  /** Rendered, sanitization-trusted HTML (authored in-repo by the team). */
  html: string
  toc: TocItem[]
}

/** URL-/anchor-safe slug, tolerant of Vietnamese diacritics. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readDirSafe(): string[] {
  try {
    return fs.readdirSync(BLOG_DIR)
  } catch {
    // Content dir may not exist yet (fresh checkout before first post).
    return []
  }
}

/** Every post slug present in the content dir (any locale), deduped. */
function listSlugs(): string[] {
  const slugs = new Set<string>()
  for (const file of readDirSafe()) {
    const m = file.match(FILE_RE)
    if (m) slugs.add(m[1])
  }
  return [...slugs]
}

function localesForSlug(slug: string): Locale[] {
  return LOCALES.filter((loc) =>
    fs.existsSync(path.join(BLOG_DIR, `${slug}.${loc}.md`))
  )
}

function readMatter(slug: string, locale: Locale) {
  const file = path.join(BLOG_DIR, `${slug}.${locale}.md`)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, 'utf8')
  return matter(raw)
}

function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function toMeta(slug: string, locale: Locale): PostMeta | null {
  const parsed = readMatter(slug, locale)
  if (!parsed) return null
  const fm = parsed.data as Partial<PostFrontmatter>

  // A post is only valid with the fields SEO + listings depend on.
  if (!fm.title || !fm.description || !fm.date || !fm.category || !fm.author) {
    return null
  }
  if (!isCategorySlug(fm.category)) return null
  if (fm.draft && IS_PROD) return null

  return {
    slug,
    locale,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    updated: fm.updated,
    category: fm.category,
    author: fm.author,
    authorTitle: fm.authorTitle,
    cover: fm.cover,
    coverAlt: fm.coverAlt,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    draft: Boolean(fm.draft),
    featured: Boolean(fm.featured),
    readingMinutes: readingMinutes(parsed.content),
    availableLocales: localesForSlug(slug),
  }
}

/** Newest first; featured posts float to the very top. */
function byDateDesc(a: PostMeta, b: PostMeta): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0
}

/** All publishable posts for a locale, sorted for the index page. */
export function getAllPosts(locale: Locale): PostMeta[] {
  return listSlugs()
    .map((slug) => toMeta(slug, locale))
    .filter((p): p is PostMeta => p !== null)
    .sort(byDateDesc)
}

export function getPostsByCategory(
  locale: Locale,
  category: CategorySlug
): PostMeta[] {
  return getAllPosts(locale).filter((p) => p.category === category)
}

/** Slug/locale pairs for `generateStaticParams`, drafts excluded in prod. */
export function getAllPublishedRefs(locale: Locale): { slug: string }[] {
  return getAllPosts(locale).map((p) => ({ slug: p.slug }))
}

/**
 * Render Markdown → HTML and pull out an h2/h3 table of contents.
 * IDs are injected via a post-process pass so we don't depend on
 * marked's evolving renderer API.
 */
function renderMarkdown(markdown: string): { html: string; toc: TocItem[] } {
  const md = new Marked({ gfm: true, breaks: false })
  const rawHtml = md.parse(markdown, { async: false }) as string
  const toc: TocItem[] = []
  const seen = new Map<string, number>()

  const html = rawHtml.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_full, levelStr: string, inner: string) => {
      const depth = Number(levelStr) as 2 | 3
      const text = inner.replace(/<[^>]+>/g, '').trim()
      let id = slugify(text) || 'section'
      // Guarantee unique anchors when two headings share a title.
      const count = seen.get(id) ?? 0
      seen.set(id, count + 1)
      if (count > 0) id = `${id}-${count}`
      toc.push({ id, text, depth })
      return `<h${depth} id="${id}">${inner}</h${depth}>`
    }
  )

  return { html, toc }
}

/** Metadata only (no Markdown render) — for `generateMetadata`. */
export function getPostMeta(slug: string, locale: Locale): PostMeta | null {
  return toMeta(slug, locale)
}

/** Full post (metadata + rendered body) for an article page. */
export function getPost(slug: string, locale: Locale): Post | null {
  const meta = toMeta(slug, locale)
  if (!meta) return null
  const parsed = readMatter(slug, locale)
  if (!parsed) return null
  const { html, toc } = renderMarkdown(parsed.content)
  return { ...meta, html, toc }
}

/**
 * Up to `limit` related posts for the in-article footer: same category
 * first, then most-recent others, never the current post.
 */
export function getRelatedPosts(
  slug: string,
  locale: Locale,
  category: CategorySlug,
  limit = 2
): PostMeta[] {
  const others = getAllPosts(locale).filter((p) => p.slug !== slug)
  const sameCat = others.filter((p) => p.category === category)
  const rest = others.filter((p) => p.category !== category)
  return [...sameCat, ...rest].slice(0, limit)
}
