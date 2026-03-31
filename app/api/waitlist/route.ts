import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('GOOGLE_SHEET_WEBHOOK_URL is not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  // Apps Script returns a 302 redirect; follow it manually to preserve the response
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
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
  let data: { result?: string }
  try {
    data = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 502 })
  }

  if (data.result === 'duplicate') {
    return NextResponse.json({ status: 'duplicate' })
  }

  return NextResponse.json({ status: 'ok' })
}
