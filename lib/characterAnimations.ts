// Character-specific idle animations based on personality
// Each character has unique motion that reflects their identity

export const CHARACTER_ANIMATIONS: Record<string, {
  animate: Record<string, number[]>
  transition: Record<string, unknown>
}> = {
  // Byte: "Chaotic Core" — glitchy vibration, RGB scatter feel
  Byte: {
    animate: { rotate: [0, -2, 2, -1, 3, -2, 0], scale: [1, 1.02, 0.98, 1.01, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  // Nova: "Genius Mentor" — confident gentle sway with teaching gesture
  Nova: {
    animate: { rotate: [0, -5, 5, 0], y: [0, -3, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  // Sage: "Wise Guide" — slow meditative bob, barely moves
  Sage: {
    animate: { y: [0, -4, 0], rotate: [0, 1, 0, -1, 0] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  // Glitch: "Hacker Rebel" — erratic jitter, chaotic energy
  Glitch: {
    animate: { x: [0, -3, 4, -2, 3, 0], rotate: [0, -4, 5, -3, 0], scale: [1, 1.03, 0.97, 1.02, 1] },
    transition: { duration: 1.2, repeat: Infinity, ease: 'linear' },
  },
  // Crash: "Brute Force Hero" — aggressive bounce, hyper energy
  Crash: {
    animate: { y: [0, -8, 0, -5, 0], scale: [1, 1.05, 0.95, 1.03, 1] },
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
  // Zero: "Silent Optimiser" — barely perceptible drift, ghost-like
  Zero: {
    animate: { opacity: [1, 0.85, 1], y: [0, -1, 0] },
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
  // Luna: "Creative Builder" — playful wiggle, bouncy head bop
  Luna: {
    animate: { rotate: [0, -8, 8, -5, 5, 0], y: [0, -4, 0, -2, 0] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  // Null: "Wild Card" — glitchy flicker, eerie opacity changes
  Null: {
    animate: { opacity: [1, 0.4, 1, 0.7, 1], x: [0, -2, 3, -1, 0], scale: [1, 0.98, 1.02, 1] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
}

// Fallback for unknown characters
export const DEFAULT_ANIMATION = {
  animate: { y: [0, -4, 0] },
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
}

export function getCharacterAnimation(name: string) {
  return CHARACTER_ANIMATIONS[name] || DEFAULT_ANIMATION
}
