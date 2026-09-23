import SplitText from '../v3/components/SplitText'
import { V4 } from './content'
import PetHuddle from './components/PetHuddle'
import WaitlistInline from './components/WaitlistInline'

/**
 * The pre-launch teaser. One screen, no scroll, one job: collect an
 * email address.
 *
 * The composition deliberately mirrors the live hero at /v3 — centred
 * over the same code-art backdrop, same type scale, same italic accent
 * — so the teaser and the site read as one product. The full marketing
 * site stays live at /v3, reachable by search or direct URL.
 *
 * SplitText takes a plain string, so the italic accent is a sibling
 * <em> rather than nested inside it, the same way v3's hero composes
 * lead + accent.
 */
export default function V4Page() {
  return (
    <main className="v4-screen">
      <div className="v4-bg" aria-hidden="true" />

      <div className="v4-stage">
        <PetHuddle />

        <p className="v4-eyebrow">{V4.eyebrow}</p>

        <h1 className="v4-headline">
          <SplitText text={V4.headlineLead} />
          <em>{V4.headlineAccent}</em>
        </h1>

        <p className="v4-sub">{V4.sub}</p>

        <WaitlistInline />
      </div>

      {/*
        No link to the full marketing site, by decision: the page offers
        exactly one action. /v3 stays live, indexed and in the sitemap,
        but it is reachable by search or direct URL only — not from here.
      */}
      <footer className="v4-foot">
        <ul className="v4-socials">
          {V4.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  )
}
