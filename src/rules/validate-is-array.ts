import { ValidationError } from '../errors';
import { OutputType, PrimitiveType } from '../types';

/**
 * Validates if the value is an array and if its elements are of the specified type.
 *
 * @param value The value to evaluate.
 * @param rules An object with properties:
 *              - `type`: The value type allowed in the array, can be "string", "number", or "boolean".
 *              - `strict`: A boolean indicating if it should be strict with the value type, i.e., if the type must exactly match.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsArray([1, 2, 3], { type: "number" });
 * console.log(errors); // []
 *
 * const errors = validateIsArray([1, 2, "3"], { type: "number" });
 * console.log(errors); // ["The element at index [2] of the array must be of type number: [3] -> string"]
 */
export function validateIsArray(
  value: any[],
  rules: { type?: PrimitiveType; strict?: boolean } | boolean = false,
  output: OutputType = 'record'
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  if (!Array.isArray(value)) {
    const errorMessage = 'Must be an array';
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  if (typeof rules === 'object' && rules.type) {
    let index = 0;
    value.forEach((item) => {
      index++;
      if (rules.strict && typeof item !== rules.type) {
        const errorMessage = `The element at index [${index}] of the array must be of type ${
          rules.type
        }: [${item}] -> ${typeof item}`;
        if (output === 'exception') {
          throw new ValidationError(errorMessage);
        } else {
          errors.push(errorMessage);
        }
      } else {
        const type = typeof item;
        switch (rules.type) {
          case 'number':
            if (isNaN(Number(item))) {
              const errorMessage = `The element at index [${index}] of the array must be of type number: [${item}] -> ${type}`;
              if (output === 'exception') {
                throw new ValidationError(errorMessage);
              } else {
                errors.push(errorMessage);
              }
            }
            break;
          case 'string':
            if (typeof item !== 'string') {
              const errorMessage = `The element at index [${index}] of the array must be of type string: [${item}] -> ${type}`;
              if (output === 'exception') {
                throw new ValidationError(errorMessage);
              } else {
                errors.push(errorMessage);
              }
            }
            break;
          default:
            break;
        }
      }
    });
  }

  return errors;
}
