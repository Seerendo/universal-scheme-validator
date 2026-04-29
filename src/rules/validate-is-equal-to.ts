import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is equal to another value.
 *
 * @param value The value to validate.
 * @param to The value to compare to.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsEqualTo(5, 10);
 * console.log(errors);
 * // ["The value must be equal to 10"]
 */
export function validateIsEqualTo(
  value: any,
  to: any,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  if (to && value !== to) {
    const errorMessage = `The value must be equal to ${to}`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  return errors;
}
