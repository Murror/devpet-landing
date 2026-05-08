import { NextResponse } from 'next/server'

/**
 * Profile-survey endpoint — accepts the optional 5-field demographic
 * data submitted via <ProfileSurvey /> after a successful waitlist
 * signup.
 *
 * Payload:
 *   {
 *     email:        string  (required, used as the row key)
 *     age?:         string  ("Under 18" | "18 – 24" | ...)
 *     gender?:      string
 *     source?:      string
 *     sourceOther?: string  (free-text when source === "Other")
 *     signupFor?:   "self" | "family"
 *     familyAge?:   string  (only set when signupFor === "family")
 *   }
 *
 * Forwarded to GOOGLE_SHEET_PROFILE_WEBHOOK_URL, an Apps Script web-
 * app that upserts the row in the Codepet Signup Email sheet by
 * email. Falls back to GOOGLE_SHEET_WEBHOOK_URL when the profile-
 * specific var isn't set, because the unified Apps Script (which
 * routes by payload shape) is typically reachable at the same URL
 * the signup endpoint uses. If neither env var is set (preview
 * deploys without backend wiring), we log the payload and return
 * ok so the UI flow stays testable.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ALLOWED_SIGNUP_FOR = new Set(['self', 'family'])

interface ProfileBody {
  email?: string
  age?: string
  gender?: string
  source?: string
  sourceOther?: string
  signupFor?: string
  familyAge?: string
  needs?: string
}

export async function POST(req: Request) {
  let body: ProfileBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').toString().trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Allowlist values to keep typos / injection out of the sheet.
  const signupFor = ALLOWED_SIGNUP_FOR.has(body.signupFor || '')
    ? body.signupFor
    : undefined

  const payload = {
    email,
    age: cleanString(body.age, 32),
    gender: cleanString(body.gender, 32),
    source: cleanString(body.source, 64),
    sourceOther: cleanString(body.sourceOther, 120),
    signupFor,
    familyAge: cleanString(body.familyAge, 32),
    needs: cleanString(body.needs, 500),
  }

  // Prefer the profile-specific URL; fall back to the shared
  // signup URL since the unified Apps Script handles both shapes.
  // This avoids requiring teams to configure two env vars when one
  // suffices.
  const webhookUrl =
    process.env.GOOGLE_SHEET_PROFILE_WEBHOOK_URL ||
    process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (!webhookUrl) {
    // Preview-friendly fallback: log + accept so the UI flow works
    // without any backend configuration.
    console.info('[waitlist/profile] no webhook configured, logging:', payload)
    return NextResponse.json({ status: 'ok', logged: true })
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'manual',
  })

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
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 502 })
  }

  if (data.result === 'error') {
    console.error('Profile webhook returned error:', data)
    return NextResponse.json(
      { error: 'Save failed', detail: data.message },
      { status: 502 }
    )
  }

  return NextResponse.json({ status: 'ok' })
}

function cleanString(v: unknown, maxLen: number): string | undefined {
  if (typeof v !== 'string') return undefined
  const trimmed = v.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, maxLen)
}
