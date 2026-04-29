import { ValidationError } from "../errors";
import { OutputType, PrimitiveType } from "../types";

/**
 * Validates if the provided value is of the specified type.
 *
 * @param value The value to evaluate.
 * @param type The expected value type, can be "string", "number" or "boolean" {@link PrimitiveType}.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsType("Hello", "string");
 * console.log(errors);
 * // []
 *
 * const errors = validateIsType(123, "string");
 * console.log(errors);
 * // ["Must be a primitive text string, the specified type is: string"]
 */

export function validateIsType(
  value: any,
  type: PrimitiveType,
  output: OutputType = "record"
) {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  switch (type) {
    case "string":
      if (typeof value !== "string") {
        errors.push(
          `Must be a primitive text string, the specified type is: ${type}`
        );
      }
      break;
    case "number":
      if (isNaN(Number(value))) {
        errors.push(
          `Must be a primitive number, the specified type is: ${type}`
        );
      }
      break;
    case "boolean":
      if (typeof value !== "boolean") {
        if (isNaN(Number(value))) {
          if (
            !(
              typeof value === "string" &&
              (value === "true" || value === "false")
            )
          ) {
            errors.push(
              `Must be a primitive boolean value, the specified type is: ${type}`
            );
          }
        }
      }
      break;
    default:
      break;
  }

  if (output === "exception" && errors.length > 0) {
    throw new ValidationError(errors.join("\n"));
  }

  return errors;
}
