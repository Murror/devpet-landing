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
      // The v3 cinematic-dark design is now the canonical landing at `/`
      // (see app/page.tsx). Canonicalize the old draft URL so any inbound
      // links to /v3 land on `/`. 307 keeps it reversible.
      {
        source: '/v3',
        destination: '/',
        permanent: false,
      },
      // Stable, branded download URL → latest GitHub release asset. The
      // website button points here (code-pet.com/download/Codepet.dmg) so it
      // never changes per release; only the GitHub release gets updated.
      // `permanent: false` (307) keeps the host swappable later.
      //
      // The two values come from lib/download.ts, which the /download page imports too.
      // They have to agree — a page whose button points somewhere this rule does not cover
      // is a 404 while both files look individually correct.
      {
        source: DOWNLOAD_PATH,
        destination: DOWNLOAD_TARGET,
        permanent: false,
      },
    ]
  },
  // Mount the separate Codepet Academy deployment under /academy
  // so visitors see code-pet.com/academy in the URL bar instead of
  // bouncing to a different *.vercel.app domain. Vercel proxies the
  // request server-side; the academy codebase (Murror/codepet-academy)
  // stays untouched and continues to deploy independently.
  async rewrites() {
    return [
      {
        source: '/academy',
        destination: 'https://codepet-academy.vercel.app',
      },
      {
        source: '/academy/:path*',
        destination: 'https://codepet-academy.vercel.app/:path*',
      },
      // Mount the Codepet v1.2 web app under /app so the v3 landing's
      // "Open the web app" CTA keeps visitors on code-pet.com/app instead
      // of bouncing to the *.vercel.app domain. Vercel proxies the request
      // server-side; the app codebase (My-Outcasts/Codepet-ver-1.2) stays
      // untouched and deploys independently.
      {
        source: '/app',
        destination: 'https://codepet-v1-2.vercel.app',
      },
      {
        source: '/app/:path*',
        destination: 'https://codepet-v1-2.vercel.app/:path*',
      },
    ]
  },
};

export default nextConfig;
