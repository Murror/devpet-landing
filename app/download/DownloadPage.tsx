'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/LocaleProvider'
import { DOWNLOAD_PATH, RELEASES_PAGE, MIN_MACOS } from '@/lib/download'
import { Bold } from './Bold'

/**
 * `murror.app/download` — the page the "Download for macOS" button lands on.
 *
 * It is deliberately NOT a second landing page. Someone arriving here has already decided;
 * the job is to get them the file and then tell them the two things that will otherwise
 * make the app look broken on their machine:
 *
 *   1. The first-launch right-click. macOS asks for it on any app installed outside the
 *      App Store, notarized or not, and a user who does not know that reads the dialog as
 *      "this software is unsafe" and stops.
 *   2. Claude Code and Node. Codepet runs every model call on the founder's own Claude
 *      plan, so an install without them opens to an app that cannot do its main thing.
 *      Saying so before the download is the difference between a known prerequisite and a
 *      product that looks broken.
 *
 * Both are stated plainly rather than buried, because the cost of hiding them is not a
 * worse conversion rate — it is a user who installs, hits a wall, and concludes the app
 * does not work.
 */
export default function DownloadPage() {
  const { t } = useLocale()
  const c = t.download

  return (
    <main className="mx-auto max-w-[680px] px-6 py-16 sm:py-24">
      {/* `next/link` for an internal route — it prefetches and client-navigates. The
          download button below stays a plain <a> on purpose: its target is a redirect to
          another origin, not a page in this app. */}
      <Link href="/" className="text-sm text-muted hover:text-primary">
        ← Codepet
      </Link>

      <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {c.eyebrow}
      </p>
      <h1 className="mt-3 text-[32px] leading-[1.15] font-bold text-heading sm:text-[40px]">
        {c.title}
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-text">{c.subtitle}</p>

      {/* The button. A plain <a> to our own path — the 307 in next.config.ts does the
          forwarding, so nothing here knows or cares where the file is hosted today.
          No `download` attribute: the response is a cross-origin redirect, and the
          attribute is silently ignored on those, so it would only be a lie in the markup. */}
      <div className="mt-10">
        <a
          href={DOWNLOAD_PATH}
          className="inline-flex items-center justify-center rounded-pill bg-primary px-8 py-4 text-[17px] font-bold text-white shadow-btn transition hover:bg-primary-dark"
        >
          {c.cta}
        </a>
        <p className="mt-3 text-sm text-muted">
          {c.ctaMeta.replace('{version}', MIN_MACOS)}
        </p>
        <a
          href={RELEASES_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm text-primary hover:underline"
        >
          {c.allVersions}
        </a>
      </div>

      {/* Installing */}
      <section className="mt-14 rounded-lg border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-bold text-heading">{c.installTitle}</h2>
        <ol className="mt-4 space-y-3">
          {c.installSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-text">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-primary-tint text-xs font-bold text-primary-dark"
              >
                {i + 1}
              </span>
              <span>
                <Bold text={step} />
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm leading-relaxed text-muted">{c.installNote}</p>
      </section>

      {/* The Gatekeeper escape hatch. Its own block rather than a fourth step: it is not
          part of the normal path, and numbering it would suggest everyone has to do it. */}
      <section className="mt-6 rounded-lg border border-border p-6 sm:p-8">
        <h2 className="text-lg font-bold text-heading">{c.gatekeeperTitle}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-text">
          <Bold text={c.gatekeeperBody} />
        </p>
      </section>

      {/* Prerequisites — ABOVE the fold of the "what now" section rather than in a footnote,
          because this is the one that decides whether the app works at all. */}
      <section className="mt-6 rounded-lg border border-primary-tint bg-primary-tint/40 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-heading">{c.requirementsTitle}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-text">
          <Bold text={c.requirementsBody} />
        </p>
        <a
          href="https://claude.com/claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-bold text-primary hover:underline"
        >
          {c.requirementsLink} →
        </a>
      </section>

      <p className="mt-10 text-sm text-muted">
        {c.footerNote}{' '}
        <a href="mailto:nguyen@murror.app" className="text-primary hover:underline">
          nguyen@murror.app
        </a>
      </p>
    </main>
  )
}
