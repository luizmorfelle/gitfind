import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG route reads these at runtime through a built path, which tracing
  // cannot follow on its own.
  outputFileTracingIncludes: {
    "/api/og": ["./src/app/api/og/fonts/*.ttf"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
