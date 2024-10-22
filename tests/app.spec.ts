import { describe, it } from 'node:test';
import { calculateDiscount } from '../src/utils/utils';
describe('App', () => {
    it('should calculate the discount', () => {
        const result = calculateDiscount(100, 10);
        expect(result).toBe(10);
    });
});
