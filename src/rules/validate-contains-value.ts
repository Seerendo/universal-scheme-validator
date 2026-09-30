import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if at least one of the values from the "contains" array exists in the "values" array.
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

  if (Array.isArray(values)) {
    const hasMatch = contains.some((item) => values.includes(item));

    if (!hasMatch) {
      const errorMessage = `The array must contain at least one of the following values: ${JSON.stringify(contains)}`;
      if (output === 'exception') throw new ValidationError(errorMessage);
      else errors.push(errorMessage);
    }
  } else if (typeof values === 'string' || typeof values === 'number') {
    if (!contains.includes(values)) {
      const errorMessage = `The value must be in the allowed list: ${JSON.stringify(contains)}`;
      if (output === 'exception') throw new ValidationError(errorMessage);
      else errors.push(errorMessage);
    }
  }

  return errors;
}
