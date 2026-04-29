import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if the provided value is required.
 *
 * @param value The value to evaluate.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsRequired(null);
 * console.log(errors);
 * // ["Is a required value"]
 */
export function validateIsRequired(value: any, output: OutputType = 'record'): string[] {
  const errors: string[] = [];

  if (
    (typeof value === 'string' && value.trim().length === 0) ||
    value === null ||
    value === undefined
  ) {
    const errorMessage = `Is a required value`;
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
