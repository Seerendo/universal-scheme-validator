import { ValidationError } from "../errors";
import { OutputType, PathValidationOptions } from "../types";

/**
 * Validates if the value is a valid path, either a direct route (like `/module/function`)
 * or a path extracted from a full URL. Allows validating additional conditions such as:
 * not having spaces, not ending with a slash, not being empty, and not having query strings.
 *
 * @param value The path or URL to evaluate.
 * @param options Additional validation options, of type {@link PathValidationOptions}.
 *  - `noSpaces`: The path must not contain spaces.
 *  - `noTrailingSlash`: The path must not end with a slash `/`.
 *  - `notEmpty`: The path must not be empty or just `/`.
 *  - `noQuery`: The path must not have query parameters (only if the value is a URL or includes `?`).
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors (empty if valid).
 *
 * @example
 * const errors = validateIsPath("/module/function", {
 *   noSpaces: true,
 *   noTrailingSlash: true,
 *   notEmpty: true,
 * });
 * console.log(errors);
 * // []
 *
 * @example
 * const errors = validateIsPath("https://app.gob.ec/module/function?query=123", {
 *   noQuery: true
 * });
 * console.log(errors);
 * // ["Query parameters are not allowed in the URL path"]
 *
 * @example
 * validateIsPath("/module final/", {
 *   noSpaces: true,
 *   noTrailingSlash: true
 * }, "exception");
 * // Throws ValidationError with message: "The path must not contain spaces\nThe path must not end with '/'"
 */
export function validateIsPath(
  value: any,
  options: PathValidationOptions = {},
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || typeof value !== "string") {
    const msg = "The path must be a string";
    if (output === "exception") throw new ValidationError(msg);
    return [msg];
  }

  let path = value;
  let query = "";

  try {
    // If a full URL is passed, we extract only the pathname and query
    if (/^https?:\/\//.test(value)) {
      const parsed = new URL(value);
      path = parsed.pathname;
      query = parsed.search;
    } else {
      const [maybePath, maybeQuery] = value.split("?");
      path = maybePath || "";
      query = maybeQuery ? `?${maybeQuery}` : "";
    }
  } catch {
    errors.push("Failed to parse the path");
    if (output === "exception") throw new ValidationError(errors.join("\n"));
    return errors;
  }

  // Specific validations
  if (options.noSpaces && path.includes(" ")) {
    errors.push("The path must not contain spaces");
  }

  if (options.noTrailingSlash && path.endsWith("/") && path !== "/") {
    errors.push("The path must not end with '/'");
  }

  if (options.notEmpty && (path === "" || path === "/")) {
    errors.push("The path must not be empty");
  }

  if (options.noQuery && query !== "") {
    errors.push("Query parameters are not allowed in the URL path");
  }

  if (output === "exception" && errors.length > 0) {
    throw new ValidationError(errors.join("\n"));
  }

  return errors;
}
