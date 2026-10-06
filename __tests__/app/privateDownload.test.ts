/**
 * @jest-environment node
 */
import { GET } from '@/app/d/[token]/route'
import { DOWNLOAD_TARGET } from '@/lib/download'

const call = (token: string) =>
  GET(new Request(`https://code-pet.com/d/${token}`), { params: Promise.resolve({ token }) })

const env = process.env

beforeEach(() => {
  process.env = { ...env }
  delete process.env.PRIVATE_DOWNLOAD_TOKEN
  delete process.env.PRIVATE_DOWNLOAD_URL
})
afterAll(() => {
  process.env = env
})

test('is off — a 404 for every token — until a token is configured', async () => {
  expect((await call('anything')).status).toBe(404)
  expect((await call('')).status).toBe(404)
})

test('a wrong token is a plain 404', async () => {
  process.env.PRIVATE_DOWNLOAD_TOKEN = 'right-token'
  const res = await call('wrong-token')
  expect(res.status).toBe(404)
  expect(res.headers.get('Location')).toBeNull()
})

test('the right token forwards to the .dmg, defaulting to the release asset', async () => {
  process.env.PRIVATE_DOWNLOAD_TOKEN = 'right-token'
  const res = await call('right-token')
  expect(res.status).toBe(307)
  expect(res.headers.get('Location')).toBe(DOWNLOAD_TARGET)
})

test('PRIVATE_DOWNLOAD_URL moves the file without changing the link', async () => {
  process.env.PRIVATE_DOWNLOAD_TOKEN = 'right-token'
  process.env.PRIVATE_DOWNLOAD_URL = 'https://example.com/Codepet.dmg'
  expect((await call('right-token')).headers.get('Location')).toBe('https://example.com/Codepet.dmg')
})

test('is never indexed or cached, hit or miss', async () => {
  process.env.PRIVATE_DOWNLOAD_TOKEN = 'right-token'
  for (const res of [await call('right-token'), await call('nope')]) {
    expect(res.headers.get('X-Robots-Tag')).toContain('noindex')
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  }
})
