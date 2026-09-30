import { describe, it, expect } from 'vitest';
import { validateBlackList } from '../../src';

describe('validateBlackList', () => {
  it('returns no errors when the value is not in the blacklist', () => {
    expect(validateBlackList(['validValue'], ['blacklistedValue'])).toEqual([]);
  });

  it('returns an error when the value is in the blacklist', () => {
    expect(validateBlackList(['blacklistedValue'], ['blacklistedValue'])).toEqual([
      "The value 'blacklistedValue' is not allowed",
    ]);
  });

  it('returns multiple errors when multiple values are in the blacklist', () => {
    expect(
      validateBlackList(
        ['blacklistedValue1', 'blacklistedValue2'],
        ['blacklistedValue1', 'blacklistedValue2']
      )
    ).toEqual([
      "The value 'blacklistedValue1' is not allowed",
      "The value 'blacklistedValue2' is not allowed",
    ]);
  });
});
