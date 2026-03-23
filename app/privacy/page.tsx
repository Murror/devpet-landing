import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — DevPet',
  description: 'DevPet privacy policy. We collect only your email for the waitlist and never sell your data.',
}

export default function Privacy() {
  return (
    <main className="mx-auto max-w-[640px] px-6 py-20">
      <h1 className="text-3xl font-black mb-4">Privacy Policy</h1>
      <p className="text-muted">This page is coming soon. DevPet collects only your email address for the waitlist. We will never sell your data.</p>
    </main>
  )
}
