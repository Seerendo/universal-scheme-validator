import { ValidationError } from '../errors';
import { NumberSchema, OutputType } from '../types';

/**
 * Validates if the value is a number.
 *
 * @param value The value to validate.
 * @param rules Optionally, an object with properties:
 *              - `isZero`: boolean indicating if the value 0 is allowed.
 *              - `type`: `NumberSchema` object specifying the type of number
 *                        allowed {@link NumberSchema}.
 *                  - `integer`: Indicates that an integer value is allowed.
 *                  - `float`: Indicates that a floating-point value is allowed.
 *                  - `bigint`: Indicates that a bigint value is allowed.
 *
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an array with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsNumber(5, { isZero: false });
 * console.log(errors);
 * // ["Cannot be zero"]
 *
 * const errors = validateIsNumber(5.5, { type: "float" });
 * console.log(errors);
 * // []
 */
export function validateIsNumber(
  value: any,
  rules: { isZero?: boolean; type?: NumberSchema } | boolean,
  output: OutputType = 'record'
): string[] {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return errors;
  }

  if (typeof value !== 'number' && typeof value !== 'bigint') {
    const errorMessage = 'Must be a number';
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  if (typeof rules === 'object') {
    const { isZero: allowZero, type } = rules;

    if (!allowZero && value === 0) {
      errors.push(`Cannot be zero`);
    }

    if (type) {
      if (type === 'integer' && !Number.isInteger(value)) {
        errors.push(`Must be an integer`);
      }

      if (type === 'float' && Number.isInteger(value)) {
        errors.push(`Must be a float number`);
      }

      if (type === 'bigint' && typeof value !== 'bigint') {
        errors.push(`Must be a BigInt`);
      }
    }
  }

  if (output === 'exception' && errors.length > 0) {
    throw new ValidationError(errors.join('\n'));
  }

  return errors;
}
