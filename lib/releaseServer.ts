import { RELEASES_API, RELEASES_PAGE } from './download'

export interface InternalBuild {
  /** The prerelease's tag, e.g. `v1.0-build2-internal`. */
  tag: string
  /** The GitHub release page for it — not the asset, so the notes are read first. */
  page: string
}

export interface ReleaseState {
  /** Whether a build anyone can run exists. */
  released: boolean
  /** The published version with any leading `v` stripped, or null when unknown. */
  version: string | null
  /**
   * The newest prerelease, when there is one and no public build yet.
   *
   * Null once a public release exists: at that point the internal build is strictly worse
   * for everyone — it runs on four Macs and is not notarized — so leaving it on the page
   * would be offering a downgrade next to the real thing.
   */
  internal: InternalBuild | null
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
 * FAILS OPEN: only a well-formed answer that contains no stable release means "nothing
 * published". A rate limit, a 5xx, a malformed body or a network error all leave the button
 * live, because hiding a working download costs a user who wanted the product, while a
 * button that 404s is recoverable by reloading.
 */
export async function getReleaseState(): Promise<ReleaseState> {
  // Fails open on anything that is not a clear answer — see the note above.
  const unknown: ReleaseState = { released: true, version: null, internal: null }
  try {
    const res = await fetch(RELEASES_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return unknown
    const list = await res.json()
    if (!Array.isArray(list)) return unknown

    // GitHub's own definition of "latest": the newest release that is neither a prerelease
    // nor a draft. Computed here rather than asked for, so that this page and the
    // `releases/latest/download/` permalink the button points at cannot disagree about
    // which release is current.
    const stable = list.find((r) => r && !r.prerelease && !r.draft)
    const pre = list.find((r) => r && r.prerelease && !r.draft)

    const internal: InternalBuild | null =
      !stable && pre?.tag_name
        ? { tag: pre.tag_name, page: `${RELEASES_PAGE}/tag/${pre.tag_name}` }
        : null

    if (!stable) return { released: false, version: null, internal }

    const tag = (stable.tag_name || stable.name || '').replace(/^v/, '')
    return { released: true, version: tag || null, internal: null }
  } catch {
    return unknown
  }
}
