import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is greater than or equal to a specific value.
 *
 * @param value The value to validate.
 * @param min The minimum allowed value.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsMin(5, 10);
 * console.log(errors);
 * // ["The minimum value must be greater than or equal to 10"]
 */
export function validateIsMin(
  value: any,
  min: number,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  if (typeof value === "number" && value < min) {
    const errorMessage = `The minimum value must be greater than or equal to ${min}`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
