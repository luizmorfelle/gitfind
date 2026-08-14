import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export default function ProfileReadme({
  login,
  markdown,
}: {
  login: string;
  markdown: string;
}) {
  // Profile READMEs use relative paths and raw HTML banners. Resolve relative
  // URLs against the repo's raw/blob base so images and links actually work
  // off github.com; rehype-sanitize keeps the HTML safe (no scripts/handlers).
  const rawBase = `https://raw.githubusercontent.com/${login}/${login}/HEAD/`;
  const blobBase = `https://github.com/${login}/${login}/blob/HEAD/`;

  const resolveUrl = (url: string, key: string): string => {
    if (/^(https?:|mailto:|#|data:)/.test(url)) return url;
    const path = url.replace(/^\.?\//, "");
    return (key === "src" ? rawBase : blobBase) + path;
  };

  return (
    <section className="mt-6 rounded-lg border border-border bg-bg">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="select-none text-accent">▸</span>
        <span className="font-mono text-xs text-muted">
          {login}/{login} · README.md
        </span>
      </div>
      <div className="markdown max-h-[40vh] overflow-y-auto px-4 py-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          urlTransform={resolveUrl}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </section>
  );
}
