import { describe, it, expect } from 'vitest';
import { validateContainsValue } from '../../src';

describe('validateContainsValue', () => {
  it('returns no errors when the value is in the allowed list', () => {
    expect(validateContainsValue('allowedValue', ['allowedValue'])).toEqual([]);
  });

  it('returns an error when the value is not in the allowed list', () => {
    expect(validateContainsValue('notAllowedValue', ['allowedValue'])).toEqual([
      'The value must be in the allowed list: ["allowedValue"]',
    ]);
  });

  it('returns no errors when the array contains only allowed values', () => {
    expect(
      validateContainsValue(
        ['allowedValue1', 'allowedValue2', 'allowedValue3'],
        ['allowedValue1', 'allowedValue2']
      )
    ).toEqual([]);
  });
});
