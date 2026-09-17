import { NextResponse } from 'next/server'

/**
 * Codepet waitlist endpoint — Google Apps Script webhook forwarder.
 *
 * Forwards JSON to the Apps Script web-app set in
 * GOOGLE_SHEET_WEBHOOK_URL, which appends the email to the bound
 * "Codepet Signup Email" Google Sheet. The script responds with
 * `{ result: "ok" }` on insert, `{ result: "duplicate" }` if the
 * email is already present, or `{ result: "error", message: "..." }`
 * on failure (we surface that as a 502 so the front end shows
 * "Something went wrong" instead of fake-succeeding).
 *
 * Apps Script web apps return a 302 redirect to a
 * script.googleusercontent.com URL where the actual JSON body lives,
 * so we set `redirect: 'manual'` and follow the Location header
 * with a GET ourselves.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Google Apps Script web app that appends signups to the Codepet signup
// sheet. Hardcoded so every Vercel project deploying this repo (including
// code-pet.com, which lives on a separate account) forwards to the SAME
// sheet without per-project env config. Override with WAITLIST_WEBHOOK_URL.
// This is a public endpoint (the form posts to it from the browser), so it
// is not a secret.
const WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxhdr7j_8ki3LTBm-AD8KLhn5oQAj4uoSW15gAu8hR6CY__og2U1T0afVz59yoqZmNd/exec'

export async function POST(req: Request) {
  let body: { email?: string; locale?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').toString().trim().toLowerCase()
  const locale = (body.locale || '').toString().trim()

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL || WEBHOOK_URL

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, locale }),
    redirect: 'manual',
  })

  // Apps Script returns 302; follow once via GET to fetch the JSON body.
  let finalRes = res
  if (res.status === 302 || res.status === 301) {
    const location = res.headers.get('location')
    if (location) {
      finalRes = await fetch(location)
    }
  }

  const text = await finalRes.text()
  let data: { result?: string; message?: string }
  try {
    data = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 502 })
  }

  if (data.result === 'duplicate') {
    return NextResponse.json({ status: 'duplicate' })
  }

  // Surface Apps Script errors so the front end can show a real
  // error state instead of fake-succeeding.
  if (data.result === 'error') {
    console.error('Apps Script returned error:', data)
    return NextResponse.json(
      { error: 'Save failed', detail: data.message },
      { status: 502 }
    )
  }

  if (data.result !== 'ok') {
    console.error('Apps Script returned unexpected payload:', data)
    return NextResponse.json(
      { error: 'Unexpected response from save endpoint' },
      { status: 502 }
    )
  }

  return NextResponse.json({ status: 'ok' })
}
