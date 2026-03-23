import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limit: 3 requests per IP per hour
// For production, replace with Redis via Upstash or Vercel KV
const ipCounts = new Map<string, { count: number; resetAt: number }>()
const LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api/waitlist')) {
    return NextResponse.next()
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now = Date.now()
  const entry = ipCounts.get(ip)

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return NextResponse.next()
  }

  if (entry.count >= LIMIT) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  entry.count++
  return NextResponse.next()
}

export const config = {
  matcher: '/api/waitlist',
}
