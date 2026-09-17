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

test('a 404 is the only thing that means nothing is published', async () => {
  mockFetch(async () => ({ status: 404, ok: false, json: async () => ({}) }))
  await expect(getReleaseState()).resolves.toEqual({ released: false, version: null })
})

test('a rate limit leaves the download live', async () => {
  // FAILS OPEN, and this is the decision the whole feature turns on. Hiding a working
  // download because GitHub throttled one request loses a user who wanted the product; a
  // button that 404s is recoverable by reloading.
  mockFetch(async () => ({ status: 403, ok: false, json: async () => ({}) }))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null })
})

test('a server error leaves it live too', async () => {
  mockFetch(async () => ({ status: 502, ok: false, json: async () => ({}) }))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null })
})

test('a network failure leaves it live', async () => {
  mockFetch(async () => {
    throw new Error('offline')
  })
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null })
})

test('reads the version and strips the leading v', async () => {
  // The page prints this. A stray `v` would render "Version v1.0-build2".
  mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ tag_name: 'v1.0-build2' }) }))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: '1.0-build2' })
})

test('falls back to the release name when there is no tag', async () => {
  mockFetch(async () => ({ status: 200, ok: true, json: async () => ({ name: '2.0' }) }))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: '2.0' })
})

test('a release with no usable version is still a release', async () => {
  // released and version are separate answers: an unnamed release still means there is
  // something to download, and the page simply omits the version line.
  mockFetch(async () => ({ status: 200, ok: true, json: async () => ({}) }))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null })
})

test('a malformed body does not take the page down', async () => {
  mockFetch(async () => ({
    status: 200,
    ok: true,
    json: async () => {
      throw new SyntaxError('Unexpected token')
    },
  }))
  await expect(getReleaseState()).resolves.toEqual({ released: true, version: null })
})

test('asks for the answer to be reused rather than re-fetched per visitor', async () => {
  // The reason this moved to the server at all: one request per revalidation window for
  // every visitor, instead of one per visitor. Without the cache hint, a server-side fetch
  // would be worse than the client version it replaced — GitHub's 60/hour limit would then
  // apply to ONE shared IP for all traffic.
  const seen: Array<[unknown, unknown]> = []
  global.fetch = jest.fn(async (url: unknown, init: unknown) => {
    seen.push([url, init])
    return { status: 404, ok: false, json: async () => ({}) }
  }) as never

  await getReleaseState()

  const [url, init] = seen[0]
  expect(url).toBe(RELEASES_API)
  expect((init as { next?: { revalidate?: number } }).next?.revalidate).toBeGreaterThan(0)
})
