import Reveal from '../../v3/components/Reveal'
import { V4 } from '../content'

/**
 * The five stages of the journey, in the order the full site tells
 * them: find, build, ship, launch, run & grow.
 *
 * Departments answered "who is along for the ride"; stages answer
 * "where does this take me", which is the more useful promise for
 * someone who has not started yet. Copy is lifted verbatim from
 * JOURNEY.phases in app/v3/content.ts so the two cannot drift apart.
 *
 * The path is a real SVG curve rather than a rule, echoing the arc on
 * the site's Journey section, and it draws itself in when the section
 * scrolls into view.
 *
 * Dot alignment is by construction, not by fiddling: the viewBox is
 * 1000x80 and the container is 80px tall, so viewBox units map 1:1 to
 * pixels vertically and to percentages horizontally. The curve passes
 * through x = 100/300/500/700/900, which is exactly 10/30/50/70/90% —
 * the centres of five equal columns — and each dot is given the same y
 * the curve has at its x. Change one, change the other.
 */
const RAIL_PATH =
  'M 100 56 C 160 50, 240 42, 300 40 C 360 38, 440 30, 500 30 ' +
  'C 560 30, 640 36, 700 40 C 760 44, 840 49, 900 52'

/** y of the curve at each dot's x, in viewBox units = pixels. */
const DOT_Y = [56, 40, 30, 40, 52]

export default function Stages() {
  return (
    <section className="v4-section v4-stages-section">
      <Reveal>
        <h2 className="v4-h2">
          {V4.stagesHeadingLead} <em>{V4.stagesHeadingAccent}</em>
        </h2>
        <p className="v4-section-sub">{V4.stagesSub}</p>
      </Reveal>

      <Reveal delay={140}>
        <div className="v4-rail">
          <svg
            className="v4-rail-svg"
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="v4-rail-path" d={RAIL_PATH} />
          </svg>

          {V4.stages.map((s, i) => (
            <span
              key={s.n}
              className="v4-rail-dot"
              style={{ left: `${10 + i * 20}%`, top: `${DOT_Y[i]}px` }}
              aria-hidden="true"
            />
          ))}
        </div>

        <ol className="v4-stages">
          {V4.stages.map((s) => (
            <li key={s.n} className="v4-stage">
              <span className="v4-stage-num">{s.n}</span>
              <h3 className="v4-stage-label">{s.label}</h3>
              <p className="v4-stage-note">{s.note}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
