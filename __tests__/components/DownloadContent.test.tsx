import { render, screen, waitFor } from '@testing-library/react'
import { LocaleProvider } from '@/lib/LocaleProvider'
import { DOWNLOAD_PATH, DOWNLOAD_TARGET, MIN_MACOS } from '@/lib/download'
import { ReleaseProvider } from '@/lib/ReleaseProvider'
import DownloadContent from '@/app/download/DownloadContent'
import nextConfig from '../../next.config'

/**
 * The release answer now arrives as a VALUE from the server (see lib/releaseServer.ts), so
 * these render the component under a provider instead of mocking fetch. That is the whole
 * improvement in miniature: there is no request to intercept and no asynchronous flip to
 * wait for, because the page is never in the wrong state to begin with.
 *
 * The fetch itself is tested directly in releaseServer.test.ts.
 */
let release = { released: true, version: '1.0-build2' as string | null }

beforeEach(() => {
  global.fetch = jest.fn()
  release = { released: true, version: '1.0-build2' }
})

function renderPage(locale: 'en' | 'vi' = 'en') {
  return render(
    <LocaleProvider initialLocale={locale}>
      <ReleaseProvider value={release}>
        <DownloadContent />
      </ReleaseProvider>
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
    release = { released: false, version: null }
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

  test('an unknown version still shows the button', async () => {
    // What a rate limit or a 5xx produces on the server: released stays true, version is
    // unknown. The download must survive that — hiding it costs a user who wanted the
    // product, while a stale button is recoverable by reloading.
    release = { released: true, version: null }
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Download for macOS/i })).toBeInTheDocument()
    })
    expect(screen.queryByText(/Not released yet/i)).toBeNull()
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
    release = { released: false, version: null }
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
