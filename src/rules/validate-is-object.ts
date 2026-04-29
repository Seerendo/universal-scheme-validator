import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if the provided value is an object.
 * Throws an error if the value is not an object, or if it is empty and not allowed,
 * or if it is an array and not allowed.
 *
 * @param value The value to evaluate.
 * @param rules An object that can contain the properties:
 *  - `allowEmpty`: boolean indicating if the object is allowed to be empty.
 *  - `allowArrays`: boolean indicating if the value is allowed to be an array.
 * Or a boolean indicating if they are allowed or not.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsObject({});
 * console.log(errors); // ["The object cannot be empty"]
 *
 * const errors = validateIsObject([], { allowArrays: true });
 * console.log(errors); // []
 */
export function validateIsObject(
  value: any,
  rules: { allowEmpty?: boolean; allowArrays?: boolean } | boolean = false,
  output: OutputType = 'record'
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  // If it's not an object, add error
  if (typeof value !== 'object' || value === null) {
    const errorMessage = 'Must be an object';
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  const allowEmpty = typeof rules === 'boolean' ? false : rules.allowEmpty || false;
  const allowArrays = typeof rules === 'boolean' ? false : rules.allowArrays || false;

  // Verify if the value is an array and if it's allowed
  if (Array.isArray(value) && !allowArrays) {
    errors.push('Arrays are not allowed, only objects');
    return errors;
  }

  // Verify if the object is empty and if it's allowed
  if (!allowEmpty) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (Object.keys(item).length === 0) {
          errors.push(`The element [${index}] cannot be empty`);
        }
      });
    }
  }

  if (output === 'exception' && errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }

  return errors;
}
