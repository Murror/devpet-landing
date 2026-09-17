import { render, screen, waitFor } from '@testing-library/react'
import { LocaleProvider } from '@/lib/LocaleProvider'
import { DOWNLOAD_PATH, DOWNLOAD_TARGET, MIN_MACOS } from '@/lib/download'
import DownloadPage from '@/app/download/DownloadPage'
import { Bold } from '@/app/download/Bold'
import en from '@/lib/i18n/en.json'
import vi from '@/lib/i18n/vi.json'
import nextConfig from '../../next.config'

/**
 * The page asks the GitHub releases API on mount. Default it to "a release exists" so the
 * existing cases keep describing the normal state; `mockReleases` overrides per test.
 *
 * Routed BY URL, not by call order: LocaleProvider also fetches (api.country.is for geo) and
 * a one-shot mock would be spent on whichever fired first. That exact bug was live in
 * WaitlistForm.test.tsx and made a test pass for the wrong reason.
 */
function mockReleases(status: number) {
  ;(global.fetch as jest.Mock).mockImplementation((url: unknown) => {
    if (typeof url === 'string' && url.includes('api.github.com')) {
      return Promise.resolve({ status, ok: status === 200, json: async () => ({}) })
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({ country: 'US' }) })
  })
}

beforeEach(() => {
  global.fetch = jest.fn()
  mockReleases(200)
})

function renderPage(locale: 'en' | 'vi' = 'en') {
  return render(
    <LocaleProvider initialLocale={locale}>
      <DownloadPage />
    </LocaleProvider>,
  )
}

describe('the download button', () => {
  // The whole point of the page. If this href is wrong nothing else on it matters.
  test('points at our own path, not at the host', () => {
    renderPage()
    const button = screen.getByRole('link', { name: en.download.cta })
    expect(button).toHaveAttribute('href', DOWNLOAD_PATH)
    expect(button.getAttribute('href')).not.toContain('github.com')
  })

  test('states the macOS requirement next to it', () => {
    renderPage()
    // Downloading 40MB to find out your Mac is too old is a bad first impression, and
    // 26.2 is recent enough that plenty of visitors will be on something older.
    expect(screen.getByText(new RegExp(MIN_MACOS.replace('.', '\\.')))).toBeInTheDocument()
  })
})

describe('the redirect behind that path', () => {
  // The page and next.config.ts have to agree about the URL or the button 404s while both
  // files look individually correct. They import the same constant; this proves the
  // redirect actually uses it rather than a hardcoded copy that drifted.
  test('next.config forwards DOWNLOAD_PATH to the release asset', async () => {
    const redirects = await nextConfig.redirects!()
    const rule = redirects.find((r) => r.source === DOWNLOAD_PATH)
    expect(rule).toBeDefined()
    expect(rule!.destination).toBe(DOWNLOAD_TARGET)
  })

  test('is a 307, so a future host change is not cached forever', () => {
    // A 301 is cached by the browser indefinitely. If the asset ever moves off GitHub,
    // every past downloader keeps being sent to the old host by their own browser and no
    // deploy of ours can fix it.
    return nextConfig.redirects!().then((redirects) => {
      const rule = redirects.find((r) => r.source === DOWNLOAD_PATH)
      expect(rule!.permanent).toBe(false)
    })
  })

  test('the target is the `latest` permalink, not a pinned tag', () => {
    // Shipping a new version must not require a deploy of this site. A pinned tag here is
    // the mistake that makes the download silently stale for everyone.
    expect(DOWNLOAD_TARGET).toContain('/releases/latest/download/')
  })
})

describe('the instructions a user actually needs', () => {
  test('tells them about the first-launch right-click', () => {
    renderPage()
    // Notarized or not, macOS asks for this on anything installed outside the App Store.
    // A user who does not expect it reads the dialog as "unsafe" and stops.
    // getAllBy: the phrase appears in the numbered step AND in the note under it that
    // explains why macOS asks. Both are wanted, so assert presence rather than uniqueness.
    expect(screen.getAllByText(/right-click/i).length).toBeGreaterThan(0)
    expect(screen.getByText(en.download.gatekeeperTitle)).toBeInTheDocument()
  })

  test('warns that Claude Code is needed before they install', () => {
    renderPage()
    // Every model call runs on the founder's own Claude plan. Without it the app opens
    // and cannot do its main thing — which reads as broken rather than as a prerequisite.
    // Twice on the page: once in the explanation, once as the "Get Claude Code" link.
    expect(screen.getAllByText(/Claude Code/).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /Claude Code/ })).toHaveAttribute(
      'href',
      'https://claude.com/claude-code',
    )
  })

  test('renders all three install steps', () => {
    renderPage()
    expect(screen.getAllByRole('listitem')).toHaveLength(en.download.installSteps.length)
  })
})

describe('Vietnamese', () => {
  test('renders VI copy and the same working button', () => {
    renderPage('vi')
    expect(screen.getByRole('link', { name: vi.download.cta })).toHaveAttribute(
      'href',
      DOWNLOAD_PATH,
    )
    expect(screen.getByText(vi.download.title)).toBeInTheDocument()
  })

  test('has every key EN has', () => {
    // A missing key does not throw — it renders the string "undefined" onto the page, in
    // the language least likely to be checked before deploy.
    expect(Object.keys(vi.download).sort()).toEqual(Object.keys(en.download).sort())
    expect(vi.download.installSteps).toHaveLength(en.download.installSteps.length)
  })

  test('no copy still carries an untranslated English marker', () => {
    // Catches the half-done translation: a VI block copy-pasted from EN and only partly
    // rewritten. `{version}` is the one placeholder that is meant to survive.
    const joined = JSON.stringify(vi.download).replace(/\{version\}/g, '')
    expect(joined).not.toMatch(/Download for macOS/)
  })
})

describe('Bold', () => {
  test('emphasises **wrapped** spans and leaves the rest alone', () => {
    render(
      <p>
        <Bold text="drag **Codepet** into **Applications**." />
      </p>,
    )
    expect(screen.getByText('Codepet').tagName).toBe('STRONG')
    expect(screen.getByText('Applications').tagName).toBe('STRONG')
  })

  test('an unmatched ** does not swallow the sentence', () => {
    // The failure mode worth guarding: a translator drops one asterisk pair and the rest
    // of the paragraph disappears from the page rather than losing its emphasis.
    const { container } = render(<Bold text="open **Settings and then stop" />)
    expect(container.textContent).toBe('open **Settings and then stop')
  })

  test('does not render markup from the string', () => {
    // The input is our own translation file, but the component should not be the reason
    // that stops being true.
    const { container } = render(<Bold text="<img src=x onerror=alert(1)>" />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('<img')
  })
})

describe('when no release has been published', () => {
  // The state this page is in TODAY: the packaging pipeline is ready but no .dmg has been
  // cut, so the permalink 404s. A button that 404s does not read as "unreleased" — it reads
  // as a broken product.
  test('replaces the button with an honest message and somewhere to go', async () => {
    mockReleases(404)
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(en.download.notYetTitle)).toBeInTheDocument()
    })
    expect(screen.queryByRole('link', { name: en.download.cta })).toBeNull()
    expect(screen.getByRole('link', { name: en.download.notYetCta })).toHaveAttribute(
      'href',
      '/#waitlist',
    )
  })

  test('a rate-limited or failing API leaves the button live', async () => {
    // Fails OPEN. The API is unauthenticated (60/hour per IP), and the steady state of this
    // page is that a release exists — hiding a working download because GitHub throttled us
    // is the worse mistake of the two.
    mockReleases(403)
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('link', { name: en.download.cta })).toBeInTheDocument()
    })
    expect(screen.queryByText(en.download.notYetTitle)).toBeNull()
  })

  test('a network error leaves the button live too', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: unknown) =>
      typeof url === 'string' && url.includes('api.github.com')
        ? Promise.reject(new Error('offline'))
        : Promise.resolve({ ok: true, status: 200, json: async () => ({ country: 'US' }) }),
    )
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('link', { name: en.download.cta })).toBeInTheDocument()
    })
  })

  test('renders the button first rather than flashing "not yet"', () => {
    // Optimistic on purpose. Almost every future visit happens when a release DOES exist;
    // starting pessimistic would show the wrong answer to everyone forever in order to be
    // briefly right today.
    mockReleases(404)
    renderPage()
    expect(screen.getByRole('link', { name: en.download.cta })).toBeInTheDocument()
  })
})
