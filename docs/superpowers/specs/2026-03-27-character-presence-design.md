# Character Presence Redesign — Duolingo-Style Layout

**Date:** 2026-03-27
**Status:** Approved
**Scope:** Restructure landing page layout so characters appear in every section using alternating text/character layout, remove PetGuide, CharacterPicker, MeetYourPet, and AppWindowMockup.

---

## Goals

- Make characters the visual centerpiece of every section (like Duo on Duolingo)
- Use alternating left/right layout for text and character illustrations
- Simplify the page from 10 sections to 9 by removing MeetYourPet
- Remove all companion/picker infrastructure that's no longer needed

## Non-Goals

- Changing page content/copy or i18n keys (reuse existing translations)
- Redesigning character SVGs
- Changing the Duolingo-style design tokens (already applied)

---

## 1. Components to Remove

| Component | File | Reason |
|-----------|------|--------|
| PetGuide | `components/PetGuide.tsx` | Characters now in sections, no floating companion needed |
| CharacterPicker | `components/CharacterPicker.tsx` | No character selection needed, characters are fixed per section |
| AppWindowMockup | `components/AppWindowMockup.tsx` | Replaced by character group in hero |
| MeetYourPet | `components/MeetYourPet.tsx` | Characters already visible throughout page |
| CompanionContext | `lib/CompanionContext.tsx` | No longer needed without PetGuide/CharacterPicker |

### Cleanup in other files

- `app/layout.tsx`: Remove `CompanionProvider` wrapper
- `app/page.tsx`: Remove `<CharacterPicker />`, `<PetGuide />`, `<MeetYourPet />` imports and usage
- `components/Hero.tsx`: Remove `useCompanion()` hook, remove `AppWindowMockup` import, remove `pickerDismissed` logic — all hero animations should run immediately on mount

---

## 2. Hero Section — Character Group

Replace the right side (AppWindowMockup) with a 2x2 grid of 4 characters.

### Characters in Hero

| Position | Character | Color |
|----------|-----------|-------|
| Top-left | Byte | `#534AB7` |
| Top-right | Nova | `#BA7517` |
| Bottom-left | Sage | `#085041` |
| Bottom-right | Glitch | `#993556` |

### Layout

```
[Text content]          [2x2 Character Grid]
  Badge                   Byte    Nova
  H1 title                 (stagger -8px)  (+8px)
  Subtitle               Sage    Glitch
  Stats                    (-4px)  (+12px)
  WaitlistForm
```

- Each character: `CharacterSvg` in a rounded container with the character's color as light background (`color + '15'`)
- Staggered vertical positions using `translateY` for playful feel
- Each character has a subtle idle animation (bounce/float) using framer-motion
- Container: `aspect-square rounded-2xl` with `border-2 border-border shadow-card`
- On mobile: character grid stacks below text content (single column)

### Hero Animation Changes

- Remove `pickerDismissed` dependency — all elements animate on mount immediately
- Characters stagger in with spring animation (delay: 0.1s per character)
- Remove `useCompanion()` import

---

## 3. Section Character Assignments

Each section gets one fixed character displayed alongside content in an alternating layout.

| Section | Character | Side | Reason |
|---------|-----------|------|--------|
| WhyVibeCode | Glitch (🩷 `#993556`) | Right | Hacker Rebel — fits "pain points", frustration |
| HowItWorks | Nova (🟠 `#BA7517`) | Left | Genius Mentor — teaching, guiding steps |
| Features | Sage (🟢 `#085041`) | Right | Wise Guide — presenting capabilities |
| SkillTree | Crash (🔴 `#A32D2D`) | Left | Brute Force Hero — XP, leveling up |
| Testimonials | Luna (🟣 `#534AB7`) | Right | Creative Builder — community, social |
| FinalCTA | Null (🟢 `#3B6D11`) | Left | Wild Card — "what are you waiting for?" |

**MidCTA**: No character (green background CTA, keep as-is).

---

## 4. Alternating Layout Pattern

Each section with a character uses a 2-column grid that alternates character position:

### Character on Right (WhyVibeCode, Features, Testimonials)

```
[Text/Cards content — 60%]    [Character SVG — 40%]
```

### Character on Left (HowItWorks, SkillTree, FinalCTA)

```
[Character SVG — 40%]    [Text/Cards content — 60%]
```

### CSS Pattern

```tsx
// Character on right
<section className="...">
  <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
    <div>{/* Text content, cards, etc */}</div>
    <div>{/* Character SVG with container */}</div>
  </div>
</section>

// Character on left
<section className="...">
  <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
    <div>{/* Character SVG with container */}</div>
    <div>{/* Text content, cards, etc */}</div>
  </div>
</section>
```

### Character Container

Each section's character is rendered inside a styled container:

```tsx
<div
  className="aspect-square rounded-2xl flex items-center justify-center max-w-[280px] mx-auto"
  style={{ backgroundColor: characterColor + '15' }}
>
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    className="w-[70%] h-[70%]"
  >
    <CharacterSvg name={characterName} className="w-full h-full" />
  </motion.div>
</div>
```

- Light tinted background using character's color + `'15'` opacity
- Subtle float animation (same pattern across all sections for consistency)
- `max-w-[280px]` to keep characters from getting too large
- `mx-auto` to center on mobile when stacking

### Mobile Behavior

On mobile (`md:` breakpoint), the grid becomes single column:
- Character stacks **above** text content for "character on left" sections
- Character stacks **below** text content for "character on right" sections
- This is natural with CSS grid — left column renders first (above), right column renders second (below)

---

## 5. Section-by-Section Changes

### 5.1 Hero

- Remove `AppWindowMockup` import and usage
- Remove `useCompanion()` and `pickerDismissed` — all animations run immediately
- Right side: 2x2 grid of characters (Byte, Nova, Sage, Glitch) with staggered translateY
- Each character in a rounded container with tinted bg + idle animation

### 5.2 WhyVibeCode

- Wrap existing content in `grid md:grid-cols-[1.2fr_0.8fr]`
- Left: existing heading + pain point cards (keep vertical layout)
- Right: Glitch character container with idle animation
- Keep `bg-surface` background

### 5.3 HowItWorks

- Wrap in `grid md:grid-cols-[0.8fr_1.2fr]`
- Left: Nova character container
- Right: existing SectionHeader + step cards grid
- Keep `bg-surface` background

### 5.4 Features

- Wrap in `grid md:grid-cols-[1.2fr_0.8fr]`
- Left: existing SectionHeader + 2x2 feature cards
- Right: Sage character container
- White background

### 5.5 MidCTA

- No changes. Keep green bg CTA as-is.

### 5.6 SkillTree

- Wrap in `grid md:grid-cols-[0.8fr_1.2fr]`
- Left: Crash character container
- Right: existing centered header + tier cards
- White background

### 5.7 Testimonials

- Wrap in `grid md:grid-cols-[1.2fr_0.8fr]`
- Left: existing header + 3-column testimonial cards (these become single column within the left side, or keep as 3 cards stacked)
- Right: Luna character container
- `bg-surface` background
- Note: testimonial cards grid changes from `md:grid-cols-3` to single column or `grid-cols-1 lg:grid-cols-2` since they now share space with character

### 5.8 FinalCTA

- Wrap in `grid md:grid-cols-[0.8fr_1.2fr]`
- Left: Null character container
- Right: existing centered CTA content (heading, subtitle, WaitlistForm)
- Footer stays full-width below

---

## 6. Files to Modify

| File | Changes |
|------|---------|
| `app/layout.tsx` | Remove `CompanionProvider` import and wrapper |
| `app/page.tsx` | Remove CharacterPicker, PetGuide, MeetYourPet imports and usage |
| `components/Hero.tsx` | Replace AppWindowMockup with 4-character grid, remove useCompanion |
| `components/WhyVibeCode.tsx` | Add Glitch character right side, alternating layout |
| `components/HowItWorks.tsx` | Add Nova character left side, alternating layout |
| `components/Features.tsx` | Add Sage character right side, alternating layout |
| `components/SkillTreePreview.tsx` | Add Crash character left side, alternating layout |
| `components/Testimonials.tsx` | Add Luna character right side, adjust card grid |
| `components/FinalCTA.tsx` | Add Null character left side, alternating layout |

## 7. Files to Delete

| File | Reason |
|------|--------|
| `components/PetGuide.tsx` | No longer used |
| `components/CharacterPicker.tsx` | No longer used |
| `components/AppWindowMockup.tsx` | No longer used |
| `components/MeetYourPet.tsx` | No longer used |
| `lib/CompanionContext.tsx` | No longer used |

---

## 8. What Does NOT Change

- Character SVG files (`public/characters/*.svg`)
- CharacterSvg component (`components/CharacterSvg.tsx`)
- Character CSS animations in `globals.css`
- All i18n keys and translations
- ScrollReveal, SectionHeader, WaitlistForm, Icon components
- MidCTA section
- Nav component
- Tailwind config and design tokens
- Static export configuration
