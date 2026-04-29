import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is found in a white list of allowed values.
 *
 * @param value The value to validate.
 * @param list An array of allowed values.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateWhiteList("admin", ["admin", "user"]);
 * console.log(errors);
 * // []
 *
 * const errors = validateWhiteList("guest", ["admin", "user"]);
 * console.log(errors);
 * // ["The value must be in the white list: [admin,user]"]
 */
export function validateWhiteList(
  value: any,
  list: any[],
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  if (typeof value === "string" && list.length > 0) {
    const newList = list.map((item) => item.toLowerCase());
    const tokens = value.split(" ").map((item) => {
      return item.trim().toLowerCase();
    });

    if (!newList.find(tokens.includes.bind(tokens))) {
      const errorMessage = `The value must be in the white list: [${list}]`;
      if (output === "exception") {
        throw new ValidationError(errorMessage);
      } else {
        errors.push(errorMessage);
        return errors;
      }
    }
  }

  if (typeof value === "number" && list.length > 0) {
    list.forEach((item) => {
      if (typeof item !== "number") {
        const errorMessage = `The elements of the white list must be of type [number]`;
        if (output === "exception") {
          throw new ValidationError(errorMessage);
        } else {
          errors.push(errorMessage);
          return errors;
        }
      }
    });

    if (!list.find((item) => item === value)) {
      const errorMessage = `The value must be in the white list: [${list}]`;
      if (output === "exception") {
        throw new ValidationError(errorMessage);
      } else {
        errors.push(errorMessage);
        return errors;
      }
    }
  }

  return errors;
}
