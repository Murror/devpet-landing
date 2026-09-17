/**
 * Canonical site configuration.
 *
 * The production landing page is served at https://code-pet.com. SEO
 * primitives (canonical URLs, sitemap entries, hreflang alternates,
 * Open Graph / JSON-LD absolute URLs, the RSS feed) all need a single
 * authoritative origin to build absolute URLs from — that lives here.
 *
 * `NEXT_PUBLIC_SITE_URL` can override it (preview deploys, staging) but
 * the hard-coded default means every build ships correct canonical tags
 * even when the env var isn't configured on a given platform.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://code-pet.com'
).replace(/\/$/, '')

export const SITE_NAME = 'Codepet'

/**
 * Google Search Console site-verification token (the value from the
 * `<meta name="google-site-verification" content="…">` tag GSC shows
 * for the HTML-tag method). Set it here or via the
 * `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var — when empty, no tag
 * is rendered. The token is public (it ships in page HTML), so either
 * place is fine.
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  '6PkFavEqoC92ldoGPdFfGg_59VZOKXfFPoc6cM9BVjY'

/**
 * Bing Webmaster Tools site-verification token (the value from the
 * `<meta name="msvalidate.01" content="…">` tag Bing shows for its
 * HTML-meta-tag method). Set it here or via the
 * `NEXT_PUBLIC_BING_SITE_VERIFICATION` env var — when empty, no tag is
 * rendered. Like the Google token it's public (ships in page HTML).
 *
 * NOTE: if you instead verify by *importing the site from Google Search
 * Console* in Bing Webmaster Tools, no token is needed and this can stay
 * empty.
 */
export const BING_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || ''

/** Brand line reused in OG/meta fallbacks and JSON-LD `publisher`. */
export const SITE_TAGLINE =
  'Codepet is a macOS app that trains people to build real software with AI.'

export type Locale = 'en' | 'vi'
export const LOCALES: Locale[] = ['en', 'vi']
export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Map a locale to its URL prefix. English is the default and lives at
 * the bare path (`/blog`); Vietnamese is namespaced under `/vi`
 * (`/vi/blog`) so both languages have distinct, crawlable URLs that
 * search engines can index independently and connect with hreflang.
 */
export function localePrefix(locale: Locale): string {
  return locale === 'en' ? '' : `/${locale}`
}

/** Absolute URL helper — joins SITE_URL with a root-relative path. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
