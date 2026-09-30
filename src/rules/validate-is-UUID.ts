import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if the value is a valid UUID.
 *
 * @param value The value to validate.
 * @param rules An object that can contain the property:
 *  - `version`: specifies the UUID version (1, 2, 3, 4, 5, 6, 7, or 8).
 *    You can also pass a boolean to assume version 4 by default.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateIsUUID("12345678-1234-5678-1234-567812345678");
 * console.log(errors);
 * // []
 *
 * const errors = validateIsUUID("12345678-1234-5678-1234-567812345678", {
 *   version: 4,
 * });
 * console.log(errors);
 * // []
 *
 * const errors = validateIsUUID("12345678-1234-8678-1234-567812345678", {
 *   version: 8,
 * });
 * console.log(errors);
 * // []
 */
export function validateIsUUID(
  value: any,
  rules: { version?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 } | boolean = {},
  output: OutputType = 'record'
): string[] {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return errors;
  }

  if (typeof value === 'string' && value.trim() === '') {
    const errorMessage = 'The UUID cannot be an empty string.';
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    }
    errors.push(errorMessage);
    return errors;
  }

  const version = typeof rules === 'boolean' ? 4 : rules.version;

  if (typeof value !== 'string') {
    errors.push('Must be a text string.');
  }

  if (value.length !== 36) {
    errors.push('The UUID must be exactly 36 characters long.');
  }

  if (version !== undefined && ![1, 2, 3, 4, 5, 6, 7, 8].includes(version)) {
    errors.push('The UUID version must be between 1 and 8.');
  }

  const versionPattern = version ? `[${version}]` : `[1-8]`;
  const uuidRegex = new RegExp(
    `^[0-9a-f]{8}-[0-9a-f]{4}-${versionPattern}[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`,
    'i'
  );

  if (!uuidRegex.test(value)) {
    errors.push(
      version
        ? `Must be a valid UUID of version ${version} with a correct variant.`
        : 'Must be a valid UUID with a version between 1 and 8 and a correct variant.'
    );
  }

  if (output === 'exception' && errors.length > 0) {
    throw new ValidationError(errors.join('\n'));
  }

  return errors;
}
