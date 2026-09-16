import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@/lib/LocaleProvider'
import { DOWNLOAD_PATH, DOWNLOAD_TARGET, MIN_MACOS } from '@/lib/download'
import DownloadPage from '@/app/download/DownloadPage'
import { Bold } from '@/app/download/Bold'
import en from '@/lib/i18n/en.json'
import vi from '@/lib/i18n/vi.json'
import nextConfig from '../../next.config'

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
