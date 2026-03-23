/**
 * @jest-environment node
 */
import { POST } from '@/app/api/waitlist/route'
import { NextRequest } from 'next/server'

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    contacts: {
      create: jest.fn().mockResolvedValue({ data: { id: 'contact-123' }, error: null }),
    },
  })),
}))

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/waitlist', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

test('returns 400 for missing email', async () => {
  const res = await POST(makeRequest({}))
  expect(res.status).toBe(400)
  const json = await res.json()
  expect(json.error).toMatch(/invalid email/i)
})

test('returns 400 for invalid email format', async () => {
  const res = await POST(makeRequest({ email: 'notanemail' }))
  expect(res.status).toBe(400)
})

test('returns 200 and success:true for valid email', async () => {
  process.env.RESEND_API_KEY = 'test-key'
  const res = await POST(makeRequest({ email: 'user@example.com' }))
  expect(res.status).toBe(200)
  const json = await res.json()
  expect(json.success).toBe(true)
})
