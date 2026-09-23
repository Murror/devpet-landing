import { V4 } from '../content'

/**
 * The five stages of the journey, in the order the full site tells
 * them: find, build, ship, launch, run & grow.
 *
 * This replaced a set of department cards. Departments answer "who is
 * along for the ride"; stages answer "where does this take me", which
 * is the more useful thing to promise someone who has not started yet.
 * Copy is lifted verbatim from JOURNEY.phases in app/v3/content.ts so
 * the teaser and the site cannot drift apart.
 *
 * An <ol> because the order is the meaning.
 */
export default function Stages() {
  return (
    <section className="v4-section v4-stages-section">
      <h2 className="v4-h2">
        {V4.stagesHeadingLead} <em>{V4.stagesHeadingAccent}</em>
      </h2>
      <p className="v4-section-sub">{V4.stagesSub}</p>

      <ol className="v4-stages">
        {V4.stages.map((s) => (
          <li key={s.n} className="v4-stage">
            <span className="v4-stage-num">{s.n}</span>
            <span className="v4-stage-dot" aria-hidden="true" />
            <h3 className="v4-stage-label">{s.label}</h3>
            <p className="v4-stage-note">{s.note}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
