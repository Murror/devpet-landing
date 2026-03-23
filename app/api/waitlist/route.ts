import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email } = body
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }

  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID ?? '',
    })

    if (error) {
      // Resend returns 'already_exists' when a contact with this email is already in the audience
      const errName = (error as { name?: string }).name ?? ''
      const errMsg = (error as { message?: string }).message ?? ''
      if (errName === 'already_exists' || errMsg.toLowerCase().includes('already exists')) {
        return NextResponse.json({ error: 'Already on the waitlist' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
