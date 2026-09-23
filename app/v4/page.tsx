import SplitText from '../v3/components/SplitText'
import { V4 } from './content'
import CompanyRing from './components/CompanyRing'
import WaitlistInline from './components/WaitlistInline'

/**
 * The pre-launch teaser. One screen, no scroll, one job: collect an
 * email address. The full marketing site lives at /v3 and is reachable
 * through the bridge link.
 *
 * SplitText takes a plain string, so the italic accent is a sibling
 * <em> rather than nested inside it — the same composition v3's hero
 * uses for lead + accent.
 */
export default function V4Page() {
  return (
    <main className="v4-screen">
      <CompanyRing />

      <div className="v4-stack">
        <p className="v4-eyebrow">{V4.eyebrow}</p>

        <h1 className="v4-headline">
          <SplitText text={V4.headlineLead} />{' '}
          <em>{V4.headlineAccent}</em>.
        </h1>

        <p className="v4-sub">{V4.sub}</p>

        <WaitlistInline />

        <p className="v4-timing">{V4.timing}</p>

        <a className="v4-bridge" href={V4.bridgeHref}>
          {V4.bridgeLabel} →
        </a>
      </div>

      <ul className="v4-socials">
        {V4.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
