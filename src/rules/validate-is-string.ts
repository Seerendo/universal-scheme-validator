import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is a text string.
 *
 * @param value The value to evaluate.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsString(123);
 * console.log(errors); // ["Must be a text string"]
 *
 * const errors = validateIsString("Hello World");
 * console.log(errors); // []
 */
export function validateIsString(
  value: any,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return errors;
  }

  if (typeof value !== "string") {
    const errorMessage = `Must be a text string`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
