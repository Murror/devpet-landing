import type { Metadata } from 'next'
// The v2 pixel-font cascade + .v2-root theme. Imported per-page because the
// App Router scopes a segment's CSS to its own layout (see app/page.tsx).
import '../v2/fonts.css'
import DownloadContent from './DownloadContent'

export const metadata: Metadata = {
  title: 'Download Codepet for macOS',
  description:
    'Download Codepet — your AI coding companion for macOS. Free, requires macOS 13 or later.',
}

export default function DownloadPage() {
  return <DownloadContent />
}
