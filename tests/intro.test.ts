import { describe, it, test, expect } from 'vitest';
import { calculatePercentage } from '../src/utils';

describe.skip('calculatePercentage', () => {
    it('should calculate percentage based on percentage value', () => {
        expect(calculatePercentage(100, 10)).toBe(10);
    });
});
