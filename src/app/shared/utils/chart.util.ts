/**
 * Returns the maximum value in a list of numbers, with a minimum floor of 1 to
 * avoid division-by-zero when used to compute percentage widths for bar charts.
 */
export function maxOrOne(values: number[]): number {
  return Math.max(1, ...values);
}
