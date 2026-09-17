# Blog images — where to upload

Each article has **its own folder** here, named after the post's slug:

```
public/blog/<slug>/        ← all images for one article live here
public/blog/<slug>/cover.png   ← the article cover (optional)
```

The folder name must match the markdown filenames in
`content/blog/<slug>.en.md` / `content/blog/<slug>.vi.md`.

## How to upload images for an article

1. Drop your image file(s) into `public/blog/<slug>/`
   (e.g. `public/blog/what-is-vibe-coding/diagram.png`).
2. Reference it from the post with a **root-relative** path — the leading
   `/blog/...` is served straight from `public/`:

   ```markdown
   ![A diagram of the RAG pipeline](/blog/what-is-vibe-coding/diagram.png)
   ```

3. For the **cover**, name the file `cover.png` and add it to the frontmatter
   of *both* locale files (same image, no text):

   ```yaml
   cover: "/blog/<slug>/cover.png"
   coverAlt: "Short description of the image"
   ```

If a post has no `cover:`, the layout falls back to the procedural pixel-art
landscape from `app/blog/_components/CoverArt.tsx` — see `../../content/blog/COVERS.md`.

## Article folders

One folder per post (create a new one when you add a post):

- `ai-as-thought-partner-not-search-engine/`
- `ask-ai-to-review-your-code/`
- `building-a-second-brain-that-thinks-with-you/`
- `building-ai-product-in-public/`
- `measure-before-you-optimize/`
- `what-beginners-taught-us-learning-to-code-with-ai/`
- `what-is-vibe-coding/`

## Not for articles

- `library/` — shared, reusable pixel-art scenes (point a post's `cover:` at one).
- `hero.png`, `band.png` — decorative **section backgrounds** for the blog
  landing and newsletter strip. These are not article images.
