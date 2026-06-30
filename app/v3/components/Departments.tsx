import Image from 'next/image'
import Reveal from './Reveal'
import SplitText from './SplitText'
import DeptGallery from './DeptGallery'
import { DEPARTMENTS } from '../content'

/**
 * Departments — the eight code-art covers from the product app, reframed
 * as a pinned horizontal scroll gallery (DeptGallery) with 3D tilt cards.
 * The heading + editorial showcase stay in the centred column; the gallery
 * breaks full-bleed when it pins. `v3-no-skew` opts the section out of the
 * velocity skew so the pinned viewport never shears.
 */
export default function Departments() {
  return (
    <section id="departments" className="v3-section v3-no-skew">
      <Reveal>
        <p className="v3-eyebrow">{DEPARTMENTS.eyebrow}</p>
        <h2 className="v3-h2">
          <SplitText text={DEPARTMENTS.headlineLead} className="v3-lead" />{' '}
          <SplitText text={DEPARTMENTS.headlineAccent} className="it" />
        </h2>
        <p className="v3-sub">{DEPARTMENTS.sub}</p>
      </Reveal>

      <Reveal>
        <div className="v3-showcase v3-img-reveal" data-parallax="0.05">
          <Image src="/v3/coder-couch.jpg" alt="One builder, a whole company of work" fill sizes="(max-width: 720px) 100vw, 1180px" unoptimized />
          <div className="v3-showcase-cap">
            <h3>One person. A whole company’s worth of work.</h3>
            <p>Codepet carries the load across every department — so it never all lands on you at once.</p>
          </div>
        </div>
      </Reveal>

      <DeptGallery items={DEPARTMENTS.items} />
    </section>
  )
}
