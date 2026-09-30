import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates whether a property may be omitted from the validated object.
 *
 * @param value The value of the property to evaluate.
 * @param isOptional Whether `undefined` is allowed.
 * @param output The expected validation output type.
 * @returns An array of validation errors.
 *
 * @example
 * const errors = validateIsOptional(undefined, false);
 * console.log(errors);
 * // ["The property cannot be omitted"]
 */
export function validateIsOptional(
  value: any,
  isOptional = true,
  output: OutputType = 'record',
  propertyName?: string
): string[] {
  if (value !== undefined || isOptional) {
    return [];
  }

  const errorMessage = propertyName
    ? `The property '${propertyName}' cannot be omitted`
    : 'The property cannot be omitted';
  if (output === 'exception') {
    throw new ValidationError(errorMessage);
  }

  return [errorMessage];
}
