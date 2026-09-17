/**
 * Intro — a brief page-load panel that shows the wordmark, then wipes
 * up to reveal the hero. Pure CSS animation (see v3-fx.css) so it always
 * clears itself even if JS never runs.
 */
export default function Intro() {
  return (
    <div className="v3-intro" aria-hidden="true">
      <span className="v3-intro-word">Codepet</span>
    </div>
  )
}
