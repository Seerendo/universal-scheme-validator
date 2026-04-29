import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if the value is not empty.
 *
 * @param value The value to evaluate.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors,
 *          if the value is an empty string.
 */
export function validateIsNotEmpty(value: any, output: OutputType = 'record'): string[] {
  const errors: string[] = [];

  if (typeof value === 'string' && value.trim().length === 0) {
    const errorMessage = 'Cannot be an empty string';
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  if (Array.isArray(value) && value.length === 0) {
    const errorMessage = 'Cannot be an empty array';
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
