# Blog cover images — hybrid workflow

Each post's cover is **either** a hand-picked image **or** an automatic pick
from the curated library (`app/blog/_components/CoverArt.tsx`), with a
procedural generator as the last-resort fallback. You never have to make an
image for every post — only the ones you want to override.

The covers are cinematic **ASCII / code-art** scenes on a near-black canvas
(the same visual family as the dark v3 site and its department covers). This
replaced the older light pixel-art landscapes.

> This file is documentation only. The post loader ignores it (it loads
> just `<slug>.en.md` / `<slug>.vi.md`), so it will never appear as a post.

## How the override works

`PostCard`, `FeaturedCard`, and `ArticleView` all do the same thing:

```tsx
{post.cover ? <img src={post.cover} … /> : <CoverArt slug={…} category={…} />}
```

So a post shows your image the moment it has a `cover:` in frontmatter, and
otherwise `CoverArt` auto-assigns a library image deterministically from the
slug (same slug → same cover, SSR-safe). **Most posts should just omit
`cover:`** and let the library handle it — the daily auto-post can too.

## Point a post at a specific library cover

Pick any name from the library below and set it in the frontmatter of *both*
`<slug>.en.md` and `<slug>.vi.md` (covers have no text, so both locales share
one image):

```yaml
cover: "/blog/library/cosmic-whirlpool.jpg"
coverAlt: "Cinematic code-art spiral of glowing characters"
```

To revert to the automatic pick, delete the two lines.

## Cover image library

Ready-to-use ASCII code-art scenes in `public/blog/library/` (all `.jpg`,
~1600px wide, center-cropped by the layout). `CoverArt` groups them by colour
mood so each pillar reads in its accent hue:

**building-ai-products** (cool cosmic / structured):
- `zoom-burst-coder`, `cosmic-whirlpool`, `cinematic-chairs`,
  `astronaut-portal`, `vinyl-record`, `cosmic-ribbons`,
  `musician-vortex`, `isometric-tunnel`, `drummer`

**user-insights** (blue):
- `night-coder`, `night-garden-observatory`, `double-exposure-portrait`,
  `ghibli-night-scene`, `coder-on-couch`, `surreal-hand`,
  `astronaut-portrait`, `cosmic-book-reader`, `gallery-of-light`

**second-brain** (pink / magenta):
- `hands-cradling-sun`, `cosmic-math-cubes`, `hands-capsule`,
  `chess-dreamscape`, `retro-cd-disc`, `riso-circles`,
  `orbital-rings`, `balancing-objects`, `holographic-cd`

Any image can be used for any post via an explicit `cover:` — the grouping
above only controls the automatic pick.

## Image specs

- **Aspect ratio:** flexible; the listing crops to ~16:10 and the article
  cover to 16:9 via `object-fit: cover`, so keep the subject roughly centered
  and avoid important detail in the far corners.
- **Format / size:** JPG, ~1600px on the long edge, optimized (mozjpeg
  q≈82). Drop new source art in `public/blog/library/<name>.jpg` and add the
  name to the right category array in `CoverArt.tsx`.

## Generation prompt (on-brand: cinematic ASCII code-art)

Base style to keep in every prompt:

> Cinematic ASCII / code-art on a near-black canvas — the subject rendered
> entirely out of tiny glowing code characters, numbers and symbols; dense
> dithered detail, subtle film-grain feel, dramatic single light source, deep
> negative space, no legible text, no watermark. Premium, magical, mysterious.

Per category (matches the accent hues):

- **building-ai-products** (purple / cool cosmic): *"…violet-and-teal cosmic
  structure — a whirlpool, orbiting rings, or a lone figure before a vast
  code vista."*
- **user-insights** (blue): *"…deep-blue night scene lit with warm gold — a
  coder at a laptop, a city of code, a portrait half-dissolving into data."*
- **second-brain** (pink / magenta): *"…pink-and-magenta surreal tableau —
  cupped hands cradling a glowing sun, floating cubes, orbiting rings, a mind
  opening into starlight."*

Generate a few and pick the one with the clearest read and calmest
composition (covers sit behind a headline / under a scrim).
