import { render, screen, fireEvent } from '@testing-library/react'
import { DOWNLOAD_PAGE } from '@/lib/download'
import { ReleaseProvider, useRelease } from '@/lib/ReleaseProvider'
import type { ReleaseState } from '@/lib/releaseServer'
import Nav from '@/app/v3/components/Nav'
import HeroCta from '@/app/v3/components/HeroCta'

/**
 * The v3 landing is the live homepage, and it linked to /download from nowhere — the page
 * was reachable only by typing the URL, which is the same as not existing. These cover the
 * two entry points added for that, and the rule they share: they appear only once a build
 * is actually published.
 *
 * The state arrives as a value from the server, so there is nothing to mock and nothing
 * asynchronous to wait for. Every assertion below is on the FIRST render, which is the
 * property that matters: the previous version shipped the wrong CTA and corrected it after
 * hydration.
 */
const RELEASED: ReleaseState = { released: true, version: '1.0-build2' }
const UNRELEASED: ReleaseState = { released: false, version: null }

function renderWith(value: ReleaseState, ui: React.ReactNode) {
  return render(<ReleaseProvider value={value}>{ui}</ReleaseProvider>)
}

describe('the v3 nav', () => {
  test('offers Download once a build exists', () => {
    renderWith(RELEASED, <Nav />)
    const links = screen.getAllByRole('link', { name: 'Download' })
    expect(links.length).toBeGreaterThan(0)
    // The PAGE, not the .dmg: it carries the install steps, the Gatekeeper note and the
    // Claude Code prerequisite. A visitor dropped straight onto a 30MB file gets none of it.
    links.forEach((l) => expect(l).toHaveAttribute('href', DOWNLOAD_PAGE))
    expect(links.some((l) => l.getAttribute('href')!.endsWith('.dmg'))).toBe(false)
  })

  test('reaches phones as well as desktop', () => {
    // The hamburger drawer is the ONLY nav below 760px, so an entry in the desktop pill
    // alone is invisible to most visitors. The drawer carries `aria-hidden` while closed
    // (main's own pattern), so opening it is both what a phone user does and the only way
    // to see what they would see.
    renderWith(RELEASED, <Nav />)
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getAllByRole('link', { name: 'Download' })).toHaveLength(2)
  })

  test('hides it while nothing is published', () => {
    renderWith(UNRELEASED, <Nav />)
    expect(screen.queryByRole('link', { name: 'Download' })).toBeNull()
  })
})

describe('the v3 hero CTA', () => {
  test('leads with the download once a build exists', () => {
    renderWith(RELEASED, <HeroCta />)
    const primary = screen.getByRole('link', { name: /Download for macOS/i })
    expect(primary).toHaveAttribute('href', DOWNLOAD_PAGE)
    expect(primary.className).toContain('v3-btn--primary')
  })

  test('keeps the waitlist reachable after the flip', () => {
    // Someone on Windows, or without the prerequisites to hand, still needs a way to say
    // "tell me more" rather than bouncing off a button they cannot use.
    renderWith(RELEASED, <HeroCta />)
    expect(screen.getByRole('button', { name: /Join the waitlist/i })).toBeInTheDocument()
  })

  test('drops the "Sign Up" ghost, whose note stops being true', () => {
    // It revealed a "launching soon" message — false from the moment there is something to
    // launch, which is the same moment this flip happens.
    renderWith(RELEASED, <HeroCta />)
    expect(screen.queryByRole('button', { name: /^Sign Up$/i })).toBeNull()
  })

  test('stays on the waitlist while nothing is published — on the FIRST render', () => {
    // The bug this replaces: the server sent "Download for macOS" as the primary CTA with
    // no build in existence, and only the client corrected it. Measured on production.
    // Asserting synchronously is the test; anything that needed `waitFor` would mean the
    // wrong CTA had been painted first.
    renderWith(UNRELEASED, <HeroCta />)
    expect(screen.getByRole('button', { name: /Join the waitlist/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Download for macOS/i })).toBeNull()
    // The pre-launch pairing is untouched: waitlist primary, "Sign Up" ghost.
    expect(screen.getByRole('button', { name: /^Sign Up$/i })).toBeInTheDocument()
  })
})

describe('the provider', () => {
  test('refuses to render a consumer without one', () => {
    // Defaulting to `{ released: true }` would turn a forgotten provider into a permanent,
    // silent Download button on a page with nothing to download — the exact failure this
    // change removes. It must not be reachable by omission.
    const Consumer = () => <>{String(useRelease().released)}</>
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow(/ReleaseProvider/)
    spy.mockRestore()
  })
})
