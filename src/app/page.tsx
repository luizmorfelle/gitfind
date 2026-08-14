import type { Metadata } from "next";
import Home from "../components/Home";

// Per-user metadata so a shared ?u= link unfurls with the generated OG card.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ u?: string }>;
}): Promise<Metadata> {
  const { u } = await searchParams;
  const title = u ? `${u} · gitfind` : "gitfind";
  const image = u ? `/api/og?u=${encodeURIComponent(u)}` : "/api/og";
  return {
    title,
    openGraph: { title, images: [image] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

export default function Page() {
  return <Home />;
}
