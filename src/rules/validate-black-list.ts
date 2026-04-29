import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is NOT found in a blacklist of forbidden values.
 *
 * @param value The value to validate.
 * @param blackList An array of forbidden values.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateBlackList("admin", ["admin", "root", "superuser"]);
 * console.log(errors);
 * // ["The value 'admin' is not allowed"]
 *
 * const errors = validateBlackList("user", ["admin", "root"]);
 * console.log(errors);
 * // []
 *
 * const errors = validateBlackList("badword", ["badword", "offensive"], "exception");
 * // Throws ValidationError: "The value 'badword' is not allowed"
 */
export function validateBlackList(
  value: any,
  blackList: any[],
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return errors;
  }

  // If the value is a string, compare in lowercase for case-insensitive
  const isBlackListed = blackList.some((item) => {
    if (typeof value === "string" && typeof item === "string") {
      return value.toLowerCase() === item.toLowerCase();
    }
    return value === item;
  });

  if (isBlackListed) {
    const errorMessage = `The value '${value}' is not allowed`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
