import { Contributions } from "./api";

export interface StreakStats {
  current: number;
  longest: number;
  busiest: { date: string; count: number };
  activeDays: number;
}

// Flatten the contribution calendar (weeks → days, chronological) and derive
// streaks + the busiest day. Powers the "wrapped"-style stats strip.
export function computeStreaks(data: Contributions): StreakStats {
  const days = data.weeks.flat(); // already chronological
  let longest = 0;
  let run = 0;
  let busiest = { date: "", count: -1 };
  let activeDays = 0;

  for (const d of days) {
    if (d.count > 0) {
      run += 1;
      activeDays += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
    if (d.count > busiest.count) busiest = { date: d.date, count: d.count };
  }

  // Current streak = trailing run of active days ending on the last recorded day.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current += 1;
    else break;
  }

  return { current, longest, busiest, activeDays };
}
