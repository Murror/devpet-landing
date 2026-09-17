import { render, screen, waitFor } from '@testing-library/react'
import { LocaleProvider } from '@/lib/LocaleProvider'
import { DOWNLOAD_PATH, DOWNLOAD_TARGET, MIN_MACOS, RELEASES_API } from '@/lib/download'
import { __resetReleaseCache } from '@/lib/useReleaseAvailable'
import DownloadContent from '@/app/download/DownloadContent'
import nextConfig from '../../next.config'

/**
 * Mock the releases endpoint BY URL, and by exact equality rather than a substring.
 *
 * By URL because LocaleProvider also fetches (api.country.is, for geo) — a one-shot
 * `mockResolvedValueOnce` gets spent on whichever request fires first, which silently sends
 * every assertion down the wrong branch. That bug was live in WaitlistForm.test.tsx.
 *
 * By exact equality because `url.includes('api.github.com')` also matches
 * `https://api.github.com.example.com/…`; CodeQL flags it, and it would keep routing here
 * if the component were changed to call a look-alike host, so the test would stop being
 * about the URL it names.
 */
function mockReleases(status: number, body: unknown = {}) {
  ;(global.fetch as jest.Mock).mockImplementation((url: unknown) => {
    if (url === RELEASES_API) {
      return Promise.resolve({ status, ok: status === 200, json: async () => body })
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({ country: 'US' }) })
  })
}

beforeEach(() => {
  global.fetch = jest.fn()
  // The release query is deduped at module scope so one page load makes one request. That
  // cache also spans TESTS, so without this reset the first case's answer is served to
  // every case after it — and the unreleased ones silently assert against a released page.
  __resetReleaseCache()
  mockReleases(200, { tag_name: 'v1.0-build2' })
})

function renderPage(locale: 'en' | 'vi' = 'en') {
  return render(
    <LocaleProvider initialLocale={locale}>
      <DownloadContent />
    </LocaleProvider>,
  )
}

describe('the download button', () => {
  test('points at our own path, not at the host', async () => {
    renderPage()
    const button = await screen.findByRole('link', { name: /Download for macOS/i })
    expect(button).toHaveAttribute('href', DOWNLOAD_PATH)
    expect(button.getAttribute('href')).not.toContain('github.com')
  })

  test('states the real macOS requirement', async () => {
    renderPage()
    // The page said "macOS 13" while MACOSX_DEPLOYMENT_TARGET is 26.2. That is the kind of
    // wrong that costs a stranger their time: they read a supported requirement, download
    // 30MB and get an app that will not launch.
    expect(await screen.findByText(new RegExp(MIN_MACOS.replace('.', '\\.')))).toBeInTheDocument()
    expect(screen.queryByText(/macOS 13/)).toBeNull()
  })

  test('shows the published version rather than a hardcoded one', async () => {
    renderPage()
    // Replaces a literal "1.0 (build 2)", which is right until the next release and wrong
    // silently afterwards — on the page whose only job is handing over the current build.
    expect(await screen.findByText(/1\.0-build2/)).toBeInTheDocument()
  })
})

describe('the redirect behind that path', () => {
  // The page and next.config.ts must agree about the URL, or the button 404s while both
  // files look individually correct. They import the same constant; this proves the
  // redirect uses it rather than a hardcoded copy that drifted.
  test('next.config forwards DOWNLOAD_PATH to the release asset', async () => {
    const redirects = await nextConfig.redirects!()
    const rule = redirects.find((r) => r.source === DOWNLOAD_PATH)
    expect(rule).toBeDefined()
    expect(rule!.destination).toBe(DOWNLOAD_TARGET)
  })

  test('is a 307, so a future host change is not cached forever', async () => {
    // A 301 is cached by the browser indefinitely. If the asset moves off GitHub, every
    // past downloader keeps being sent to the old host by their own browser, and no deploy
    // of ours can reach them.
    const redirects = await nextConfig.redirects!()
    expect(redirects.find((r) => r.source === DOWNLOAD_PATH)!.permanent).toBe(false)
  })

  test('the target is the `latest` permalink, not a pinned tag', () => {
    // Shipping a new version must not require a deploy of this site.
    expect(DOWNLOAD_TARGET).toContain('/releases/latest/download/')
  })
})

describe('when no release has been published', () => {
  // The state today: the packaging pipeline is ready but no .dmg has been cut, so the
  // permalink 404s. A button that 404s does not read as "unreleased" — it reads as a broken
  // product, with nowhere to go next.
  test('replaces the button with an honest message and somewhere to go', async () => {
    mockReleases(404)
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/Not released yet/i)).toBeInTheDocument()
    })
    expect(screen.queryByRole('link', { name: /Download for macOS/i })).toBeNull()
    expect(screen.getByRole('link', { name: /Join the waitlist/i })).toHaveAttribute(
      'href',
      '/#waitlist',
    )
  })

  test('a rate-limited API leaves the button live', async () => {
    // Fails OPEN. The API is unauthenticated (60/hour per IP) and the steady state of this
    // page is that a release exists — hiding a working download because GitHub throttled us
    // is the worse mistake of the two.
    mockReleases(403)
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Download for macOS/i })).toBeInTheDocument()
    })
    expect(screen.queryByText(/Not released yet/i)).toBeNull()
  })

  test('a network error leaves the button live too', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: unknown) =>
      url === RELEASES_API
        ? Promise.reject(new Error('offline'))
        : Promise.resolve({ ok: true, status: 200, json: async () => ({ country: 'US' }) }),
    )
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Download for macOS/i })).toBeInTheDocument()
    })
  })

  test('renders the button first rather than flashing "not yet"', () => {
    // Optimistic on purpose: almost every future visit happens when a release DOES exist,
    // so starting pessimistic shows the wrong answer to everyone forever to be briefly
    // right today.
    mockReleases(404)
    renderPage()
    expect(screen.getByRole('link', { name: /Download for macOS/i })).toBeInTheDocument()
  })
})

describe('the instructions a user actually needs', () => {
  test('keeps the first-launch right-click and the Gatekeeper fallback', async () => {
    renderPage()
    // Both were already on main. Asserted here so the release-state work above cannot
    // quietly drop them.
    expect(await screen.findByText(/right-click/i)).toBeInTheDocument()
    expect(screen.getByText(/Open Anyway/i)).toBeInTheDocument()
  })

  test('warns that Claude Code is needed before they install', async () => {
    renderPage()
    // Every model call runs on the founder's own Claude plan. Without it the app opens and
    // cannot do its main thing — a prerequisite if said here, a bug report if discovered
    // after the download.
    expect(await screen.findByRole('link', { name: /Claude Code/i })).toHaveAttribute(
      'href',
      'https://claude.com/claude-code',
    )
  })
})

describe('Vietnamese', () => {
  test('renders VI copy and the same working button', async () => {
    renderPage('vi')
    expect(await screen.findByText(/Tải Codepet/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Download for macOS/i })).toHaveAttribute(
      'href',
      DOWNLOAD_PATH,
    )
  })

  test('translates the unreleased state too', async () => {
    // The state most likely to ship untranslated, because it is the one nobody sees while
    // developing against a repo that has releases.
    mockReleases(404)
    renderPage('vi')
    await waitFor(() => {
      expect(screen.getByText(/Chưa phát hành/)).toBeInTheDocument()
    })
  })

  test('translates the Claude Code prerequisite', async () => {
    renderPage('vi')
    expect(await screen.findByText(/Claude Code của chính bạn/)).toBeInTheDocument()
  })
})
