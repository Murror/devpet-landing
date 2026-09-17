import Image from 'next/image'
import Reveal from './Reveal'
import DeptGallery from './DeptGallery'
import { DEPARTMENTS } from '../content'

/**
 * Departments — an editorial showcase band leading into a pinned horizontal
 * scroll gallery (DeptGallery) with 3D tilt cards. The section heading now
 * lives inside the pinned frame (above the cards) so it fills the space and
 * stays visible while the cards scroll. `v3-no-skew` opts the section out of
 * the velocity skew so the pinned viewport never shears.
 */
export default function Departments() {
  return (
    <section id="departments" className="v3-section v3-no-skew">
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
