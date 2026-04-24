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
  // Root URL points at the current (v2) landing. The old
  // `app/page.tsx` content stays in the codebase in case we need
  // to roll back, but anyone hitting the domain root bounces to
  // /v2. `permanent: false` emits a 307 redirect (temporary) so
  // we can change our mind later without search engines caching
  // it as a 301.
  async redirects() {
    return [
      {
        source: '/',
        destination: '/v2',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
