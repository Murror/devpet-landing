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
