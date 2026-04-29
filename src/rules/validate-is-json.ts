import { ValidationError } from "../errors";
import { OutputType, ExpectedStructure } from "../types";
import { validateExpectedStructure } from "./validate-expected-structure";

/**
 * Validates if the provided value is a valid JSON.
 *
 * @param value The value to evaluate.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 * @param expectedStructure An object defining the expected keys and their types {@link ExpectedStructure}.
 *
 * @returns An array of strings representing the validation errors,
 *          if the value is not a text string or if it's not a valid JSON.
 *
 * @example
 * const errors = validateIsJSON('{"key": "value"}');
 * console.log(errors); // []
 *
 * const errors = validateIsJSON('invalid json');
 * console.log(errors); // ["Must be a valid JSON"]
 */
export function validateIsJSON(
  value: any,
  structure?: { expectedStructure?: ExpectedStructure } | boolean,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  // Verifies if the value is a string
  if (typeof value !== "string") {
    const errorMessage = `Must be a text string`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  // Verifies if the value is a valid JSON
  let parsed: any;
  try {
    parsed = JSON.parse(value);
  } catch (e) {
    const errorMessage = `Must be a valid JSON`;
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  // Verifies if the value is an object
  if (structure && typeof structure === "object") {
    if (structure && typeof structure === "object") {
      if (structure.expectedStructure) {
        validateExpectedStructure(parsed, structure.expectedStructure, errors);
      }
    }
  }

  if (errors.length > 0 && output === "exception") {
    throw new ValidationError(errors.join(", "));
  }

  return errors;
}
