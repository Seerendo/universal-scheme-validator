import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates whether a property may explicitly contain `null`.
 *
 * @param value The value of the property to evaluate.
 * @param isNullable Whether `null` is allowed.
 * @param output The expected validation output type.
 * @returns An array of validation errors.
 *
 * @example
 * const errors = validateIsNullable(null, false);
 * console.log(errors);
 * // ["The property cannot be null"]
 */
export function validateIsNullable(
  value: any,
  isNullable = true,
  output: OutputType = 'record',
  propertyName?: string
): string[] {
  if (value !== null || isNullable) {
    return [];
  }

  const errorMessage = propertyName
    ? `The property '${propertyName}' cannot be null`
    : 'The property cannot be null';
  if (output === 'exception') {
    throw new ValidationError(errorMessage);
  }

  return [errorMessage];
}
