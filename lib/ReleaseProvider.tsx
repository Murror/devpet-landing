'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { ReleaseState } from './releaseServer'

/**
 * Carries the server's release answer down to the client components that render from it.
 *
 * A context rather than props because the two consumers sit at different depths — `Nav` is a
 * direct child of the page, `HeroCta` is inside `Hero` — and threading a prop through `Hero`
 * would make an unrelated component take an argument it does not use.
 *
 * It holds a value and never fetches. That is the point: the answer is decided once, on the
 * server, before any HTML is sent (see getReleaseState). Nothing here can flip after
 * hydration, so there is nothing to flash.
 */
const ReleaseContext = createContext<ReleaseState | null>(null)

export function ReleaseProvider({
  value,
  children,
}: {
  value: ReleaseState
  children: ReactNode
}) {
  return <ReleaseContext.Provider value={value}>{children}</ReleaseContext.Provider>
}

/**
 * The release state, from the nearest provider.
 *
 * Throws when there is none, matching `useLocale`. The tempting alternative — defaulting to
 * `{ released: true }` — turns a forgotten provider into a permanent, silent "Download"
 * button on a page with nothing to download. That is the exact failure this whole change
 * exists to remove, so it should not be reachable by omission.
 */
export function useRelease(): ReleaseState {
  const ctx = useContext(ReleaseContext)
  if (!ctx) throw new Error('useRelease must be used inside ReleaseProvider')
  return ctx
}
