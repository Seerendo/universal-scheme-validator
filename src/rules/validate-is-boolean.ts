import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if the value is a boolean.
 *
 * @param value The value to evaluate.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 */
export function validateIsBoolean(value: any, output: OutputType = 'record'): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  if (typeof value !== 'boolean') {
    const errorMessage = 'Must be a boolean';
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  return errors;
}
