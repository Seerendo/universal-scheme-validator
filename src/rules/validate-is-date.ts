import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is a valid date.
 * If a `rules` object with the `formatDate` property is provided,
 * it verifies that the date complies with the specified format.
 *
 * @param value The value to validate.
 * @param rules Optionally, an object with the `formatDate` property
 *              that specifies the date format.
 *              Supported formats: "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "DD-MM-YYYY".
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const date = new Date();
 * const errors = validateIsDate(date, { formatDate: "YYYY-MM-DD" });
 * console.log(errors);
 * // []
 *
 * const errors = validateIsDate("2020-01-01", { formatDate: "DD-MM-YYYY" });
 * console.log(errors);
 * // ["The date format is not valid (DD-MM-YYYY)"]
 */
export function validateIsDate(
  value: any,
  rules: { formatDate?: string } | boolean = false,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  // If no rules are passed, an empty array is returned
  if (rules === false) {
    if (output === "record") {
      return errors;
    }
  }

  const isDateInstance = value instanceof Date;
  const isDateString = typeof value === "string" && !isNaN(Date.parse(value));

  // Verify that the value is a valid date
  if (!isDateInstance && !isDateString) {
    errors.push(`Must be a valid date`);
  }

  // If there's a date format, we validate it
  if (typeof rules === "object" && rules.formatDate) {
    const date = isDateInstance ? value : new Date(value);
    const formattedDate = formatDate(date, rules.formatDate);

    if (!formattedDate) {
      errors.push(`The date format is not valid (${rules.formatDate})`);
    }
  }

  // Depending on the output type, we handle the response
  if (errors.length > 0) {
    if (output === "exception") {
      throw new ValidationError(errors.join("\n")); // Throws an exception if output is "exception"
    }
  }

  return errors;
}

function formatDate(date: Date, format: string): string | null {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    switch (format) {
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      default:
        return null;
    }
  } catch (error) {
    return null;
  }
}
