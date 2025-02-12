
function hashFnv32a(str: string): number {
  let hval = 0x811c9dc5;
  const l = str.length;

  for (let i = 0; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval +=
      (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return hval >>> 0;
}

export function hash(
  seed: string,
  value: string,
  version: number
): number | null {
  // New unbiased hashing algorithm
  if (version === 2) {
    return (hashFnv32a(hashFnv32a(seed + value) + "") % 10000) / 10000;
  }
  // Original biased hashing algorithm (keep for backwards compatibility)
  if (version === 1) {
    return (hashFnv32a(value + seed) % 1000) / 1000;
  }

  // Unknown hash version
  return null;
}

export type VariationRange = [number, number];

export function inRange(n: number, range: VariationRange): boolean {
  return n >= range[0] && n < range[1];
}

export function isIncludedInRollout(
  hashValue: string,
  seed: string,
  range: VariationRange | undefined,
  coverage: number | undefined,
  hashVersion: number | undefined
): boolean {
  if (!range && coverage === undefined) return true;

  if (!range && coverage === 0) return false;

  if (!hashValue) {
    return false;
  }

  const n = hash(seed, hashValue, hashVersion || 1);
  if (n === null) return false;

  return range
    ? inRange(n, range)
    : coverage !== undefined
      ? n <= coverage
      : true;
}
