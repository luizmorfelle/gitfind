"use client";
import { useEffect, useState } from "react";

// Live GitHub API budget in the status line — the terminal touch that also
// warns you before a burst of typing burns through the rate limit.
export default function RateMeter() {
  const [rate, setRate] = useState<{ remaining: number; limit: number } | null>(null);

  useEffect(() => {
    let active = true;
    const load = () =>
      fetch("/api/rate")
        .then((r) => r.json())
        .then((d) => {
          if (active && d.remaining != null) setRate(d);
        })
        .catch(() => undefined);
    load();
    const id = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (!rate) return null;
  const low = rate.remaining < rate.limit * 0.1;
  return (
    <span className={low ? "text-[#ff7b72]" : ""}>
      api {rate.remaining}/{rate.limit}
    </span>
  );
}
