import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production builds from overwriting an active dev server's HMR cache.
  distDir: process.env.NODE_ENV === "development" ? ".next" : ".next-build",
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
