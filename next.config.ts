import type { NextConfig } from "next";

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
      // Stable, branded download URL → latest GitHub release asset. The
      // website button points here (code-pet.com/download/Codepet.dmg) so it
      // never changes per release; only the GitHub release gets updated.
      // `permanent: false` (307) keeps the host swappable later.
      {
        source: '/download/Codepet.dmg',
        destination:
          'https://github.com/My-Outcasts/codepet/releases/latest/download/Codepet.dmg',
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
    ]
  },
};

export default nextConfig;
