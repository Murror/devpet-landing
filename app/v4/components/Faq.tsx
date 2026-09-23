import Reveal from '../../v3/components/Reveal'
import { V4 } from '../content'

/**
 * The four objections a pre-launch page cannot dodge: when, how much,
 * do I need to code, do I need a Mac.
 *
 * Built on native <details>/<summary> rather than a state-driven
 * accordion — it needs no client JavaScript, it is keyboard accessible
 * and screen-reader correct for free, and the answers are still in the
 * DOM for search engines when collapsed.
 *
 * Each row reveals on scroll with a small stagger, so the list arrives
 * as a sequence rather than a block.
 */
export default function Faq() {
  return (
    <section className="v4-section v4-faq">
      <Reveal>
        <h2 className="v4-h2">{V4.faqHeading}</h2>
      </Reveal>

      <div className="v4-faq-list">
        {V4.faq.map((item, i) => (
          <Reveal key={item.q} delay={80 + i * 70}>
            <details className="v4-faq-item">
              <summary className="v4-faq-q">
                {item.q}
                <span className="v4-faq-mark" aria-hidden="true" />
              </summary>
              <p className="v4-faq-a">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
