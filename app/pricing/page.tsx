import type { Metadata } from 'next'
// The v2 pixel-font cascade + .v2-root theme. Imported per-page because the
// App Router scopes a segment's CSS to its own layout (see app/download/page.tsx).
import '../v2/fonts.css'
import PricingContent from './PricingContent'

export const metadata: Metadata = {
  title: 'Codepet pricing — start free, then $20/month',
  description:
    'Codepet pricing: a free 7-day trial, then Pro at $20/month with 800 credits included. You pay for what the AI actually does, not a flat action count.',
}

export default function PricingPage() {
  return <PricingContent />
}
