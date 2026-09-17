import Reveal from './Reveal'
import Magnetic from './Magnetic'
import ConvergeParticles from './ConvergeParticles'
import { FINAL, FOOTER } from '../content'

/**
 * FinalCta + Footer — the "byte arrives" closer: a field of particles
 * converges into a luminous core (ConvergeParticles), a last serif echo of
 * the headline with a kinetic emphasis on the final word, a magnetic
 * primary CTA ringed by a shimmering animated border, and a minimal footer.
 */
export default function FinalCta() {
  return (
    <>
      <section className="v3-final">
        <ConvergeParticles />
        <div className="v3-final-inner">
          <Reveal>
            <h2 className="v3-final-headline">
              {FINAL.headlineLead}{' '}
              <span className="it v3-final-accent">{FINAL.headlineAccent}</span>
            </h2>
            <p className="v3-sub" style={{ margin: '22px auto 0', textAlign: 'center' }}>
              {FINAL.sub}
            </p>
            <div className="v3-final-cta">
              <Magnetic strength={0.45}>
                <a
                  href={FINAL.ctaPrimaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v3-btn v3-btn--primary v3-btn--shimmer"
                >
                  {FINAL.ctaPrimary}
                </a>
              </Magnetic>
              <a href="/blog" className="v3-btn v3-btn--ghost">{FINAL.ctaSecondary}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="v3-footer">
        <div>
          <div className="v3-footer-brand">Codepet</div>
          <div className="v3-footer-tag">{FOOTER.tagline}</div>
        </div>
        <div className="v3-footer-nav">
          <ul className="v3-footer-links">
            {FOOTER.links.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <ul className="v3-footer-links v3-footer-social">
            {FOOTER.social.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="v3-footer-copy">{FOOTER.copyright}</div>
      </footer>
    </>
  )
}
