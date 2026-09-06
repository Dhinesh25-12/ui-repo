/**
 * Returns the maximum value in a list of numbers, with a minimum floor of 1 to
 * avoid division-by-zero when used to compute percentage widths for bar charts.
 */
export function maxOrOne(values: number[]): number {
  return Math.max(1, ...values);
}

/** Default palette used for donut/pie chart slices and their legends. */
export const DONUT_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2'];

/**
 * Builds a CSS `conic-gradient(...)` value representing a donut chart for the
 * given values. Falls back to a neutral grey ring when there is no data.
 */
export function buildConicGradient(values: number[], colors: string[] = DONUT_COLORS): string {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return 'conic-gradient(#e5e7eb 0deg 360deg)';
  }
  let start = 0;
  const stops: string[] = [];
  values.forEach((value, index) => {
    const angle = (value / total) * 360;
    const end = start + angle;
    stops.push(`${colors[index % colors.length]} ${start}deg ${end}deg`);
    start = end;
  });
  return `conic-gradient(${stops.join(', ')})`;
}
