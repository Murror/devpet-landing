/**
 * Atmosphere — fixed background layers behind all content:
 * three slowly drifting nebula glows + a film-grain overlay.
 * Pure CSS (see v3-fx.css); rendered once at the top of the page.
 */
export default function Atmosphere() {
  return (
    <>
      <div className="v3-atmos" aria-hidden="true">
        <div className="v3-nebula v3-nebula--a" />
        <div className="v3-nebula v3-nebula--b" />
        <div className="v3-nebula v3-nebula--c" />
      </div>
      <div className="v3-grain" aria-hidden="true" />
    </>
  )
}
