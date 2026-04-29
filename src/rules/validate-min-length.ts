import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is a string and has a minimum number of characters.
 *
 * @param value The value to validate.
 * @param minLength The minimum allowed number of characters.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateMinLength("abc", 5);
 * console.log(errors);
 * // ["Must have a minimum of 5 characters"]
 *
 * const errors = validateMinLength(["a", "b"], 3);
 * console.log(errors);
 * // ["Must have a minimum of 3 elements"]
 */
export function validateMinLength(
  value: any,
  minLength: number,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return errors;
  }

  if (typeof value === "string" && value.trim().length < minLength) {
    const errorMessage = `Must have a minimum of ${minLength} characters`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  if (Array.isArray(value) && value.length < minLength) {
    const errorMessage = `Must have a minimum of ${minLength} elements`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
