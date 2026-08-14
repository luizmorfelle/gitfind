// A faint, static contribution-grid texture behind the whole app — the same
// green-square language as the empty state, but whisper-quiet so content reads.
export default function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundColor: "var(--color-bg)",
        backgroundImage:
          "radial-gradient(var(--color-accent) 1.4px, transparent 1.5px)",
        backgroundSize: "17px 17px",
        opacity: 0.05,
      }}
    />
  );
}
