import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { RELEASES_API, DOWNLOAD_PAGE } from '@/lib/download'
import { __resetReleaseCache } from '@/lib/useReleaseAvailable'
import Nav from '@/app/v3/components/Nav'
import HeroCta from '@/app/v3/components/HeroCta'

/**
 * The v3 landing is the live homepage, and it linked to /download from nowhere — the page
 * was reachable only by typing the URL, which is the same as not existing. These cover the
 * two entry points added for that, and the rule they share: they appear only once a build
 * is actually published.
 */
function mockReleases(status: number, body: unknown = { tag_name: 'v1.0-build2' }) {
  ;(global.fetch as jest.Mock).mockImplementation((url: unknown) =>
    url === RELEASES_API
      ? Promise.resolve({ status, ok: status === 200, json: async () => body })
      : Promise.resolve({ ok: true, status: 200, json: async () => ({ country: 'US' }) }),
  )
}

beforeEach(() => {
  global.fetch = jest.fn()
  // Without this the module-level dedupe cache carries one test's answer into the next.
  __resetReleaseCache()
  mockReleases(200)
})

describe('the v3 nav', () => {
  test('offers Download once a build exists', async () => {
    render(<Nav />)
    const links = await screen.findAllByRole('link', { name: 'Download' })
    expect(links.length).toBeGreaterThan(0)
    // The PAGE, not the .dmg: it carries the install steps, the Gatekeeper note and the
    // Claude Code prerequisite. A visitor dropped straight onto a 30MB file gets none of it.
    links.forEach((l) => expect(l).toHaveAttribute('href', DOWNLOAD_PAGE))
    expect(links.some((l) => l.getAttribute('href')!.endsWith('.dmg'))).toBe(false)
  })

  test('reaches phones as well as desktop', async () => {
    // The hamburger drawer is the ONLY nav below 760px. An entry that exists solely in the
    // desktop pill is invisible to every mobile visitor — which is most of them.
    //
    // The drawer carries `aria-hidden` while closed (main's own pattern for every nav
    // link), so it is absent from the accessibility tree until opened. Opening it is both
    // what a phone user does and the only way to see what they would see.
    render(<Nav />)
    await screen.findAllByRole('link', { name: 'Download' })
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('link', { name: 'Download' })).toHaveLength(2)
    })
  })

  test('hides it while nothing is published', async () => {
    mockReleases(404)
    render(<Nav />)
    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Download' })).toBeNull()
    })
  })
})

describe('the v3 hero CTA', () => {
  test('leads with the download once a build exists', async () => {
    render(<HeroCta />)
    const primary = await screen.findByRole('link', { name: /Download for macOS/i })
    expect(primary).toHaveAttribute('href', DOWNLOAD_PAGE)
    expect(primary.className).toContain('v3-btn--primary')
  })

  test('keeps the waitlist reachable after the flip', async () => {
    // Someone on Windows, or without the prerequisites to hand, still needs a way to say
    // "tell me more" rather than bouncing off a button they cannot use.
    render(<HeroCta />)
    await screen.findByRole('link', { name: /Download for macOS/i })
    expect(screen.getByRole('button', { name: /Join the waitlist/i })).toBeInTheDocument()
  })

  test('drops the "Sign Up" ghost, whose note stops being true', async () => {
    // It revealed a "launching soon" message — false from the moment there is something to
    // launch, which is the same moment this flip happens.
    render(<HeroCta />)
    await screen.findByRole('link', { name: /Download for macOS/i })
    expect(screen.queryByRole('button', { name: /^Sign Up$/i })).toBeNull()
  })

  test('stays on the waitlist while nothing is published', async () => {
    mockReleases(404)
    render(<HeroCta />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Join the waitlist/i })).toBeInTheDocument()
    })
    expect(screen.queryByRole('link', { name: /Download for macOS/i })).toBeNull()
    // The pre-launch pairing is untouched: waitlist primary, "Sign Up" ghost.
    expect(screen.getByRole('button', { name: /^Sign Up$/i })).toBeInTheDocument()
  })
})

describe('the shared release query', () => {
  test('is made once for the whole page, not once per component', async () => {
    // Three components ask this question and the GitHub API is unauthenticated — 60 requests
    // per hour per IP. Three fetches per page load spends that budget three times as fast
    // for no extra information, and on a shared or carrier IP the limit is reached by
    // visitors who are not the same person.
    render(
      <>
        <Nav />
        <HeroCta />
      </>,
    )
    await screen.findAllByRole('link', { name: 'Download' })
    const releaseCalls = (global.fetch as jest.Mock).mock.calls.filter(
      ([url]) => url === RELEASES_API,
    )
    expect(releaseCalls).toHaveLength(1)
  })

  test('a rate limit leaves both entry points live', async () => {
    // Fails OPEN. Hiding a working download because GitHub throttled one request loses a
    // user who wanted the product; a button that 404s once is recoverable by reloading.
    mockReleases(403)
    render(<HeroCta />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Download for macOS/i })).toBeInTheDocument()
    })
  })

  test('a network error leaves them live too', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: unknown) =>
      url === RELEASES_API
        ? Promise.reject(new Error('offline'))
        : Promise.resolve({ ok: true, status: 200, json: async () => ({ country: 'US' }) }),
    )
    render(<HeroCta />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Download for macOS/i })).toBeInTheDocument()
    })
  })
})
