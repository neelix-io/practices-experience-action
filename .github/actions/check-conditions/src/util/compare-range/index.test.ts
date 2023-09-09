import { describe, expect, test } from '@jest/globals';

import compareRange from '.';


describe('compare-range util function', () => {
  test(
    'returns `true` if value within range [x, y] when both limits provided',
    () => {
      expect(compareRange(1, '-5,5')).toBe(true);
      expect(compareRange(7, '7,11')).toBe(true);
      expect(compareRange(3, '3,3')).toBe(true);
    }
  );

  test(
    'returns `true` if value greater or equal to x when upper limit omitted',
    () => {
      expect(compareRange(1, '-5,')).toBe(true);
      expect(compareRange(777777, '7,')).toBe(true);
      expect(compareRange(3, '3,')).toBe(true);
    }
  );

  test(
    'returns `true` if value less than or equal to y when lower limit omitted',
    () => {
      expect(compareRange(1, ',5')).toBe(true);
      expect(compareRange(-1000000, ',11')).toBe(true);
      expect(compareRange(3, ',3')).toBe(true);
    }
  );

  test(
    'returns `false` if value outside range [x, y] when both limits provided',
    () => {
      expect(compareRange(-5, '0,5')).toBe(false);
      expect(compareRange(6, '7,11')).toBe(false);
      expect(compareRange(4, '3,3')).toBe(false);
    }
  );

  test(
    'returns `false` if value less than x when upper limit omitted',
    () => {
      expect(compareRange(-10, '-5,')).toBe(false);
      expect(compareRange(6, '7,')).toBe(false);
    }
  );

  test(
    'returns `false` if value greater than y when lower limit omitted',
    () => {
      expect(compareRange(-1, ',-4')).toBe(false);
      expect(compareRange(12, ',11')).toBe(false);
    }
  );
});
