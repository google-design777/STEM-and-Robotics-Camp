import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles Next.js natively — no need for `output: "standalone"`.
  // (standalone mode was breaking the Vercel build because the custom `cp` commands
  // in the build script assumed a local filesystem layout that Vercel doesn't have.)
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
