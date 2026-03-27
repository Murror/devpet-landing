# Pet Guide — Inline Waypoint System

**Date:** 2026-03-26
**Status:** Approved

## Overview

Replace the current fixed-corner FloatingCompanion with an inline pet guide that bounces between sections as the user scrolls. The pet lives inside the page layout — not as a floating overlay — creating a "guide leading you through the site" experience.

## User Decisions

- **Movement style:** Bounce/jump between sections (platformer feel)
- **Position:** Each section has a custom-designed position for the pet
- **Speech bubbles:** Context-aware, full sentences per section
- **Click interaction:** Fun animation (jump + rotate + random quote + sparkles)
- **Mobile:** Fallback to small fixed bottom-right corner with fade transitions
- **Approach:** Inline Waypoint (pet in DOM flow, not fixed overlay)

## Architecture

### Components

**PetSlot** — Invisible anchor point placed inside each section
- Registers its DOM position into CompanionContext on mount
- Uses Framer Motion `useInView` to report when section is visible
- Renders only a hidden `<div ref />` — zero visual footprint

**PetGuide** — Single pet instance rendered at page level (replaces FloatingCompanion + ByteGuide)
- Reads `activeSection` from Context → gets target PetSlot position
- Animates bounce from current position to target using spring physics
- Renders: pet SVG + speech bubble + click interaction area
- During transition: temporarily `position: fixed` → on arrival: `position: absolute` relative to slot
- Desktop only for bounce; mobile uses simplified fixed mode

**CompanionProvider** (enhanced) — State management
- Existing: `characterName`, `pick()`
- New: `activeSection`, `slotPositions: Record<string, DOMRect>`, `registerSlot()`, `setActiveSection()`, `isTransitioning`

### Data Flow

1. User scrolls → PetSlot's `useInView` fires
2. PetSlot calls `setActiveSection("features")`
3. PetGuide reads new activeSection from Context
4. PetGuide gets target position from `slotPositions["features"]`
5. PetGuide animates: current pos → arc up → bounce down to target
6. Speech bubble fades in after pet lands (300ms delay)
7. Pet switches to section-specific idle pose

### Section Waypoints

| Section | Position | Pose | Speech (vi) |
|---------|----------|------|-------------|
| Hero | Next to CTA button | Wave | "Chào mừng đến VibeMon!" |
| HowItWorks | Right of step 1 | Point right | "Xem cách hoạt động nè" |
| Features | On top of feature card | Excited | "Tính năng xịn lắm!" |
| SkillTree | Beside skill tree | Thinking | "Level up nào!" |
| Testimonials | Between cards | Happy | "Mọi người nói gì..." |
| FinalCTA | Next to sign-up form | Wave | "Tham gia ngay!" |

## Animation

### Bounce Transition (section → section)

5-phase keyframe sequence:
1. **Launch** (0-200ms) — Scale down 0.8, lift off from current slot
2. **Arc** (200-500ms) — Curved path upward (translateY decrease)
3. **Land** (500-700ms) — Drop to new slot with spring
4. **Settle** (700-900ms) — Squash & stretch on landing
5. **Speech** (900-1200ms) — Bubble fade in + scale from 0

```
Framer Motion spring config:
  type: "spring", stiffness: 300, damping: 20, mass: 0.8

Squash & stretch on land:
  scaleY: [1, 0.8, 1.1, 1]
  scaleX: [1, 1.2, 0.9, 1]
  duration: 200ms
```

### Idle Poses

CSS transform-based animations on existing pet SVGs:
- **Wave:** rotate(-10deg) + hand keyframe
- **Point right:** scaleX(-1) flip if needed
- **Excited:** continuous small bounce
- **Thinking:** head tilt + slow bob
- **Happy:** gentle sway
- **Walk (transition):** alternating leg/body movement

### Click Interaction

1. Pet jumps (translateY -20px → spring back)
2. Random rotation (-15° to +15°)
3. Random quote from fun pool (separate from section speech)
4. 3-5 sparkle particles around pet, fade out
5. Cooldown: 1 second between clicks

Fun quotes pool examples:
- "Hehe!" · "Code thêm đi!" · "Bug-free zone 🛡" · "Ship it! 🚀" · "Ngon lắm!"

## Mobile (< 768px)

- Pet size: 48px → 36px
- Position: fixed bottom-right corner
- Transition: fade instead of bounce
- Waypoints: only 3 (Hero, Features, CTA)
- Speech bubbles: shorter text, auto-hide 3s
- Click interaction: kept as-is

Detection: `useMediaQuery("(min-width: 768px)")` or window.matchMedia

## Migration

| Component | Action | Reason |
|-----------|--------|--------|
| FloatingCompanion | DELETE | Replaced by PetGuide |
| ByteGuide | DELETE | Guide role now handled by pet |
| CompanionContext | MODIFY | Add slot registry + active section |
| CharacterPicker | KEEP | Works as-is |
| i18n files | MODIFY | Add fun quotes pool |

## Files

```
CREATE  components/PetGuide.tsx
CREATE  components/PetSlot.tsx
MODIFY  lib/CompanionContext.tsx
MODIFY  app/page.tsx
MODIFY  components/Hero.tsx
MODIFY  components/HowItWorks.tsx
MODIFY  components/Features.tsx
MODIFY  components/SkillTreePreview.tsx
MODIFY  components/Testimonials.tsx
MODIFY  components/FinalCTA.tsx
MODIFY  lib/i18n/en.json
MODIFY  lib/i18n/vi.json
DELETE  components/FloatingCompanion.tsx
DELETE  components/ByteGuide.tsx
```

## Accessibility & Performance

- **prefers-reduced-motion:** Teleport instead of bounce, no sparkles
- **Performance:** Single pet instance, transform/opacity only (GPU accelerated)
- **aria-hidden="true":** Pet is decorative
- **pointer-events:** Pet clickable but doesn't block underlying content
