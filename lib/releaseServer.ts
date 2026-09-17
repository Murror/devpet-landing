import { RELEASES_API } from './download'

export interface ReleaseState {
  /** Whether a downloadable build exists. */
  released: boolean
  /** The published version with any leading `v` stripped, or null when unknown. */
  version: string | null
}

/**
 * How long a release answer is reused, in seconds.
 *
 * The question changes at most once per release — a few times a month — so five minutes is
 * already far tighter than it needs to be. It bounds how long the site keeps saying "not
 * released yet" after a build is published, which is the only direction that matters.
 */
const REVALIDATE_SECONDS = 300

/**
 * Whether there is a build to download, resolved ON THE SERVER.
 *
 * WHY NOT IN THE BROWSER, which is where this started. The state decides the hero's primary
 * call to action, and every page here is server-rendered. Deciding it on the client means
 * the HTML has to guess, and whichever way it guesses is wrong for somebody:
 *
 *   - Guess "released" (what shipped first): the server sent "Download for macOS" as the
 *     primary CTA while no build existed. Measured on production — the HTML carried the
 *     download button and three /download links, and the waitlist only appeared after the
 *     API answered 404 and React re-rendered. Every visitor saw the wrong CTA flash on the
 *     main conversion surface, and crawlers and no-JS visitors never saw it corrected.
 *   - Guess "not released": the same flash, mirrored, for the entire life of the product
 *     after launch. Worse, just later.
 *
 * There is no correct guess, so the server stops guessing and asks. The HTML is right when
 * it arrives, nothing flips, and the answer is identical for crawlers.
 *
 * It also fixes the request volume properly. The client version fetched once per visitor;
 * this fetches once per REVALIDATE_SECONDS for ALL of them, through Next's data cache.
 * GitHub's unauthenticated limit is 60/hour per IP, and in this direction the IP is the
 * server's — shared by every visitor — so per-visitor fetching was the shape that could not
 * survive traffic.
 *
 * FAILS OPEN, unchanged: only a definitive 404 means "nothing published". A rate limit, a
 * 5xx or a network error leaves the button live, because hiding a working download costs a
 * user who wanted the product, while a button that 404s is recoverable by reloading.
 */
export async function getReleaseState(): Promise<ReleaseState> {
  try {
    const res = await fetch(RELEASES_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (res.status === 404) return { released: false, version: null }
    if (!res.ok) return { released: true, version: null }
    const rel = await res.json()
    const tag = (rel?.tag_name || rel?.name || '').replace(/^v/, '')
    return { released: true, version: tag || null }
  } catch {
    return { released: true, version: null }
  }
}
