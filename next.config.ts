import type { NextConfig } from "next";
import { DOWNLOAD_PATH, DOWNLOAD_TARGET } from "./lib/download";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // output: "export", — removed to enable API routes on Vercel
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  // Hide the Next.js dev-mode on-screen indicator (the little "N"
  // badge in the bottom-left of every page during `next dev`).
  // Purely a DX preference — Next still surfaces build and runtime
  // errors via the overlay; only the route-status badge is removed.
  devIndicators: false,
  // Canonical landing URL is `/` — the V2 landing is re-exported
  // from `app/page.tsx`. We canonicalize `/v2` → `/` so the base
  // domain never includes `/v2` and any old inbound links land on
  // the canonical URL. `permanent: false` (307) keeps it reversible
  // without search engines caching it as a 301.
  async redirects() {
    return [
      {
        source: '/v2',
        destination: '/',
        permanent: false,
      },
      // The macOS download. `murror.app/download/Codepet.dmg` is the URL we publish
      // everywhere; this is the only place that knows it currently resolves to GitHub
      // Releases, so the host can change without invalidating a single printed link.
      //
      // `permanent: false` (307) on purpose, and it is not laziness. A 301 is cached by
      // browsers indefinitely — if the asset ever moves off GitHub, every user who
      // downloaded once would keep being sent to the old host by their own browser, with
      // nothing we could deploy to fix it.
      {
        source: DOWNLOAD_PATH,
        destination: DOWNLOAD_TARGET,
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
