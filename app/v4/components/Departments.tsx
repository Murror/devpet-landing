import { V4 } from '../content'

/**
 * Three of the eight departments, each with the pet the full site gives
 * it. This is the section that turns the headline's claim into
 * something concrete — "a whole company" means named roles doing named
 * work, not a vague promise.
 *
 * Three rather than eight on purpose: the point is to show the shape of
 * the idea, not to inventory it. The footnote names the rest.
 */
export default function Departments() {
  return (
    <section className="v4-section v4-depts">
      <h2 className="v4-h2">{V4.departmentsHeading}</h2>

      <ul className="v4-dept-grid">
        {V4.departments.map((d) => (
          <li key={d.name} className="v4-dept">
            <img className="v4-dept-pet" src={d.pet} alt="" aria-hidden="true" />
            <h3 className="v4-dept-name">{d.name}</h3>
            <p className="v4-dept-need">{d.need}</p>
          </li>
        ))}
      </ul>

      <p className="v4-dept-more">{V4.departmentsFootnote}</p>
    </section>
  )
}
