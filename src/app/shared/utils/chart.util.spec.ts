import { buildConicGradient, maxOrOne } from './chart.util';

describe('chart.util', () => {
  describe('maxOrOne', () => {
    it('returns the maximum of the given values', () => {
      expect(maxOrOne([3, 7, 2])).toBe(7);
    });

    it('floors at 1 to avoid division by zero', () => {
      expect(maxOrOne([])).toBe(1);
      expect(maxOrOne([0, 0])).toBe(1);
    });
  });

  describe('buildConicGradient', () => {
    it('returns a neutral ring when there is no data', () => {
      expect(buildConicGradient([])).toBe('conic-gradient(#e5e7eb 0deg 360deg)');
      expect(buildConicGradient([0, 0])).toBe('conic-gradient(#e5e7eb 0deg 360deg)');
    });

    it('splits the circle proportionally across values using the given colors', () => {
      const gradient = buildConicGradient([1, 1], ['#111', '#222']);
      expect(gradient).toBe('conic-gradient(#111 0deg 180deg, #222 180deg 360deg)');
    });

    it('cycles through colors when there are more slices than colors', () => {
      const gradient = buildConicGradient([1, 1, 1], ['#111']);
      expect(gradient).toContain('#111 0deg 120deg');
      expect(gradient).toContain('#111 120deg 240deg');
      expect(gradient).toContain('#111 240deg 360deg');
    });
  });
});
