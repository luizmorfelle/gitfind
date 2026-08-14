// A curated pool of well-known GitHub accounts for the "surprise me" action.
const NOTABLE = [
  "torvalds",
  "gvanrossum",
  "gaearon",
  "sindresorhus",
  "yyx990803",
  "tj",
  "addyosmani",
  "kentcdodds",
  "mojombo",
  "defunkt",
  "wycats",
  "getify",
  "bradfitz",
  "antfu",
  "leerob",
  "rauchg",
  "shadcn",
  "fabpot",
  "taylorotwell",
  "dhh",
];

// index passed in so callers control randomness (keeps this pure/testable).
export function notableAt(index: number): string {
  return NOTABLE[((index % NOTABLE.length) + NOTABLE.length) % NOTABLE.length];
}

export function randomNotable(): string {
  return notableAt(Math.floor(Math.random() * NOTABLE.length));
}
