import { describe, it, expect } from 'vitest';
import { validateIsNumber } from '../../src';

describe('validateIsNumber', () => {
  it('returns no errors when the value is a valid number', () => {
    expect(validateIsNumber(42)).toEqual([]);
  });

  it('returns an error when the value is not a number', () => {
    expect(validateIsNumber('not a number')).toEqual(['Must be a number']);
  });

  it('returns an error when the value is zero and isZero is false', () => {
    expect(validateIsNumber(0, { isZero: false })).toEqual(['Cannot be zero']);
  });

  it('returns an error when the value is not an integer and type is "integer"', () => {
    expect(validateIsNumber(3.14, { type: 'integer' })).toEqual(['Must be an integer']);
  });
});
