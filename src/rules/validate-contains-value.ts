import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if at least one of the values from the "values" array exists in the "contains" array.
 * Throws an error if none of the values exist.
 *
 * @param values The value to validate (can be array, string, or number).
 * @param contains The allowed values.
 * @param output Expected output type.
 * @returns An array of errors (if output is "record"), or throws an exception if it is "exception".
 */
export function validateContainsValue(
  values: any,
  contains: any[],
  output: OutputType = 'record'
): string[] {
  const errors: string[] = [];

  if (values === null || values === undefined || contains.length === 0) {
    return errors;
  }

  // If values is array
  if (Array.isArray(values)) {
    const invalidItems = values.filter((item) => !contains.includes(item));
    if (invalidItems.length > 0) {
      const errorMessage = `The array contains invalid values: ${JSON.stringify(invalidItems)}`;
      if (output === 'exception') throw new ValidationError(errorMessage);
      else errors.push(errorMessage);
    }
    // If values is a string or number
  } else if (typeof values === 'string' || typeof values === 'number') {
    if (!contains.includes(values)) {
      const errorMessage = `The value must be in the allowed list: ${JSON.stringify(contains)}`;
      if (output === 'exception') throw new ValidationError(errorMessage);
      else errors.push(errorMessage);
    }
  }

  return errors;
}
