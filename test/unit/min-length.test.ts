import { describe, it, expect } from 'vitest';
import { runSchemaValidation, validateMinLength } from '../../src';

describe('validateMinLength', () => {
  it('returns no errors when the value meets the minimum length', () => {
    expect(validateMinLength('Hello', 3)).toEqual([]);
  });

  it('returns an error when the string is shorter than the minimum length', () => {
    expect(validateMinLength('Hi', 3)).toEqual(['Must have a minimum of 3 characters']);
  });

  it('throws a validation error when the schema property fails', () => {
    const schema = {
      name: {
        isRequired: true,
        minLength: 3,
      },
    };

    const user = { name: 'Hi' };

    expect(() => runSchemaValidation(user, schema)).toThrow();
  });
});
