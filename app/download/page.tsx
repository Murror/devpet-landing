import type { Metadata } from 'next'
// The v2 pixel-font cascade + .v2-root theme. Imported per-page because the
// App Router scopes a segment's CSS to its own layout (see app/page.tsx).
import '../v2/fonts.css'
import DownloadContent from './DownloadContent'
import { getReleaseState } from '@/lib/releaseServer'
import { PUBLIC_DOWNLOAD_ENABLED } from '@/lib/download'
import { ReleaseProvider } from '@/lib/ReleaseProvider'

// Before launch the page is "coming soon", so its metadata must not describe a download —
// link previews and search snippets are read far more often than the page itself.
export const metadata: Metadata = PUBLIC_DOWNLOAD_ENABLED
  ? {
      title: 'Download Codepet for macOS',
      description:
        'Download Codepet — your AI coding companion for macOS. Free, requires macOS 26.2 or later.',
    }
  : { title: 'Codepet — coming soon', description: 'Codepet is coming soon. Join the waitlist.' }

export default async function DownloadPage() {
  // Same reason as the landing page: this decides whether the visitor sees a download button
  // or "not released yet", and getting that wrong for one render is getting it wrong on the
  // page whose entire purpose is the answer.
  const release = await getReleaseState()

  return (
    <ReleaseProvider value={release}>
      <DownloadContent />
    </ReleaseProvider>
  )
}
