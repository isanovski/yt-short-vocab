/* RNG deterministik: seed string → angka acak yang stabil.
   Dipakai supaya pilihan palet & kata acak tetap sama di seluruh frame render
   dan bisa direproduksi dengan memakai seed yang sama. */

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngFromSeed(seed: string): () => number {
  return mulberry32(hashString(seed));
}

export function pickOne<T>(items: readonly T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

/** Ambil `count` item unik tanpa pengulangan (Fisher–Yates dengan rng). */
export function sample<T>(items: readonly T[], count: number, rng: () => number): T[] {
  const pool = [...items];
  const out: T[] = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const j = Math.floor(rng() * pool.length);
    out.push(pool[j]);
    pool.splice(j, 1);
  }
  return out;
}
