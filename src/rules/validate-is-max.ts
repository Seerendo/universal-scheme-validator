import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is less than or equal to a specified value.
 *
 * @param value The value to validate.
 * @param max The maximum allowed value.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsMax(5, 10);
 * console.log(errors);
 * // []
 *
 * const errors = validateIsMax(15, 10);
 * console.log(errors);
 * // ["The maximum value must not be greater than 10"]
 */
export function validateIsMax(
  value: any,
  max: number,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  if (typeof value === "number" && value > max) {
    const errorMessage = `The maximum value must not be greater than ${max}`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
