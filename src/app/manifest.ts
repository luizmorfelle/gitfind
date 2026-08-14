import type { MetadataRoute } from "next";

// Makes gitfind installable (Add to Home Screen) as a standalone PWA.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "gitfind",
    short_name: "gitfind",
    description: "Find any GitHub user from a terminal-style console.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1117",
    theme_color: "#0d1117",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
