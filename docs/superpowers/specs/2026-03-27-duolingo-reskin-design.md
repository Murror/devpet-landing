# Duolingo-Style Visual Overhaul — DevPet Landing Page

**Date:** 2026-03-27
**Status:** Approved
**Scope:** Full re-skin of all 10 landing page sections using Duolingo's design language while preserving DevPet's mint identity and 8-character system.

---

## Goals

- Make the landing page feel as playful, bold, and gamified as Duolingo's
- Replace the current soft/warm aesthetic with Duolingo's raised 3D, saturated, rounded style
- Keep all existing content, sections, and character system intact
- Maintain i18n support (EN/VI) and static export compatibility

## Non-Goals

- Changing page content or copy
- Redesigning character SVGs themselves
- Adding new sections or removing existing ones
- Changing the tech stack (Next.js, Framer Motion, Tailwind)

---

## 1. Color System

Replace the current warm-tinted mint palette with a bold, saturated palette inspired by Duolingo but anchored to DevPet's mint green.

### Primary & Secondary Colors

| Token | Current | New | Usage |
|-------|---------|-----|-------|
| `primary` | `#34D399` (mint) | `#34D399` (keep) | Primary CTAs, brand accent |
| `primary-dark` | `#059669` (mint-dark) | `#059669` (keep) | Button shadows, hover states |
| `info` | — | `#38BDF8` | Secondary CTAs, info states |
| `info-dark` | — | `#0284C7` | Info button shadows |
| `danger` | — | `#FB7185` | Error states, urgency |
| `danger-dark` | — | `#E11D48` | Danger button shadows |
| `xp` | `#D89840` (yellow) | `#FBBF24` | XP, rewards, celebration |
| `xp-dark` | — | `#D97706` | XP element shadows |
| `premium` | `#8C39AA` (purple) | `#A78BFA` | Premium features, leagues |
| `premium-dark` | — | `#7C3AED` | Premium element shadows |
| `streak` | `#F5A623` (mood-stuck) | `#FB923C` | Streaks, fire, warmth |
| `streak-dark` | — | `#EA580C` | Streak element shadows |

### Neutral Colors

| Token | Current | New | Usage |
|-------|---------|-----|-------|
| `bg` | `#FAFFFE` (warm-bg) | `#FFFFFF` | Page background — clean white, not warm-tinted |
| `surface` | `#FFFFFF` (card-bg) | `#F7F7F7` | Section alternate backgrounds, input fields |
| `border` | `#D1FAE5` | `#E5E5E5` | Borders, dividers — neutral grey, not green-tinted |
| `text` | `#1A2E23` | `#4B4B4B` | Body text — pure dark grey |
| `heading` | — | `#1A1A1A` | Headings — near black for contrast |
| `muted` | `#6B8F7B` | `#777777` | Secondary text — pure grey |
| `muted-light` | `#A7C4B4` | `#AFAFAF` | Tertiary text, placeholders |

### Mood State Colors (Existing, Updated)

| Token | Current | New |
|-------|---------|-----|
| `mood-flow` | `#34D399` | `#34D399` (keep) |
| `mood-stuck` | `#F5A623` | `#FB7185` (use danger) |
| `mood-milestone` | `#A855F7` | `#A78BFA` (use premium) |
| `mood-thinking` | `#6B8F7B` | `#38BDF8` (use info) |

### Color Tints (Light Backgrounds for Feature Cards)

| Token | New | Usage |
|-------|-----|-------|
| `primary-tint` | `#ECFDF5` | Light green background |
| `info-tint` | `#EFF6FF` | Light blue background |
| `xp-tint` | `#FFFBEB` | Light gold background |
| `premium-tint` | `#FDF4FF` | Light purple background |

---

## 2. Typography

### Font Change

- **Current:** Inter (Google Font)
- **New:** Varela Round (Google Font) — rounded sans-serif with a playful, Duolingo-like feel. Varela Round only has one weight (400), so hierarchy is achieved through size, color, and letter-spacing rather than weight variation.

### Type Scale

| Element | Size | Weight | Color | Extra |
|---------|------|--------|-------|-------|
| H1 (hero) | 48px (mobile: 36px) | 400 | `heading` #1A1A1A | — |
| H2 (section) | 36px (mobile: 28px) | 400 | `heading` #1A1A1A | — |
| H3 (card title) | 20px | 400 | `heading` #1A1A1A | — |
| Eyebrow | 13px | 400 | `primary` #34D399 | `text-transform: uppercase; letter-spacing: 2px` |
| Body | 17px | 400 | `text` #4B4B4B | `line-height: 1.6` |
| Small/Caption | 14px | 400 | `muted` #777 | — |
| Button text | 15px | 400 | white | `text-transform: uppercase; letter-spacing: 1px` |

### Font Loading

Add Varela Round via `next/font/google` in `app/layout.tsx`, replacing the current Inter import. Apply as `font-family: 'Varela Round', sans-serif` globally.

---

## 3. Button System — 3D Push-Down

All buttons adopt Duolingo's signature raised style with a thick bottom shadow that disappears on press.

### CSS Pattern

```css
/* Base button */
.btn {
  border: none;
  border-radius: 16px;
  padding: 14px 28px;
  font-family: 'Varela Round', sans-serif;
  font-size: 15px;
  font-weight: 400; /* Varela Round only has 400 */
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 100ms ease;
  position: relative;
}

/* Primary (green) */
.btn-primary {
  background: #34D399;
  color: white;
  box-shadow: 0 5px 0 #059669;
}

/* Active/pressed state */
.btn:active {
  box-shadow: none;
  transform: translateY(5px);
}
```

### Button Variants

| Variant | Background | Shadow | Text |
|---------|-----------|--------|------|
| Primary | `#34D399` | `0 5px 0 #059669` | White |
| Secondary (blue) | `#38BDF8` | `0 5px 0 #0284C7` | White |
| Ghost | `#FFFFFF` | `0 5px 0 #E5E5E5` | `#34D399` |
| Danger | `#FB7185` | `0 5px 0 #E11D48` | White |

### Implementation

- Replace all current button styles in components with the 3D pattern
- In Framer Motion: use `whileTap={{ y: 5, boxShadow: 'none' }}` instead of raw CSS `:active` for consistency with existing animation system
- Apply to: WaitlistForm submit buttons, Nav CTA, MidCTA, FinalCTA, CharacterPicker confirm

---

## 4. Card System — 3D Raised

All cards adopt the raised style: `border: 2px solid #E5E5E5` + `box-shadow: 0 4px 0 #E5E5E5` + `border-radius: 16px`.

### Card CSS Pattern

```css
.card-3d {
  background: #FFFFFF;
  border: 2px solid #E5E5E5;
  border-radius: 16px;
  box-shadow: 0 4px 0 #E5E5E5;
  transition: all 100ms ease;
  cursor: pointer;
}

.card-3d:active {
  box-shadow: none;
  transform: translateY(4px);
}
```

### Apply To

- **WhyVibeCode:** Pain point cards
- **MeetYourPet:** Character grid cards
- **HowItWorks:** Step cards
- **Features:** Feature cards (with colored icon backgrounds using tint colors)
- **SkillTreePreview:** Tier cards
- **Testimonials:** Testimonial cards
- **AppWindowMockup:** The mockup container itself

---

## 5. Border Radius

Standardize to Duolingo's consistent rounding:

| Element | Radius |
|---------|--------|
| Buttons | `16px` |
| Cards | `16px` |
| Input fields | `16px` |
| Icon containers | `12px` |
| Progress bars | `9999px` (pill) |
| Badges/chips | `9999px` (pill) |
| Nav bar | `0` (full-width) |

---

## 6. Shadows

Replace current shadow system entirely:

| Token | Current | New |
|-------|---------|-----|
| `card` | `0 2px 12px rgba(26,46,35,0.06)` | `0 4px 0 #E5E5E5` (3D bottom) |
| `hover` | `0 4px 20px rgba(26,46,35,0.10)` | Remove — use `:active` push-down instead |
| `app` | `0 20px 60px rgba(0,0,0,0.07)...` | `0 4px 0 #E5E5E5` (consistent with cards) |

No diffuse/spread shadows. Duolingo uses only solid bottom shadows for the 3D raised effect.

---

## 7. Section-by-Section Changes

### 7.1 Nav

- White background, `border-bottom: 2px solid #E5E5E5`
- Remove backdrop blur (not needed on white bg)
- CTA button: 3D green primary style
- Mobile menu: same 3D card style for the dropdown panel
- Logo text in `heading` color

### 7.2 Hero

- Clean white background (remove warm-bg)
- Headline: 48px Varela Round, `heading` color
- Stats: use colored badge pills with 3D style (streak orange for stats)
- WaitlistForm: 3D green submit button, rounded input with `border: 2px solid #E5E5E5`
- AppWindowMockup: 3D card treatment with `border: 2px solid #E5E5E5; box-shadow: 0 4px 0 #E5E5E5`

### 7.3 WhyVibeCode

- `surface` (#F7F7F7) background for alternation
- Pain point cards: 3D raised cards
- Animated ping circles: use `danger` color (#FB7185) instead of current color

### 7.4 MeetYourPet

- White background
- Character cards: 3D raised, push-down on click
- Character name badges: pill-shaped with character's theme color
- Remove gradient background (`bg-meet-gradient`), use flat white
- Speech bubbles: 3D raised style with character color border

### 7.5 HowItWorks

- `surface` background
- Step number badges: bold colored circles (primary, info, xp)
- Step cards: 3D raised
- Connecting arrows: solid `border` color

### 7.6 Features

- White background
- Feature cards: 3D raised with colored tint backgrounds for icon containers
- Icon containers: 48x48px, rounded 12px, tinted backgrounds (primary-tint, info-tint, xp-tint, premium-tint)

### 7.7 MidCTA

- `primary` background (#34D399)
- White text
- WaitlistForm: white ghost-style 3D button
- Rounded input with no border (white bg)

### 7.8 SkillTreePreview

- White background
- Tier cards: 3D raised
- XP progress bars: pill-shaped, `xp` color (#FBBF24) fill on `border` (#E5E5E5) track
- Tier level badges: colored pills matching tier (grey → primary → xp → premium)

### 7.9 Testimonials

- `surface` background
- Testimonial cards: 3D raised
- Star ratings: `xp` color
- User stats badges: pill-shaped with 3D treatment

### 7.10 FinalCTA

- White background, `border-top: 2px solid #E5E5E5`
- Large headline in `heading` color
- 3D green primary CTA button
- Footer links: `muted` color, no decoration
- Footer separator: `border` color

### 7.11 CharacterPicker (Modal)

- Modal card: 3D raised with larger shadow (`0 8px 0 #E5E5E5`)
- Character selection tiles: 3D raised, push-down on click
- Selected state: `primary` border color instead of grey
- Confirm button: 3D green primary

### 7.12 PetGuide (Floating Companion)

- Container: 3D raised card style
- Speech bubble: 3D raised with `border: 2px solid #E5E5E5`
- Keep existing character-specific animations
- Idle chatter bubble: pill-shaped with 3D treatment

---

## 8. Animations

### Philosophy Shift

Current: smooth ease curves → New: bouncier spring physics matching Duolingo's playful feel.

### Framer Motion Spring Config

```typescript
// Replace current ease curves with spring physics
const duoSpring = {
  type: "spring",
  stiffness: 300,
  damping: 20,
}

const duoBounce = {
  type: "spring",
  stiffness: 400,
  damping: 15,
}
```

### Animation Changes

| Element | Current | New |
|---------|---------|-----|
| ScrollReveal | `ease: [0.25, 0.1, 0.25, 1]` | `spring: { stiffness: 300, damping: 20 }` |
| Card hover | `whileHover={{ y: -4 }}` | Remove hover lift; add `whileTap={{ y: 4, boxShadow: 'none' }}` |
| Button press | `transform: scale(0.97)` | `whileTap={{ y: 5, boxShadow: 'none' }}` |
| Stagger delay | 80-150ms | 100ms consistent |
| CountUp | easeOut cubic | Keep as-is (number animation doesn't need spring) |
| Progress bars | — | `transition={{ duration: 0.3, ease: 'easeOut' }}` |
| Character pick | fade in | `spring: { stiffness: 400, damping: 15 }` scale bounce |

### Confetti

Keep existing confetti on character click in MeetYourPet. Update particle colors to use the new secondary palette (info, danger, xp, premium, streak).

---

## 9. Input Fields

```css
input {
  border: 2px solid #E5E5E5;
  border-radius: 16px;
  padding: 14px 20px;
  font-family: 'Varela Round', sans-serif;
  font-size: 16px;
  color: #4B4B4B;
  background: #FFFFFF;
  transition: border-color 200ms ease;
}

input:focus {
  border-color: #38BDF8;
  outline: none;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
}

input::placeholder {
  color: #AFAFAF;
}
```

---

## 10. Section Spacing & Layout

| Property | Current | New |
|----------|---------|-----|
| Max width | 1100px | 1100px (keep) |
| Horizontal padding | `px-6` | `px-6` (keep) |
| Section vertical padding | `py-16` / `py-20` | `py-20` / `py-24` (slightly more generous) |
| Section separators | `border-t/b border-border` | `border-b-2 border-[#E5E5E5]` (thicker, grey) |
| Alternating backgrounds | None (all warm-bg) | White / `surface` (#F7F7F7) alternating |

---

## 11. Implementation Files to Modify

| File | Changes |
|------|---------|
| `tailwind.config.ts` | Replace entire color palette, update shadows, update border-radius |
| `app/layout.tsx` | Replace Inter with Varela Round font import |
| `app/globals.css` | Update button base styles, add 3D utilities, update focus styles |
| `components/Nav.tsx` | White bg, grey border, 3D CTA button |
| `components/Hero.tsx` | White bg, updated stat badges, 3D mockup |
| `components/WhyVibeCode.tsx` | Surface bg, 3D cards, updated accent colors |
| `components/MeetYourPet.tsx` | Remove gradient, 3D character cards |
| `components/HowItWorks.tsx` | Surface bg, 3D step cards, colored badges |
| `components/Features.tsx` | 3D cards, tinted icon containers |
| `components/MidCTA.tsx` | Primary green bg, white button |
| `components/SkillTreePreview.tsx` | 3D tier cards, updated progress bars |
| `components/Testimonials.tsx` | Surface bg, 3D cards |
| `components/FinalCTA.tsx` | 3D CTA, updated footer |
| `components/CharacterPicker.tsx` | 3D modal, 3D selection tiles |
| `components/PetGuide.tsx` | 3D speech bubbles |
| `components/WaitlistForm.tsx` | 3D submit button, rounded input |
| `components/AppWindowMockup.tsx` | 3D container |
| `components/ScrollReveal.tsx` | Spring physics transition |
| `components/SectionHeader.tsx` | Updated colors, eyebrow uppercase styling |

---

## 12. What Does NOT Change

- Page content and copy (all i18n keys stay the same)
- Character SVG illustrations (8 characters kept as-is)
- Character animation keyframes in globals.css (kept as-is)
- Section order and page structure
- CompanionContext and LocaleProvider logic
- i18n system and locale detection
- Static export configuration
- PetGuide scroll waypoint behavior
- CountUp animation logic
