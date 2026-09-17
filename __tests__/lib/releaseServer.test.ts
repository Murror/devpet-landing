import { getReleaseState } from '@/lib/releaseServer'
import { RELEASES_API } from '@/lib/download'

/**
 * The fetch that used to live in a React hook. Moving it to the server is what removed the
 * wrong-CTA flash; these pin the behaviour that came with it, which is mostly about what
 * does NOT count as "no release".
 */
function mockFetch(impl: (url: unknown) => Promise<unknown>) {
  global.fetch = jest.fn(impl as never) as never
}

beforeEach(() => {
  global.fetch = jest.fn()
})

/** Shape of one entry as the releases list returns it, trimmed to what we read. */
const rel = (tag: string, prerelease = false, draft = false) => ({
  tag_name: tag,
  prerelease,
  draft,
})

const ok = (body: unknown) => async () => ({ status: 200, ok: true, json: async () => body })

test('no releases at all means nothing is published', async () => {
  mockFetch(ok([]))
  await expect(getReleaseState()).resolves.toEqual({
    released: false,
    version: null,
    internal: null,
  })
})

test('a prerelease alone does NOT count as published', async () => {
  // This is the property the whole arrangement rests on. The internal build is published as
  // a prerelease precisely so it cannot become the public download — it runs on four
  // registered Macs and says "damaged" on every other. Verified against the live API after
  // publishing it: /releases/latest still answered 404.
  mockFetch(ok([rel('v1.0-build2-internal', true)]))
  const state = await getReleaseState()
  expect(state.released).toBe(false)
  expect(state.internal).toEqual({
    tag: 'v1.0-build2-internal',
    page: 'https://github.com/My-Outcasts/codepet/releases/tag/v1.0-build2-internal',
  })
})

test('a draft does not count either', async () => {
  mockFetch(ok([rel('v9.9', false, true)]))
  await expect(getReleaseState()).resolves.toMatchObject({ released: false })
})

test('a stable release wins even when a newer prerelease exists', async () => {
  // Matches GitHub's own definition of `latest`, which the download permalink resolves
  // through. Computing it differently here would let the page and the button disagree
  // about which build is current.
  mockFetch(ok([rel('v1.1-rc1', true), rel('v1.0-build2')]))
  await expect(getReleaseState()).resolves.toEqual({
    released: true,
    version: '1.0-build2',
    internal: null,
  })
})

test('the internal build disappears once a public one exists', async () => {
  // At that point it is strictly worse for everyone — four Macs, not notarized — so
  // leaving it on the page would be offering a downgrade next to the real thing.
  mockFetch(ok([rel('v1.0-build2-internal', true), rel('v1.0-build2')]))
  await expect(getReleaseState()).resolves.toMatchObject({ released: true, internal: null })
})

test('a rate limit leaves the download live', async () => {
  // FAILS OPEN, and this is the decision the whole feature turns on. Hiding a working
  // download because GitHub throttled one request loses a user who wanted the product; a
  // button that 404s is recoverable by reloading.
  mockFetch(async () => ({ status: 403, ok: false, json: async () => ({}) }))
  await expect(getReleaseState()).resolves.toEqual({
    released: true,
    version: null,
    internal: null,
  })
})

test('a server error leaves it live too', async () => {
  mockFetch(async () => ({ status: 502, ok: false, json: async () => ({}) }))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null, internal: null })
})

test('a network failure leaves it live', async () => {
  mockFetch(async () => {
    throw new Error('offline')
  })
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null, internal: null })
})

test('reads the version and strips the leading v', async () => {
  // The page prints this. A stray `v` would render "Version v1.0-build2".
  mockFetch(ok([rel('v1.0-build2')]))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: '1.0-build2', internal: null })
})

test('falls back to the release name when there is no tag', async () => {
  mockFetch(ok([{ name: '2.0', prerelease: false, draft: false }]))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: '2.0', internal: null })
})

test('a release with no usable version is still a release', async () => {
  // released and version are separate answers: an unnamed release still means there is
  // something to download, and the page simply omits the version line.
  mockFetch(ok([{ prerelease: false, draft: false }]))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null, internal: null })
})

test('a malformed body does not take the page down', async () => {
  mockFetch(async () => ({
    status: 200,
    ok: true,
    json: async () => {
      throw new SyntaxError('Unexpected token')
    },
  }))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null, internal: null })
})

test('asks for the answer to be reused rather than re-fetched per visitor', async () => {
  // The reason this moved to the server at all: one request per revalidation window for
  // every visitor, instead of one per visitor. Without the cache hint, a server-side fetch
  // would be worse than the client version it replaced — GitHub's 60/hour limit would then
  // apply to ONE shared IP for all traffic.
  const seen: Array<[unknown, unknown]> = []
  global.fetch = jest.fn(async (url: unknown, init: unknown) => {
    seen.push([url, init])
    return { status: 200, ok: true, json: async () => [] }
  }) as never

  await getReleaseState()

  const [url, init] = seen[0]
  expect(url).toBe(RELEASES_API)
  expect((init as { next?: { revalidate?: number } }).next?.revalidate).toBeGreaterThan(0)
})
