# Pre-launch landing page — design

**Date:** 2026-09-23
**Repo:** `My-Outcasts/devpet-landing`
**Branch:** `feat/prelaunch-landing`
**Status:** approved design, ready for implementation planning

---

## 1. Goal

Put a focused, single-screen pre-launch page at the root of `code-pet.com` whose only
job is capturing email addresses, while keeping the existing marketing site fully alive
and reachable until the product launches.

**Success criteria**

- A visitor arriving at `code-pet.com` sees one screen, no scroll, and can join the
  waitlist without any further navigation.
- The existing site remains live, complete, and indexed at `/v3`.
- `/blog`, `/vi/blog`, `/pricing`, `/download`, `/privacy` are untouched and keep their URLs.
- Reverting to the current site on launch day is a single `git revert`.

**Non-goals**

- Redesigning the existing marketing site.
- Refactoring the four existing waitlist form implementations.
- Any change to the waitlist backend, the Google Sheet, or the Apps Script webhook.
- Bilingual support. The root has never been bilingual; only the blog is. This page is
  English-only, matching `/v3`.

---

## 2. Context that constrains the design

These are properties of the existing system, verified in the repo on 2026-09-23. They
are the reason several decisions below go the way they do.

1. **`code-pet.com` deploys from `main`, on an account we do not control.** The domain is
   served by the Vercel project `giang-6920s-projects/devpet-landing`. A second project,
   `monatruongs-projects/devpet-landing`, serves `devpet-landing.vercel.app` from the same
   branch. Consequences: any merge to `main` is a production deploy; per-project env vars
   cannot be relied on; and an env-var or middleware feature flag cannot gate the domain.
2. **PR previews on that project are 401-gated.** Pre-merge verification happens locally;
   post-merge verification happens on production.
3. **The root is already a shim.** `app/page.tsx` re-exports `app/v3/page` and replicates
   v3's layout behaviour (fonts, CSS imports, `.v3` wrapper) because App Router scopes
   layouts to their segment. Its own comment describes v3 as *"kept as a self-contained
   segment so we can still mount it under `/v3` if needed."*
4. **Generational segments are an established pattern.** `app/v2/` and `app/v3/` each have
   their own `layout.tsx`, CSS and components, and each is reachable at its own path.
5. **The blog already mounts inside the `.v3` scope.** `BlogShell.tsx` imports v3's CSS and
   wraps its content in `.v3`, rather than duplicating tokens. The new segment does the same.
6. **`/` and `/v3` currently serve byte-identical content** at two URLs. This design
   incidentally resolves that.
7. **`app/sitemap.ts` does not list `/v3`.** It lists `/`, `/pricing`, `/privacy` and the blog.
8. **The waitlist endpoint works and is deliberately hardcoded.** `app/api/waitlist/route.ts`
   forwards `{ email, locale }` to an Apps Script web app whose URL is a constant in the
   file, specifically so it works on Giang's account without env config. It translates the
   script's `result` field into a `status` field for the client.
9. **The repo has no animation or 3D dependency.** `package.json` carries `lenis` and
   nothing else — no `three`, no `gsap`, no `framer-motion`.
10. **v3's motion primitives are dependency-free.** `SplitText`, `Magnetic`, `Reveal` and
    `CursorGlow` import only React; their motion lives in `v3-fx.css` as `.v3-split`,
    `.v3-word`, `.v3-magnetic`, `.v3-reveal`, `.v3-cursor-glow`.
11. **Eight companion SVGs exist** at `public/characters/` — `byte, crash, glitch, luna,
    nova, null, sage, zero`. **No 3D assets exist**: no `.glb`, `.gltf` or `.obj` anywhere.

---

## 3. Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Where it lives | New `app/v4/` segment; `app/page.tsx` re-points to it | Matches the v2/v3 convention; gives a reviewable URL before the root changes; rollback is a revert |
| Old site | Stays at `/v3`, fully live | The requirement is to keep it until launch |
| Layout | Left-aligned, headline-led | Closest to how v3's own hero opens; nothing to art-direct |
| Design language | v3's tokens, reused not copied | Continuity with `/v3` and the blog, one click away |
| Typography | Google Sans Flex + Playfair Display italic **only** | Explicit decision to drop the pixel font (Minecraft) used elsewhere on the site |
| Headline | "Let's build your *whole company*." | Founder positioning; a three-word edit from the live headline, so it reads as a sharpening |
| Timing line | "Launching this autumn" | No date to miss; no code change if it slips |
| On-page elements | Logo, headline, sub, email field, timing line, bridge link to `/v3`, social row | No nav bar — focus is the point |
| Motion | Full 3D hero (WebGL) | Explicitly chosen over the cheaper tiers |
| Scene | The company orbit | The metaphor is the headline |

### 3.1 Accepted trade-offs

Recorded so nobody relitigates them later.

- **The 3D hero is the bulk of the work.** Chosen with that understood. Section 9 phases
  delivery so the domain is never blocked on the scene.
- **No nav bar** means `/blog` sits two clicks from the root, via `/v3`'s nav.
- **Dropping the pixel font** makes the teaser more sober than the site behind the bridge link.
- **A fifth waitlist form.** The shared `components/WaitlistForm.tsx` depends on
  `useLocale`/`LocaleProvider`, which the English-only root does not mount. v4 gets its own
  small self-contained form; consolidating all five is a separate ticket.

---

## 4. Architecture

### 4.1 Routing

```
app/page.tsx          → re-exports app/v4/page   (was app/v3/page)
app/v4/               → the teaser                (new)
app/v3/               → the full marketing site   (unchanged, still at /v3)
app/blog, /vi/blog    → unchanged
app/pricing, /download, /privacy → unchanged
```

### 4.2 Files

| File | Responsibility |
|---|---|
| `app/v4/page.tsx` | Server component. Static markup and composition. No state. |
| `app/v4/layout.tsx` | Fonts, `../v3/v3.css` import, `.v3 v4` wrapper. |
| `app/v4/content.ts` | Every user-visible string, mirroring `app/v3/content.ts`. |
| `app/v4/v4.css` | One-screen layout rules + the five motion rule-blocks copied from `v3-fx.css`. |
| `app/v4/components/WaitlistInline.tsx` | `'use client'`. The email form. |
| `app/v4/components/CompanyOrbit.tsx` | `'use client'`. The WebGL scene. |
| `app/v4/components/OrbitPoster.tsx` | Static fallback image for mobile and reduced-motion. |

**CSS strategy.** `layout.tsx` imports `../v3/v3.css` (tokens and base) and **not**
`v3-fx.css` (1,104 lines of dept tilt, copilot, Lenis and other machinery this page does
not use). The five motion rules the page *does* want are copied into `v4.css` with a
comment naming their source. This duplicates a little CSS; that is the right call here
because the segment is designed to be deleted at launch, so isolation beats DRY.

**Motion primitives reused from v3.** All four import only React — no library cost.

| Component | Applied to | CSS block copied |
|---|---|---|
| `SplitText` | Headline — words rise in sequence, Playfair accent last | `.v3-split`, `.v3-word` |
| `Magnetic` | CTA button — leans toward the cursor | `.v3-magnetic` |
| `Reveal` | Sub, timing line, bridge link, socials — staggered fade-up | `.v3-reveal` |
| `CursorGlow` | Page — soft purple light tracking the pointer | `.v3-cursor-glow` |

### 4.3 The scene — "the company orbit"

Eight companion planes orbit a still centre. The centre is the headline; the headline is
the founder. One person, a whole company around them.

- **Stack:** `three` + `@react-three/fiber`. Same stack as the SWSH reference.
- **Geometry:** eight camera-facing textured planes (billboards). Not meshes — the source
  art is flat SVG, so there is no back side to show, and billboarding is the technique the
  reference sites actually use.
- **Textures:** the eight SVGs rasterised to a **single sprite atlas PNG**, committed at
  `public/v4/companions-atlas.png` (4×2 grid, power-of-two dimensions). Generated once by a
  committed script, `scripts/build-companion-atlas.mjs`, so it can be regenerated when the
  character art changes rather than being an undocumented binary. The scene costs one
  texture fetch rather than eight.
- **Motion:** slow continuous rotation about Y. Mouse position tilts the ring on X and Y,
  spring-damped. Hovering a companion slows the orbit and brings that plane forward.
- **Ground:** the existing static radial halo behind the canvas, unchanged, so the
  composition still reads before WebGL initialises.

### 4.4 Loading and layering

The text layer is **server-rendered HTML above the canvas**, not inside it.

```
z-2   headline, sub, email field, timing, bridge, socials   ← SSR, interactive immediately
z-1   <canvas>                                              ← client-only, mounted after hydration
z-0   static radial halo + grain                            ← CSS, paints instantly
```

The canvas is imported through `next/dynamic` with `ssr: false`, and the import is **gated**
so that devices which will never render it do not download `three` at all (§6).

---

## 5. Copy

All strings live in `app/v4/content.ts`.

| Slot | Text |
|---|---|
| Eyebrow | Codepet · by Murror |
| Headline lead | Let's build your |
| Headline accent | whole company |
| Sub | Building something of your own means being the whole team at once. Codepet is the AI cofounder who carries it with you. |
| CTA button | Join the waitlist |
| Timing | Launching this autumn |
| Bridge | See what we're building → (`/v3`) |
| Socials | X, Instagram, LinkedIn, GitHub, Discord — same set and URLs as v3's footer |
| Success | You're on the list. We'll be in touch. |
| Duplicate | You're already on the list. |
| Error | Something went wrong. Try again? |

The headline renders through `SplitText` so the lead words rise in sequence and the
Playfair-italic accent lands last.

---

## 6. Performance budget

A 3D hero is only acceptable if it never stands between a visitor and the email field.

| Target | Value |
|---|---|
| Headline + email field interactive | Independent of the canvas — SSR HTML, no JS required to read or focus |
| Canvas mount | After hydration, via `next/dynamic({ ssr: false })` |
| `three` bundle downloaded on phones | **Never** — the dynamic import is gated, not merely hidden with CSS |
| Texture fetches for the scene | 1 (sprite atlas) |
| Device pixel ratio | Capped at 2 |
| Rendering while tab hidden | Paused via `visibilitychange` |

**Gating rules.** The canvas is requested only when *all* hold:

1. Viewport ≥ 820px. This threshold is not arbitrary — the landing site already uses a
   "mobile-lite" cut at ≤820px because GPU compositing is what made mobile lag before.
2. `prefers-reduced-motion` is not `reduce`.

When gating fails, `OrbitPoster` renders instead: a static rasterised frame of the orbit.
Same composition, no WebGL, no `three` in the bundle.

---

## 7. Data flow and error handling

```
WaitlistInline
  → POST /api/waitlist  { email, locale: 'en' }
    → Apps Script web app (URL hardcoded in the route)
      → "Codepet Signup Email" Google Sheet
```

No new backend, no new env vars, no change to the route.

**States:** `idle → loading → success | duplicate | error`.

| Condition | Behaviour |
|---|---|
| Malformed address | Client-side regex rejects before any request; inline message; field keeps focus |
| `{ status: 'ok' }` | Success message replaces the form |
| `{ status: 'duplicate' }` | "You're already on the list." Treated as success, not failure |
| 502 / non-OK / network throw | Error message; form stays filled so the address is not lost |

The route surfaces Apps Script failures as 502 rather than fake-succeeding, so a failed
save is never reported to the visitor as a win. The client must preserve that property.

---

## 8. SEO, metadata and accessibility

**SEO**

- `app/sitemap.ts` gains `/v3` at priority 0.8. Without this, the full site drops out of
  the index the moment it stops being the root. This is the single highest-risk omission
  in the whole change.
- `/` gets its own metadata — title, description, OG image — describing the teaser rather
  than the full product.
- `/blog`, `/vi/blog` and their canonical + hreflang tags are untouched.

**Accessibility**

- The canvas is `aria-hidden` and purely decorative; nothing on it conveys information.
- Full keyboard path: email field → submit → bridge link → socials.
- Contrast: body copy uses `--v3-ink-soft` (`#b8b2cc`) on `#07060c`. The `--v3-ink-mute`
  (`#6f6987`) used for the timing line is checked against AA at its rendered size, and
  darkened if it fails.
- `prefers-reduced-motion: reduce` disables **all** motion: the orbit (poster frame instead),
  the SplitText rise, the Reveal stagger, the Magnetic pull, the CursorGlow, and the halo
  drift. Every element renders in its final state.

---

## 9. Delivery

Phased so the domain is never waiting on WebGL.

**Phase 1 — the page (shippable on its own)**

1. `app/v4/` segment: layout, page, content, CSS, `WaitlistInline`, `OrbitPoster`.
2. Tests (§10).
3. `CLAUDE.md` positioning update (§11).
4. Sitemap `/v3` entry + root metadata.
5. **Flip `app/page.tsx`** — its own commit, three lines.

At the end of Phase 1 the teaser is live at the root with a static hero. It is a complete,
coherent page, not a placeholder.

**Phase 2 — the scene**

6. Add `three` + `@react-three/fiber`; build the sprite atlas.
7. `CompanyOrbit.tsx` behind the gated dynamic import, with `OrbitPoster` as fallback.
8. Perf pass: DPR cap, visibility pause, measure on a real machine.

**Verification.** Locally via `next dev` for both phases, then on production immediately
after merge — PR previews are 401-gated on this project, so there is no staging URL.

**Launch day.** `git revert` the Phase 1 step 5 commit. The root returns to v3; `/v4`
remains reachable until deliberately deleted.

---

## 10. Testing

`jest` is already configured (`npm test`), with `__tests__/api` and `__tests__/components`.

| Test | Asserts |
|---|---|
| `WaitlistInline` — invalid email | No fetch is issued; inline error renders |
| `WaitlistInline` — ok | Success state renders on `{ status: 'ok' }` |
| `WaitlistInline` — duplicate | Duplicate state renders, and is not an error |
| `WaitlistInline` — 502 | Error state renders; entered address is preserved |
| `app/v4/page` | Headline, bridge link `href="/v3"`, and all five socials render |
| Gating | Below 820px, or `prefers-reduced-motion: reduce`, renders `OrbitPoster` and does not attempt the dynamic import (`matchMedia` mocked) |
| `sitemap` | Includes `/v3` |

The scene itself is not unit-tested; it is verified by eye and by frame timing.

---

## 11. `CLAUDE.md` positioning update

`CLAUDE.md` holds the canonical positioning every piece of copy is written from. It
currently addresses "people" and "learners"; the product is for founders building a
product and a company. Updating it is in scope for this branch, because otherwise the
teaser and the next blog post disagree.

Replacement text for the four bullets (Voice pillars and "At a glance" are unchanged and
still accurate):

> - **One-liner.** Codepet is a macOS application for founders building their own product
>   and company. An AI cofounder and a team of specialists — engineering, product, finance —
>   carry the work with you, from first line of code to a shipped product. Built and
>   maintained by MURROR.
> - **Mission.** Let one founder operate like a whole company. Go beyond tutorials and
>   beyond code completion — carry the founder through real product work, in every
>   department a company needs.
> - **Vision.** The most intelligent and engaging AI for building companies of one. The
>   go-to platform for founders who want to ship intelligent, original products without
>   waiting for a team.
> - **Aim.** Ship real products, build a real company. Founders deliver their own products,
>   with guidance personalised to the company in front of them.

**Knock-on effect:** the daily blog auto-post routine (cron `0 1 * * *`, 8am Asia/Saigon)
writes from this block. The first article published after this merges will be
founder-framed. That is intended, but it happens unattended.

---

## 12. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| `/v3` omitted from the sitemap | High — silently de-indexes the site being preserved | Explicit sitemap entry; covered by a test |
| Merging to `main` deploys the domain immediately | High | Root flip isolated in its own three-line commit, reviewed separately, merged deliberately |
| No preview URL to verify on | Medium | Verify locally; check production within minutes of merge |
| `three` is new to this repo — no perf baseline | Medium | Phase 2 is separable; the page ships and works without it |
| Scene art direction needs iteration | Medium | Phase 1 is independently complete, so iteration does not hold up the domain |
| Mobile WebGL cost | Medium | Hard gate at 820px; `three` never downloads below it |
| Blog is two clicks from the root | Low | Accepted; the bridge link reaches v3's nav |

---

## 13. Ticket breakdown

For the Codepet Ticket Tracker (`Area: Landing`, `Repo: devpet-landing`, `Owner: Mona`).
IDs assigned when the rows are written.

| Title | Type | Priority | Phase |
|---|---|---|---|
| Scaffold `app/v4` pre-launch segment on v3 tokens | Feature | P1 | 1 |
| Waitlist email form for the pre-launch page | Feature | P1 | 1 |
| Update CLAUDE.md canonical positioning to founder framing | Chore | P1 | 1 |
| Add `/v3` to sitemap + root metadata for the teaser | Chore | P0 | 1 |
| Flip root shim from v3 to v4 | Chore | P1 | 1 |
| Build the companion sprite atlas + generator script | Chore | P2 | 2 |
| Build the company-orbit WebGL hero | Feature | P2 | 2 |
| Static orbit poster for mobile and reduced-motion | Feature | P2 | 2 |
| Consolidate the five waitlist form implementations | Chore | P3 | later |

---

## 14. Open questions

None blocking. Two worth a second look before launch day:

1. Whether `/v4` should be deleted or kept after the root reverts to v3.
2. Whether the teaser's collected emails want a distinct tag in the sheet to separate
   pre-launch signups from blog newsletter signups. The route already forwards a `locale`
   field but nothing that identifies the source.
