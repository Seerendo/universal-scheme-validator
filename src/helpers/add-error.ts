import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Helper to add a validation error to the array or throw an exception,
 * depending on the configured output type.
 *
 * @param errors The array of errors where the message will be added.
 * @param message The error message.
 * @param output The validation output type, from {@link OutputType}.
 *
 * @example
 * const errors: string[] = [];
 * addError(errors, "Required field", "record");
 * // errors = ["Required field"]
 *
 * addError(errors, "Required field", "exception");
 * // Throws ValidationError
 */
export function addError(errors: string[], message: string, output: OutputType): void {
  if (output === 'exception') {
    throw new ValidationError(message);
  }
  errors.push(message);
}
