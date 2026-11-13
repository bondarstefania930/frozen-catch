/**
 * mulberry32 — a small, fast, deterministic PRNG.
 * One seed per attempt so any run can be reproduced from its seed.
 */
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** seed = levelIndex * 7919 ^ attempt * 104729 */
export function runSeed(levelIndex: number, attempt: number): number {
  return ((levelIndex * 7919) ^ (attempt * 104729)) >>> 0;
}

export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function randRange(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function pickWeighted<T extends string>(
  rng: Rng,
  weights: Array<[T, number]>,
): T {
  let total = 0;
  for (let i = 0; i < weights.length; i++) {
    total += weights[i][1];
  }
  if (total <= 0) {
    return weights[0][0];
  }
  let roll = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i][1];
    if (roll <= 0) {
      return weights[i][0];
    }
  }
  return weights[weights.length - 1][0];
}
