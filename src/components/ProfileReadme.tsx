import MarkdownReadme from "./MarkdownReadme";

export default function ProfileReadme({ login, markdown }: { login: string; markdown: string }) {
  return (
    <section className="mt-6 rounded-lg border border-border bg-bg">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="select-none text-accent">▸</span>
        <span className="font-mono text-xs text-muted">
          {login}/{login} · README.md
        </span>
      </div>
      <div className="max-h-[40vh] overflow-y-auto px-4 py-4">
        <MarkdownReadme owner={login} repo={login} markdown={markdown} />
      </div>
    </section>
  );
}
