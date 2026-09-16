import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '@/lib/LocaleProvider'
import WaitlistForm from '@/components/WaitlistForm'

function renderForm() {
  return render(
    <LocaleProvider><WaitlistForm /></LocaleProvider>
  )
}

global.fetch = jest.fn()

/**
 * Mock the waitlist endpoint BY URL rather than by call order.
 *
 * `mockResolvedValueOnce` was the bug. LocaleProvider fetches `api.country.is` on mount to
 * detect the visitor's locale, and that call happens FIRST — so the one-shot mock was spent
 * on geo detection, WaitlistForm's own fetch got `jest.fn()`'s default `undefined`, and
 * `res.json()` threw into the component's catch. Every test here landed in the error state
 * no matter what it had mocked.
 *
 * That made the 500 test pass for the wrong reason: it asserts the error state, and the
 * error state is what a broken mock produces. A test that cannot fail is worse than a
 * missing one, because it is counted.
 */
function mockWaitlist(response: unknown) {
  ;(global.fetch as jest.Mock).mockImplementation((url: unknown) => {
    if (typeof url === 'string' && url.includes('api.country.is')) {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ country: 'US' }) })
    }
    return Promise.resolve(response)
  })
}

afterEach(() => jest.clearAllMocks())

test('renders email input and submit button', () => {
  renderForm()
  expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /join waitlist/i })).toBeInTheDocument()
})

test('shows validation error for invalid email', async () => {
  const user = userEvent.setup()
  renderForm()
  await user.type(screen.getByPlaceholderText('your@email.com'), 'notanemail')
  fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
  // Copy, not behaviour: `form.errorValidation` in en.json is "Invalid email." — the
  // longer sentence this used to assert is gone.
  expect(await screen.findByText('Invalid email.')).toBeInTheDocument()
})

test('shows success message on 200 response', async () => {
    mockWaitlist({
    ok: true,
    status: 200,
    json: async () => ({ success: true }),
  })
  const user = userEvent.setup()
  renderForm()
  await user.type(screen.getByPlaceholderText('your@email.com'), 'user@example.com')
  fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
  // Same: `form.success` now reads "You're in! We'll keep you posted."
  expect(await screen.findByText(/you're in/i)).toBeInTheDocument()
})

test('shows duplicate message on 409 response', async () => {
  // The CONTRACT changed, not just the words. `app/api/waitlist/route.ts:71` answers a
  // duplicate with HTTP 200 and `{ status: 'duplicate' }` in the body; the 409-plus-`error`
  // shape this used to mock no longer exists anywhere. WaitlistForm keys off `data.status`,
  // so the old mock fell through to the generic error branch — the component was right and
  // the test was describing a dead API.
    mockWaitlist({
    ok: true,
    status: 200,
    json: async () => ({ status: 'duplicate' }),
  })
  const user = userEvent.setup()
  renderForm()
  await user.type(screen.getByPlaceholderText('your@email.com'), 'user@example.com')
  fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
  expect(await screen.findByText(/already on the list/i)).toBeInTheDocument()
})

test('shows server error message on 500 response', async () => {
    mockWaitlist({
    ok: false,
    status: 500,
    json: async () => ({ error: 'Something went wrong' }),
  })
  const user = userEvent.setup()
  renderForm()
  await user.type(screen.getByPlaceholderText('your@email.com'), 'user@example.com')
  fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
})
