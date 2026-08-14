import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// Safely renders a GitHub README: raw HTML is parsed then sanitized, and
// relative URLs resolve against the repo's raw/blob base so images/links work.
export default function MarkdownReadme({
  owner,
  repo,
  markdown,
}: {
  owner: string;
  repo: string;
  markdown: string;
}) {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`;
  const blobBase = `https://github.com/${owner}/${repo}/blob/HEAD/`;

  const resolveUrl = (url: string, key: string): string => {
    // Defense in depth: never emit a dangerous scheme even if sanitize changes.
    if (/^\s*(javascript|vbscript|file):/i.test(url)) return "#";
    if (/^(https?:|mailto:|#|data:)/.test(url)) return url;
    const path = url.replace(/^\.?\//, "");
    return (key === "src" ? rawBase : blobBase) + path;
  };

  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        urlTransform={resolveUrl}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
