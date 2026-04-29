import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is a valid URL.
 *
 * @param value The value to evaluate.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsUrl("https://example.com");
 * console.log(errors);
 * // []
 *
 * const errors = validateIsUrl("invalid url");
 * console.log(errors);
 * // ["The URL does not have a valid structure"]
 */
export function validateIsUrl(
  value: any,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  // Verify that the value is a string
  if (typeof value !== "string") {
    const errorMessage = "Must be a text string";
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  // Define the maximum length limit for a URL
  const MAX_URL_LENGTH = 2048;

  // Verify if the URL exceeds the length limit
  if (value.length > MAX_URL_LENGTH) {
    errors.push("The URL is too long");
    return errors;
  }

  // Define the regular expressions
  const protocolPattern = /^(https?|ftp):\/\//i;
  const domainPattern = /([a-z0-9-]+\.)+[a-z]{2,}/i;
  const ipPattern =
    /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
  const portPattern = /:\d+/;
  const pathPattern = /(\/\S*)?/;
  const queryPattern = /(\?\S*)?/;
  const hashPattern = /(#\S*)?/;

  // Combined regular expression for full URL validation
  const fullUrlRegex = new RegExp(
    `^${protocolPattern.source}(${domainPattern.source}|${ipPattern.source})` +
      `(${portPattern.source})?${pathPattern.source}${queryPattern.source}${hashPattern.source}$`,
    "i"
  );

  // Validate if the URL has a valid protocol
  if (!protocolPattern.test(value)) {
    errors.push("The URL must start with http://, https://, or ftp://");
  }

  // Validate the full URL structure
  if (!fullUrlRegex.test(value)) {
    errors.push("The URL does not have a valid structure");
  }

  if (output === "exception" && errors.length > 0) {
    throw new ValidationError(errors.join("\n"));
  }

  return errors;
}
