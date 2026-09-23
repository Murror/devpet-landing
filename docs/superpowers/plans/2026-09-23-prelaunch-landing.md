# Pre-launch Landing Page — Implementation Plan (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put a one-screen, no-scroll waitlist teaser at the root of `code-pet.com` while the existing marketing site stays live and indexed at `/v3`.

**Architecture:** A new self-contained `app/v4/` segment, following the same generational pattern as `app/v2/` and `app/v3/`. It reuses v3's design tokens by importing `../v3/v3.css` and mounting inside the `.v3` scope — the same technique `BlogShell.tsx` already uses for the blog — rather than defining a second design system. The root `app/page.tsx` is a thin shim that re-exports whichever generation is current; flipping it is the last commit, so launch day is a single `git revert`.

**Tech Stack:** Next.js (App Router), React, TypeScript, Jest + ts-jest + @testing-library/react. **No new dependencies in Phase 1.**

**Spec:** `docs/superpowers/specs/2026-09-23-prelaunch-landing-design.md`

## Global Constraints

Every task's requirements implicitly include these.

- **Branch:** `feat/prelaunch-landing`. **Never commit to `main`** — `main` is an immediate production deploy to `code-pet.com` via a Vercel project on an account we do not control.
- **This Next.js version has breaking changes vs. training-data defaults.** Per `CLAUDE.md`: when touching anything under `app/`, consult `node_modules/next/dist/docs/` before writing code and heed deprecation notices.
- **English only.** Do not import `useLocale` or wrap anything in `LocaleProvider`; the root has never been bilingual.
- **Two fonts only:** `Google_Sans_Flex` and `Playfair_Display` (italic). The pixel font (Minecraft, `--v3-pixel`) must not appear in this segment.
- **Import `../v3/v3.css` only. Never import `v3-fx.css`** — it is 1,104 lines of machinery this page does not use.
- **Copy is fixed.** Every user-visible string comes from `app/v4/content.ts`. The headline is exactly `Let's build your whole company.` and the timing line is exactly `Launching this autumn`.
- **Test command:** `npx jest <path>` from the repo root.
- **No new npm dependencies.** Phase 1 adds none; `three` belongs to Phase 2.

---

### Task 1: Copy module and the waitlist form

The form is the only interactive thing on the page and holds all the logic, so it goes first.

**Files:**
- Create: `app/v4/content.ts`
- Create: `app/v4/components/WaitlistInline.tsx`
- Test: `__tests__/components/WaitlistInline.test.tsx`

**Interfaces:**
- Consumes: the existing `POST /api/waitlist` endpoint, which accepts `{ email: string, locale: string }` and responds `{ status: 'ok' }`, `{ status: 'duplicate' }`, or a non-2xx with `{ error: string }`. Do not modify it.
- Produces: `V4` (const object, default-exported as a named export from `content.ts`) and `WaitlistInline` (default export). Tasks 2 and 3 import both.

- [ ] **Step 1: Write the content module**

Create `app/v4/content.ts`:

```ts
/**
 * Every user-visible string on the pre-launch teaser, in one place —
 * mirroring the convention in app/v3/content.ts.
 *
 * Social URLs are copied from app/v3/content.ts so the teaser and the
 * full site point at the same accounts.
 */
export const V4 = {
  eyebrow: 'Codepet · by Murror',
  // The headline is split so the design can render the tail in an
  // italic accent (Playfair Display), matching v3's hero treatment.
  headlineLead: "Let's build your",
  headlineAccent: 'whole company',
  sub: 'Building something of your own means being the whole team at once. Codepet is the AI cofounder who carries it with you.',
  emailPlaceholder: 'you@email.com',
  ctaLabel: 'Join the waitlist',
  timing: 'Launching this autumn',
  bridgeLabel: "See what we're building",
  bridgeHref: '/v3',
  messages: {
    invalid: 'Please enter a valid email address.',
    success: "You're on the list. We'll be in touch.",
    duplicate: "You're already on the list.",
    error: 'Something went wrong. Try again?',
  },
  socials: [
    { label: 'X', href: 'https://x.com/codepetapp' },
    { label: 'Instagram', href: 'https://www.instagram.com/codepetapp/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/codepet/' },
    { label: 'GitHub', href: 'https://github.com/My-Outcasts' },
    { label: 'Discord', href: 'https://discord.gg/k6N2TdyTb' },
  ],
  // The eight companion SVGs in public/characters/, used by the ring.
  companions: ['byte', 'luna', 'nova', 'sage', 'crash', 'glitch', 'null', 'zero'],
} as const
```

- [ ] **Step 2: Write the failing tests**

Create `__tests__/components/WaitlistInline.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WaitlistInline from '@/app/v4/components/WaitlistInline'

global.fetch = jest.fn()
afterEach(() => jest.clearAllMocks())

function fill(value: string) {
  return userEvent.setup().type(screen.getByPlaceholderText('you@email.com'), value)
}
function submit() {
  fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }))
}

test('rejects a malformed address without calling the API', async () => {
  render(<WaitlistInline />)
  await fill('notanemail')
  submit()
  expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument()
  expect(global.fetch).not.toHaveBeenCalled()
})

test('posts email and locale to the waitlist endpoint', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true, status: 200, json: async () => ({ status: 'ok' }),
  })
  render(<WaitlistInline />)
  await fill('founder@example.com')
  submit()
  await screen.findByText("You're on the list. We'll be in touch.")
  expect(global.fetch).toHaveBeenCalledWith('/api/waitlist', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({ email: 'founder@example.com', locale: 'en' }),
  }))
})

test('treats a duplicate as success, not an error', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true, status: 200, json: async () => ({ status: 'duplicate' }),
  })
  render(<WaitlistInline />)
  await fill('founder@example.com')
  submit()
  expect(await screen.findByText("You're already on the list.")).toBeInTheDocument()
})

test('shows an error and keeps the address on a 502', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false, status: 502, json: async () => ({ error: 'Save failed' }),
  })
  render(<WaitlistInline />)
  await fill('founder@example.com')
  submit()
  expect(await screen.findByText('Something went wrong. Try again?')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('you@email.com')).toHaveValue('founder@example.com')
})

test('shows an error when the request throws', async () => {
  ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'))
  render(<WaitlistInline />)
  await fill('founder@example.com')
  submit()
  expect(await screen.findByText('Something went wrong. Try again?')).toBeInTheDocument()
})
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `npx jest __tests__/components/WaitlistInline.test.tsx`
Expected: FAIL — `Cannot find module '@/app/v4/components/WaitlistInline'`.

- [ ] **Step 4: Implement the form**

Create `app/v4/components/WaitlistInline.tsx`:

```tsx
'use client'

import { useState, type FormEvent } from 'react'
import { V4 } from '../content'

/**
 * WaitlistInline — the teaser's only interactive element.
 *
 * Posts to the existing /api/waitlist endpoint (Apps Script → Google
 * Sheet). A duplicate address is a success, not a failure: the person
 * is on the list either way. On error the entered address is kept so a
 * retry doesn't mean retyping it.
 *
 * Self-contained on purpose — the shared components/WaitlistForm.tsx
 * depends on LocaleProvider, which the English-only root doesn't mount.
 */
type FormState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function WaitlistInline() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [invalid, setInvalid] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setInvalid(false)

    if (!EMAIL_RE.test(email)) {
      setInvalid(true)
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale: 'en' }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.status === 'duplicate') setState('duplicate')
      else if (res.ok) setState('success')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success' || state === 'duplicate') {
    return (
      <p className="v4-done" role="status">
        {state === 'duplicate' ? V4.messages.duplicate : V4.messages.success}
      </p>
    )
  }

  return (
    <form className="v4-form" onSubmit={handleSubmit} noValidate>
      <label className="v4-sr" htmlFor="v4-email">Email address</label>
      <input
        id="v4-email"
        type="email"
        className="v4-input"
        placeholder={V4.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={invalid || undefined}
      />
      <button type="submit" className="v4-btn" disabled={state === 'loading'}>
        {V4.ctaLabel}
      </button>
      {invalid && (
        <p className="v4-msg v4-msg--err" role="alert">{V4.messages.invalid}</p>
      )}
      {state === 'error' && (
        <p className="v4-msg v4-msg--err" role="alert">{V4.messages.error}</p>
      )}
    </form>
  )
}
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npx jest __tests__/components/WaitlistInline.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add app/v4/content.ts app/v4/components/WaitlistInline.tsx __tests__/components/WaitlistInline.test.tsx
git commit -m "Add v4 copy module and the pre-launch waitlist form

A duplicate address counts as success — the person is on the list
either way — and an error keeps the typed address so a retry isn't a
retype. Self-contained rather than reusing components/WaitlistForm.tsx,
which needs LocaleProvider that the English-only root doesn't mount.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: The companion ring

The Phase 1 hero. Eight companion SVGs arranged in a static CSS ring. In Phase 2 this becomes the fallback shown below 820px and under `prefers-reduced-motion`, with WebGL replacing it elsewhere — so it is built now as a standalone component rather than as throwaway decoration.

**Files:**
- Create: `app/v4/components/CompanyRing.tsx`
- Test: `__tests__/components/CompanyRing.test.tsx`

**Interfaces:**
- Consumes: `V4.companions` from Task 1 — a readonly array of eight lowercase name strings matching filenames in `public/characters/`.
- Produces: `CompanyRing` (default export), a **server component** taking no props. Task 3 renders it.

Uses a plain `<img>`, not `next/image`: the sources are SVGs (which `next/image` does not optimise anyway) and it keeps the component testable in jsdom without mocking the image loader.

- [ ] **Step 1: Write the failing test**

Create `__tests__/components/CompanyRing.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import CompanyRing from '@/app/v4/components/CompanyRing'
import { V4 } from '@/app/v4/content'

test('renders one node per companion, pointing at the SVG files', () => {
  const { container } = render(<CompanyRing />)
  const imgs = container.querySelectorAll('img')
  expect(imgs).toHaveLength(8)
  expect(imgs).toHaveLength(V4.companions.length)
  expect(imgs[0]).toHaveAttribute('src', '/characters/byte.svg')
})

test('is decorative and hidden from assistive tech', () => {
  const { container } = render(<CompanyRing />)
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  // No alt text — every image is presentational.
  container.querySelectorAll('img').forEach((img) => {
    expect(img).toHaveAttribute('alt', '')
  })
})

test('gives each node its index so CSS can place it on the circle', () => {
  const { container } = render(<CompanyRing />)
  const nodes = container.querySelectorAll<HTMLElement>('.v4-ring-node')
  expect(nodes).toHaveLength(8)
  // Read the custom property rather than string-matching the style
  // attribute — React's serialisation of custom properties isn't
  // something to assert on.
  expect(nodes[3].style.getPropertyValue('--i')).toBe('3')
})
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx jest __tests__/components/CompanyRing.test.tsx`
Expected: FAIL — `Cannot find module '@/app/v4/components/CompanyRing'`.

- [ ] **Step 3: Implement the ring**

Create `app/v4/components/CompanyRing.tsx`:

```tsx
import type { CSSProperties } from 'react'
import { V4 } from '../content'

/**
 * CompanyRing — the eight companions arranged on a circle around the
 * headline. One founder, a whole company around them.
 *
 * Purely decorative, so aria-hidden with empty alt text. Position is
 * CSS's job: each node carries its index as --i and v4.css rotates it
 * into place, which keeps this a server component with no layout maths.
 *
 * Phase 2 replaces this with a WebGL orbit on capable devices and keeps
 * it as the fallback below 820px and under prefers-reduced-motion.
 */
export default function CompanyRing() {
  return (
    <div className="v4-ring" aria-hidden="true">
      {V4.companions.map((name, i) => (
        <span
          key={name}
          className="v4-ring-node"
          style={{ ['--i']: i } as CSSProperties}
        >
          <img src={`/characters/${name}.svg`} alt="" width={64} height={64} />
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx jest __tests__/components/CompanyRing.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add app/v4/components/CompanyRing.tsx __tests__/components/CompanyRing.test.tsx
git commit -m "Add the companion ring — eight pets circling the headline

Decorative and server-rendered; CSS does the placement from an --i
index so there's no layout maths in the component. Becomes the mobile
and reduced-motion fallback when the WebGL orbit lands in Phase 2.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: The segment — layout, stylesheet, page

After this task `/v4` is a complete, reviewable page. The root is still v3.

**Files:**
- Create: `app/v4/layout.tsx`
- Create: `app/v4/v4.css`
- Create: `app/v4/page.tsx`
- Modify: `jest.setup.ts`
- Test: `__tests__/components/v4-page.test.tsx`

**Interfaces:**
- Consumes: `V4` (Task 1), `WaitlistInline` (Task 1), `CompanyRing` (Task 2), and `SplitText` from `app/v3/components/SplitText` — whose props are exactly `{ text: string; className?: string }`. **`SplitText` accepts a plain string only**, so the italic accent must be a sibling `<em>`, not nested inside it. This mirrors how v3's own hero composes lead + accent.
- Produces: `V4Page` (default export of `app/v4/page.tsx`) and `V4Layout` (default export of `app/v4/layout.tsx`). Task 6 imports `V4Page`.

- [ ] **Step 1: Add an IntersectionObserver stub to the Jest setup**

`SplitText` constructs an `IntersectionObserver`, which does not exist in jsdom, so every test that renders the page would throw. Replace `jest.setup.ts` with:

```ts
import '@testing-library/jest-dom'

// jsdom has no IntersectionObserver. v3's motion primitives (SplitText,
// Reveal) construct one on mount, so any test rendering them needs a
// stub. Observing immediately reports the element as intersecting,
// which matches the real behaviour on a single-screen page where
// everything is in view at load.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  constructor(private cb: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.cb(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as IntersectionObserver,
    )
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
```

- [ ] **Step 2: Write the failing page test**

Create `__tests__/components/v4-page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import V4Page from '@/app/v4/page'
import { V4 } from '@/app/v4/content'

test('renders the full headline with the accent as a separate element', () => {
  const { container } = render(<V4Page />)
  // SplitText breaks the lead into per-word spans, so assert on the
  // accumulated text rather than a single text node.
  expect(container.textContent).toContain("Let's build your")
  const accent = container.querySelector('.v4-headline em')
  expect(accent).toHaveTextContent('whole company')
})

test('bridges to the full site at /v3', () => {
  render(<V4Page />)
  const bridge = screen.getByRole('link', { name: /see what we're building/i })
  expect(bridge).toHaveAttribute('href', '/v3')
})

test('renders all five social links with their real URLs', () => {
  render(<V4Page />)
  V4.socials.forEach((s) => {
    expect(screen.getByRole('link', { name: s.label })).toHaveAttribute('href', s.href)
  })
})

test('shows the timing line and the waitlist field', () => {
  render(<V4Page />)
  expect(screen.getByText('Launching this autumn')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument()
})

test('has exactly one h1', () => {
  render(<V4Page />)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})
```

- [ ] **Step 3: Run the test and confirm it fails**

Run: `npx jest __tests__/components/v4-page.test.tsx`
Expected: FAIL — `Cannot find module '@/app/v4/page'`.

- [ ] **Step 4: Write the layout**

Create `app/v4/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
// Tokens only. v3-fx.css is deliberately NOT imported — it is 1,104
// lines of dept tilt, copilot and Lenis machinery this page never uses.
import '../v3/v3.css'
import './v4.css'

const gsans = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-gsans',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['400'],
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Codepet — Let's build your whole company",
  description:
    'Codepet is the AI cofounder for founders building their own product and company. A macOS app, launching this autumn. Join the waitlist.',
}

export default function V4Layout({ children }: { children: React.ReactNode }) {
  // Mounting inside `.v3` inherits the token scope without duplicating
  // it — the same approach BlogShell.tsx uses for the blog.
  return <div className={`v3 v4 ${gsans.variable} ${playfair.variable}`}>{children}</div>
}
```

- [ ] **Step 5: Write the stylesheet**

Create `app/v4/v4.css`:

```css
/* ------------------------------------------------------------------
   v4 — the pre-launch teaser.

   Tokens come from ../v3/v3.css (imported by layout.tsx). This file
   holds only the one-screen layout, so the whole segment can be deleted
   at launch without touching v3.
   ------------------------------------------------------------------ */

.v4 { min-height: 100svh; }

.v4-screen {
  position: relative;
  min-height: 100svh;
  max-width: 1180px;
  margin: 0 auto;
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

/* Static halo. In Phase 2 the WebGL canvas mounts behind this, so the
   composition still reads before the scene initialises. */
.v4-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(760px 420px at 22% 18%, rgba(124, 58, 237, 0.30), transparent 68%);
  animation: v4-drift 25s ease-in-out infinite alternate;
}
@keyframes v4-drift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to   { transform: translate3d(3%, 2%, 0) scale(1.06); }
}

.v4-stack {
  position: relative;
  z-index: 2;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.v4-eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--v3-ink-mute);
}

.v4-headline {
  margin: 0;
  font-size: clamp(38px, 6vw, 72px);
  line-height: 1.08;
  letter-spacing: -0.022em;
  font-weight: 500;
  color: var(--v3-ink);
}
.v4-headline em {
  font-family: var(--v3-italic);
  font-style: italic;
  font-weight: 400;
  background: linear-gradient(92deg, var(--v3-ink), #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.v4-sub {
  margin: 0;
  max-width: 46ch;
  font-size: 16px;
  line-height: 1.6;
  color: var(--v3-ink-soft);
}

/* --- form --- */
.v4-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 440px;
}
.v4-input {
  flex: 1 1 220px;
  min-width: 0;
  padding: 13px 18px;
  border: 1px solid var(--v3-line);
  border-radius: 99px;
  background: var(--v3-glass);
  color: var(--v3-ink);
  font: inherit;
  font-size: 15px;
}
.v4-input::placeholder { color: var(--v3-ink-mute); }
.v4-input:focus-visible { outline: 2px solid var(--v3-accent); outline-offset: 2px; }
.v4-btn {
  padding: 13px 22px;
  border: 0;
  border-radius: 99px;
  background: var(--v3-accent);
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.v4-btn[disabled] { opacity: 0.6; cursor: default; }
.v4-msg { flex: 1 0 100%; margin: 0; font-size: 13px; }
.v4-msg--err { color: #ff9b9b; }
.v4-done { margin: 0; font-size: 16px; color: var(--v3-ink); }

/* Visually hidden, still read aloud. */
.v4-sr {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* --- timing, bridge, socials --- */
.v4-timing {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--v3-ink-mute);
}
.v4-bridge {
  font-size: 14px;
  color: var(--v3-ink-soft);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  padding-bottom: 2px;
}
.v4-bridge:hover { color: var(--v3-ink); }

.v4-socials {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 18px;
  margin: 48px 0 0;
  padding: 0;
  list-style: none;
}
.v4-socials a { font-size: 13px; color: var(--v3-ink-mute); text-decoration: none; }
.v4-socials a:hover { color: var(--v3-ink-soft); }

/* --- the companion ring --- */
.v4-ring {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: -60px;
  width: 420px;
  height: 420px;
  margin-top: -210px;
  pointer-events: none;
}
.v4-ring-node {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 64px;
  height: 64px;
  margin: -32px 0 0 -32px;
  opacity: 0.85;
  /* Rotate onto the circle, then counter-rotate so the sprite stays upright. */
  transform:
    rotate(calc(var(--i) * 45deg))
    translateY(-170px)
    rotate(calc(var(--i) * -45deg));
  animation: v4-float 9s ease-in-out infinite;
  animation-delay: calc(var(--i) * -1.1s);
}
.v4-ring-node img { display: block; width: 100%; height: 100%; }
@keyframes v4-float {
  0%, 100% { translate: 0 -6px; }
  50%      { translate: 0 6px; }
}

@media (max-width: 820px) {
  /* The landing site already treats 820px as the mobile-lite cut because
     GPU compositing is what made mobile lag. */
  .v4-ring { display: none; }
  .v4-screen { padding: 40px 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .v4-screen::before,
  .v4-ring-node { animation: none; }
}

/* --- .v3-split / .v3-word are appended below by the next step --- */
```

Then append the `SplitText` styles. **This is not optional**: `layout.tsx` does not import `v3-fx.css`, so without this the headline words render with no animation at all — the component would appear to work while doing nothing.

Extract the two rule blocks from the source rather than retyping them, so they match exactly:

```bash
awk '/^\.v3-split/,/^}/' app/v3/v3-fx.css >> app/v4/v4.css
awk '/^\.v3-word/,/^}/'  app/v3/v3-fx.css >> app/v4/v4.css
grep -n "is-in" app/v3/v3-fx.css | head
```

The `grep` will show any `.v3-split.is-in .v3-word` (or similar) rules that carry the actual transition — append those too, with the same `awk` approach. Then add a provenance comment above the appended block:

```css
/* ------------------------------------------------------------------
   Copied verbatim from app/v3/v3-fx.css — the SplitText word-rise.
   Copied rather than imported because v3-fx.css is 1,104 lines of
   machinery this page doesn't use, and because this segment is deleted
   whole at launch. If the v3 original changes, this copy does not.
   ------------------------------------------------------------------ */
```

Verify the styles actually arrived:

```bash
grep -c "v3-word" app/v4/v4.css
```

Expected: at least 1.

- [ ] **Step 6: Write the page**

Create `app/v4/page.tsx`:

```tsx
import SplitText from '../v3/components/SplitText'
import { V4 } from './content'
import CompanyRing from './components/CompanyRing'
import WaitlistInline from './components/WaitlistInline'

/**
 * The pre-launch teaser. One screen, no scroll, one job: collect an
 * email address. The full marketing site lives at /v3 and is reachable
 * through the bridge link.
 *
 * SplitText takes a plain string, so the italic accent is a sibling
 * <em> rather than nested inside it — the same composition v3's hero
 * uses for lead + accent.
 */
export default function V4Page() {
  return (
    <main className="v4-screen">
      <CompanyRing />

      <div className="v4-stack">
        <p className="v4-eyebrow">{V4.eyebrow}</p>

        <h1 className="v4-headline">
          <SplitText text={V4.headlineLead} />{' '}
          <em>{V4.headlineAccent}</em>.
        </h1>

        <p className="v4-sub">{V4.sub}</p>

        <WaitlistInline />

        <p className="v4-timing">{V4.timing}</p>

        <a className="v4-bridge" href={V4.bridgeHref}>
          {V4.bridgeLabel} →
        </a>
      </div>

      <ul className="v4-socials">
        {V4.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

- [ ] **Step 7: Run the page tests and confirm they pass**

Run: `npx jest __tests__/components/v4-page.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 8: Run the whole suite — the setup file changed, so everything is in scope**

Run: `npx jest`
Expected: PASS. If `__tests__/components/WaitlistForm.test.tsx` or `__tests__/api/waitlist.test.ts` now fail, the IntersectionObserver stub is at fault; fix the stub, do not weaken those tests.

- [ ] **Step 9: See it in a real browser**

```bash
npm run dev
```

Open `http://localhost:3000/v4`. Confirm: one screen with no scrollbar at 1440×900; the headline words rise on load; the ring sits behind the text on the right; `/v3` still renders the full marketing site unchanged. Then narrow the window below 820px and confirm the ring disappears and nothing overflows horizontally.

- [ ] **Step 10: Commit**

```bash
git add app/v4/layout.tsx app/v4/v4.css app/v4/page.tsx jest.setup.ts __tests__/components/v4-page.test.tsx
git commit -m "Add the v4 pre-launch segment, reviewable at /v4

Mounts inside the .v3 scope to inherit tokens without a second design
system, the way BlogShell does for the blog. Imports v3.css only, never
v3-fx.css. Root still points at v3 — the flip is a later commit.

Adds an IntersectionObserver stub to jest.setup.ts because jsdom has
none and SplitText constructs one on mount.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Update the canonical positioning

`CLAUDE.md` is the source every piece of Codepet copy is written from, including the daily blog auto-post routine. It still addresses "people" and "learners"; the product is for founders building a product and a company.

**Files:**
- Modify: `CLAUDE.md` — the four bullets in the "Codepet positioning (canonical — use this for all copy)" section.

**Interfaces:**
- Consumes: nothing.
- Produces: nothing importable. This is documentation.

- [ ] **Step 1: Replace the four positioning bullets**

In `CLAUDE.md`, under `## Codepet positioning (canonical — use this for all copy)`, replace the `**One-liner.**`, `**Mission.**`, `**Vision.**` and `**Aim.**` bullets with:

```markdown
- **One-liner.** Codepet is a macOS application for founders building their own product and company. An AI cofounder and a team of specialists — engineering, product, finance — carry the work with you, from first line of code to a shipped product. Built and maintained by MURROR.
- **Mission.** Let one founder operate like a whole company. Go beyond tutorials and beyond code completion — carry the founder through real product work, in every department a company needs.
- **Vision.** The most intelligent and engaging AI for building companies of one. The go-to platform for founders who want to ship intelligent, original products without waiting for a team.
- **Aim.** Ship real products, build a real company. Founders deliver their own products, with guidance personalised to the company in front of them.
```

Leave `**Voice pillars.**` and `**At a glance.**` exactly as they are — both are still accurate. Leave the "Do not revert to earlier 'learn to code via lessons' framing" line in place; this change moves further from that framing, not back toward it.

- [ ] **Step 2: Verify the edit landed and nothing else moved**

```bash
git diff --stat CLAUDE.md
grep -c "founder" CLAUDE.md
```

Expected: exactly one file changed; 4 insertions and 4 deletions; the `grep -c` count is 5 or higher.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Point the canonical positioning at founders, not learners

Codepet is for founders building their own product and company, which
is what the departments, the VC room and the cofounder framing already
model. The teaser's headline says so; this keeps every other piece of
copy agreeing with it.

Note: the daily blog auto-post routine writes from this block, so the
next article publishes founder-framed, unattended, at 8am Asia/Saigon.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Make /v3 reachable and indexed

The highest-risk task in the whole change, and it has two halves.

**`/v3` does not currently work as a URL.** `next.config.ts` 307-redirects `/v3` → `/`, with a comment explaining that v3 *is* the canonical landing so the old draft URL should funnel to the root. That is true today and inverts the moment Task 6 lands: `/v3` would redirect to the **teaser**, the full marketing site would become unreachable at any URL, and the bridge link on the teaser would loop back to itself. Verified live against `next dev`: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/v3` returns `307` to `/`.

The second half is the sitemap: once the full site lives only at `/v3`, it needs an entry or it silently drops out of the search index.

Both halves must ship together. Either alone leaves the site broken — a sitemap entry pointing at a redirect, or a reachable URL nobody can find.

**Files:**
- Modify: `next.config.ts` — remove the `/v3` entry from `redirects()`.
- Modify: `app/sitemap.ts` — the marketing-pages block near the top of the `entries` array.
- Test: `__tests__/v3-route.test.ts`
- Test: `__tests__/sitemap.test.ts`

**Interfaces:**
- Consumes: `absoluteUrl` and `SITE_URL` from `@/lib/site`, both already imported by `app/sitemap.ts`.
- Produces: nothing importable.

- [ ] **Step 1: Write the failing redirect test**

Create `__tests__/v3-route.test.ts`:

```ts
import nextConfig from '@/next.config'

/**
 * /v3 is the full marketing site while the root serves the pre-launch
 * teaser. A redirect from /v3 would send visitors — and the bridge link
 * on the teaser itself — straight back to the teaser, leaving the real
 * site unreachable at any URL.
 */
test('/v3 is not redirected away', async () => {
  const redirects = await nextConfig.redirects!()
  expect(redirects.find((r) => r.source === '/v3')).toBeUndefined()
})

test('the legacy /v2 redirect and the download alias are left alone', async () => {
  const redirects = await nextConfig.redirects!()
  expect(redirects.find((r) => r.source === '/v2')).toBeDefined()
  expect(redirects.find((r) => r.source === '/download/Codepet.dmg')).toBeDefined()
})
```

- [ ] **Step 2: Run it and confirm the first test fails**

Run: `npx jest __tests__/v3-route.test.ts`
Expected: FAIL on the first test — a redirect with `source: '/v3'` is currently defined. The second test should already pass.

- [ ] **Step 3: Remove the /v3 redirect**

In `next.config.ts`, delete this entry from the array returned by `redirects()`, along with the two comment lines above it that describe it:

```ts
      // The v3 cinematic-dark design is now the canonical landing at `/`
      // (see app/page.tsx). Canonicalize the old draft URL so any inbound
      // links to /v3 land on `/`. 307 keeps it reversible.
      {
        source: '/v3',
        destination: '/',
        permanent: false,
      },
```

Leave the `/v2` redirect and the `/download/Codepet.dmg` redirect exactly as they are. Add a short comment in their place noting that `/v3` is deliberately not redirected because it serves the full marketing site while the root shows the pre-launch teaser.

- [ ] **Step 4: Run it and confirm both tests pass**

Run: `npx jest __tests__/v3-route.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Write the failing sitemap test**

Create `__tests__/sitemap.test.ts`:

```ts
import sitemap from '@/app/sitemap'
import { absoluteUrl, SITE_URL } from '@/lib/site'

test('lists the full marketing site at /v3 so it stays indexed', () => {
  const urls = sitemap().map((e) => e.url)
  expect(urls).toContain(absoluteUrl('/v3'))
})

test('still lists the root and pricing', () => {
  const urls = sitemap().map((e) => e.url)
  expect(urls).toContain(SITE_URL)
  expect(urls).toContain(absoluteUrl('/pricing'))
})

test('ranks /v3 below the root but above the legal pages', () => {
  const entries = sitemap()
  const at = (url: string) => entries.find((e) => e.url === url)?.priority
  expect(at(absoluteUrl('/v3'))).toBe(0.8)
  expect(at(SITE_URL)).toBe(1)
  expect(at(absoluteUrl('/privacy'))).toBe(0.3)
})
```

- [ ] **Step 6: Run the test and confirm it fails**

Run: `npx jest __tests__/sitemap.test.ts`
Expected: FAIL on the first test — the received array does not contain `https://code-pet.com/v3`.

- [ ] **Step 7: Add the entry**

In `app/sitemap.ts`, immediately after the `/pricing` entry and before the `/privacy` entry, insert:

```ts
  // The full marketing site. While the root serves the pre-launch teaser,
  // this is the only crawlable URL for the real site — without it, the
  // whole thing drops out of the index.
  entries.push({
    url: absoluteUrl('/v3'),
    changeFrequency: 'weekly',
    priority: 0.8,
  })
```

- [ ] **Step 8: Run the test and confirm it passes**

Run: `npx jest __tests__/sitemap.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 9: Prove /v3 actually serves the full site now**

A passing config test is not the same as a working URL. With a dev server running (`npm run dev` in another terminal, or reuse one already up):

```bash
curl -s -o /dev/null -w "status=%{http_code} redirect=%{redirect_url}\n" http://localhost:3000/v3
```

Expected: `status=200` with an empty `redirect=`. A `307` means the redirect is still in place.

Then confirm it is the real site and not something else:

```bash
curl -s http://localhost:3000/v3 | grep -c "v3-dept"
```

Expected: a count well above zero (the departments section is v3-only markup).

- [ ] **Step 10: Commit**

```bash
git add next.config.ts app/sitemap.ts __tests__/v3-route.test.ts __tests__/sitemap.test.ts
git commit -m "Add /v3 to the sitemap before the root stops serving it

Once the teaser owns /, this is the only crawlable URL for the full
marketing site. Without the entry it silently de-indexes — the one
mistake in this change that would quietly undo its whole point.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Flip the root

The last commit, kept deliberately small: launch day is `git revert` of exactly this.

**Files:**
- Modify: `app/page.tsx`
- Modify: `jest.config.ts`
- Create: `__mocks__/styleMock.js`
- Create: `__mocks__/nextFontMock.js`
- Test: `__tests__/components/root-page.test.tsx`

**Interfaces:**
- Consumes: `V4Page` from `app/v4/page` (Task 3).
- Produces: nothing.

- [ ] **Step 1: Teach Jest about CSS imports and `next/font`**

`app/page.tsx` imports stylesheets and calls `next/font/google`. Neither works under ts-jest today — no existing test imports a module that does either, which is why this has never come up. Without this step the test fails on `Unexpected token '.'` from the CSS, not on anything real.

Create `__mocks__/styleMock.js`:

```js
// Stylesheets carry no behaviour worth asserting in jsdom.
module.exports = {}
```

Create `__mocks__/nextFontMock.js`:

```js
// next/font/google is a build-time loader with no runtime under Jest.
// Each font function returns the same shape the real one does: a
// `variable` class name the layout interpolates into className.
module.exports = new Proxy(
  {},
  { get: () => () => ({ variable: 'mock-font-variable', className: 'mock-font' }) },
)
```

In `jest.config.ts`, extend `moduleNameMapper` (keep the existing `@/` entry):

```ts
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '^next/font/google$': '<rootDir>/__mocks__/nextFontMock.js',
  },
```

- [ ] **Step 2: Write the failing test**

Create `__tests__/components/root-page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

test('the root serves the pre-launch teaser', () => {
  render(<Home />)
  expect(screen.getByText('Launching this autumn')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument()
})

test('the root still bridges to the full site', () => {
  render(<Home />)
  expect(screen.getByRole('link', { name: /see what we're building/i }))
    .toHaveAttribute('href', '/v3')
})
```

- [ ] **Step 3: Run the test and confirm it fails for the right reason**

Run: `npx jest __tests__/components/root-page.test.tsx`
Expected: FAIL with `Unable to find an element with the text: Launching this autumn` — the root still renders v3.

If it instead fails on a CSS or font import, Step 1 didn't take; fix that before going on. A test failing for the wrong reason proves nothing.

- [ ] **Step 4: Repoint the shim**

Replace the whole of `app/page.tsx` with:

```tsx
// Canonical landing at `/`.
//
// The implementation lives in `app/v4/` (kept as a self-contained
// segment so we can still mount it under `/v4` if needed). Because
// Next.js App Router scopes layouts to their route segment, simply
// re-exporting `./v4/page` is NOT enough — the v4 layout's font
// variables (`--font-gsans`, `--font-playfair`) and CSS imports
// (`./v3/v3.css`, `./v4/v4.css`) plus the `.v3 v4` wrapper class
// wouldn't apply at `/`. So we replicate the v4 layout's behavior here.
//
// LAUNCH DAY: revert this commit to put the full marketing site
// (app/v3) back at the root. Nothing else needs to change.
import type { Metadata } from 'next'
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
import './v3/v3.css'
import './v4/v4.css'
import V4Page from './v4/page'

// Main / body font (variable). Consumed by --v3-sans in v3.css.
const gsans = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-gsans',
  display: 'swap',
})

// Italic accent for the headline's emphasis words. Consumed by --v3-italic.
const playfair = Playfair_Display({
  weight: ['400'],
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Codepet — Let's build your whole company",
  description:
    'Codepet is the AI cofounder for founders building their own product and company. A macOS app, launching this autumn. Join the waitlist.',
}

export default function Home() {
  return (
    <div className={`v3 v4 ${gsans.variable} ${playfair.variable}`}>
      <V4Page />
    </div>
  )
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npx jest __tests__/components/root-page.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Run the full suite**

Run: `npx jest`
Expected: PASS, all files. The `moduleNameMapper` change in Step 1 is global, so every existing test is in scope here.

- [ ] **Step 7: Lint and build — this is what Vercel will run**

```bash
npx eslint .
npm run build
```

Expected: eslint exits 0; the build completes and its route list shows both `/` and `/v3`.

If eslint reports a suppressions count mismatch and exits 2, regenerate with `npx eslint --suppress-all` and run the full `npx eslint .` again before pushing.

- [ ] **Step 8: Verify both routes in a browser**

```bash
npm run dev
```

- `http://localhost:3000/` — the teaser.
- `http://localhost:3000/v3` — the full marketing site, unchanged.
- `http://localhost:3000/blog` — loads, styling intact.
- `http://localhost:3000/pricing` — loads.

- [ ] **Step 9: Commit**

```bash
git add app/page.tsx jest.config.ts __mocks__/ __tests__/components/root-page.test.tsx
git commit -m "Serve the pre-launch teaser at the root

Three-line shim change, isolated in its own commit: launch day is a
revert of exactly this and the full site returns to /.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## After Phase 1

**Do not merge without a human deciding to.** Merging to `main` publishes to `code-pet.com` immediately, and PR previews on that project are 401-gated so there is no staging URL to check first. Open the PR, let it be reviewed, and verify production within minutes of the merge.

**Phase 2** — the company-orbit WebGL hero — gets its own spec section and its own plan, written once Phase 1 is on screen. It adds `three` and `@react-three/fiber`, a sprite-atlas generator, and a gated dynamic import that never downloads `three` below 820px or under `prefers-reduced-motion`, with `CompanyRing` (Task 2) as the fallback.

## Spec amendments made by this plan

**1. Motion primitives: four named, one used.** Spec §4.2 lists `SplitText`, `Magnetic`, `Reveal` and `CursorGlow`. This plan uses only `SplitText`, for reasons that only became clear reading the components:

- **`Reveal` is meaningless here.** It fades content in when it scrolls into view. On a single-screen page everything is in view at load, so it would fire immediately on all elements — a fade that `SplitText` already provides for the one element that matters.
- **`Magnetic` and `CursorGlow` are deferred to the Phase 2 motion pass**, where they belong next to the orbit rather than bolted onto a static page. Adding `Magnetic` now would also mean reopening Task 1's component and its five tests to wrap the button.

Both remaining primitives need their CSS copied the same way `SplitText`'s is in Task 3 Step 5. Spec §4.2's table should be narrowed to `SplitText` for Phase 1, with the other three listed under Phase 2.

**2. `OrbitPoster` → `CompanyRing`.** The spec's §4.2 and §9 named an `OrbitPoster` component — "a static rasterised frame of the orbit" — as Phase 1's hero. That is circular: the orbit does not exist until Phase 2, so there is nothing to rasterise. This plan replaces it with `CompanyRing`, a CSS ring built from the eight companion SVGs that already exist. It gives Phase 1 a real hero, and it becomes the Phase 2 fallback, which is what `OrbitPoster` was for. **`docs/superpowers/specs/2026-09-23-prelaunch-landing-design.md` should be updated to match** — rename `OrbitPoster` to `CompanyRing` in §4.2, §6 and §9, and in the §13 ticket list.
