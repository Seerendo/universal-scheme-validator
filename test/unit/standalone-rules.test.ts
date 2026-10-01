import { describe, expect, it } from 'vitest';
import {
  addError,
  validateBlackList,
  validateContainsValue,
  validateIsDate,
  validateIsKeyOf,
  validateIsObject,
  validateWhiteList,
  ValidationError,
} from '../../src';

class Example {
  name = '';
}

class Empty {}

describe('standalone validation rules', () => {
  it('validates whitelist strings and numbers', () => {
    expect(validateWhiteList('Admin', ['admin'])).toEqual([]);
    expect(validateWhiteList('guest', ['admin'])).toEqual([
      'The value must be in the white list: [admin]',
    ]);
    expect(validateWhiteList(1, [1])).toEqual([]);
    expect(validateWhiteList(1, ['1'])).toEqual([
      'The elements of the white list must be of type [number]',
      'The value must be in the white list: [1]',
    ]);
  });

  it('validates keys declared by a class', () => {
    expect(validateIsKeyOf('name', Example)).toEqual([]);
    expect(validateIsKeyOf('missing', Example)).toEqual([
      "The property 'missing' is not a valid key of class Example",
    ]);
    expect(validateIsKeyOf('name', Empty)).toEqual(['No properties found in class Empty.']);
  });

  it('handles empty and missing collection values', () => {
    expect(validateBlackList(null as any, ['admin'])).toEqual([]);
    expect(validateContainsValue(null, ['admin'])).toEqual([]);
    expect(validateContainsValue('admin', [])).toEqual([]);
    expect(validateIsDate('2024-01-02', false)).toEqual([]);
    expect(validateIsObject(null)).toEqual([]);
  });

  it('adds errors to records or throws validation errors', () => {
    const errors: string[] = [];

    addError(errors, 'Invalid value', 'record');
    expect(errors).toEqual(['Invalid value']);
    expect(() => addError(errors, 'Invalid value', 'exception')).toThrow(ValidationError);
  });
});
