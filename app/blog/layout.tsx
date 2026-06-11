// Loads the v2 design system (pixel @font-faces + .v2-* styles) for the
// blog so its header/footer match the main site exactly. Scoped to the
// /blog segment; the landing imports the same sheet separately.
import '../v2/fonts.css'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
