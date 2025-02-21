export const clamp = (l: number, n: number, r: number): number => {
  if (l > r) {
    throw new Error("First argument must be smaller than second argument!");
  }
  return Math.max(l, Math.min(r, n));
};
