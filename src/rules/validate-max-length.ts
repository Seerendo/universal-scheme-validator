import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value of a string does not exceed a specified maximum length.
 *
 * @param value The value to validate.
 * @param maxLength The maximum allowed length.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *          If the value exceeds the maximum length, returns an error message.
 *
 * @example
 * const errors = validateMaxLength("Hello World", 5);
 * console.log(errors);
 * // ["Cannot exceed 5 characters"]
 *
 * const errors = validateMaxLength(["a", "b", "c", "d"], 3);
 * console.log(errors);
 * // ["Cannot exceed 3 elements"]
 */
export function validateMaxLength(
  value: any,
  maxLength: number,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return errors;
  }

  if (typeof value === "string" && value.trim().length > maxLength) {
    const errorMessage = `Cannot exceed ${maxLength} characters`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  if (Array.isArray(value) && value.length > maxLength) {
    const errorMessage = `Cannot exceed ${maxLength} elements`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
