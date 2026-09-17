'use client'

import { useEffect, useState } from 'react'
import { RELEASES_API } from './download'

export interface ReleaseState {
  /** Whether a downloadable build exists. See the note on the initial value below. */
  released: boolean
  /** The published version with any leading `v` stripped, or null until known. */
  version: string | null
}

/**
 * One in-flight request, shared by every caller on the page.
 *
 * Three components ask this question — the nav, the hero CTA and the /download page — and
 * the GitHub releases API is unauthenticated, so it is rate-limited to 60 requests per hour
 * per IP. Three fetches per page load burns that budget three times as fast for no extra
 * information, and on a shared office or mobile-carrier IP the limit is reached by visitors
 * who are not the same person. Caching the PROMISE (not just the result) also means two
 * components mounting in the same tick share the request rather than racing.
 *
 * Deliberately not reset: within one page load the answer cannot change, and a stale answer
 * in a long-lived tab is harmless — the worst case is a button that 404s once for someone
 * who left the page open across the exact moment of a release.
 */
let inflight: Promise<ReleaseState> | null = null

function query(): Promise<ReleaseState> {
  if (inflight) return inflight
  inflight = fetch(RELEASES_API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(async (res) => {
      // A 404 is the ONLY answer that means "nothing published". Everything else — a rate
      // limit, a 5xx, a malformed body — leaves the button alone. See below.
      if (res.status === 404) return { released: false, version: null }
      if (!res.ok) return { released: true, version: null }
      const rel = await res.json()
      const tag = (rel?.tag_name || rel?.name || '').replace(/^v/, '')
      return { released: true, version: tag || null }
    })
    .catch(() => ({ released: true, version: null }))
  return inflight
}

/** Exported for tests, which would otherwise see one suite's fetch answer the next one. */
export function __resetReleaseCache() {
  inflight = null
}

/**
 * Whether there is a build to download, and which version.
 *
 * Starts OPTIMISTIC — `released: true` before the answer arrives, and still true if the
 * request fails. Two separate reasons, and both point the same way:
 *
 *   1. Almost every future visit happens when a release exists. Starting pessimistic would
 *      flash "not released yet" at everyone, forever, in order to be briefly right during
 *      the pre-launch window.
 *   2. Hiding a working download because GitHub throttled one request is worse than showing
 *      a button that 404s. The first loses a user who wanted the product; the second is
 *      recoverable by reloading.
 */
export function useReleaseAvailable(): ReleaseState {
  const [state, setState] = useState<ReleaseState>({ released: true, version: null })

  useEffect(() => {
    let cancelled = false
    query().then((s) => {
      if (!cancelled) setState(s)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
