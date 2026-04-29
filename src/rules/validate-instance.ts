import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if the value is an instance of the class specified by the constructor.
 *
 * @param value The value to validate.
 * @param constructor The constructor of the class that the value is expected to be an instance of.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * class MyClass {}
 *
 * const instance = new MyClass();
 * const errors = validateInstance(instance, MyClass);
 * console.log(errors);
 * // []
 */
export function validateInstance(
  value: any,
  constructor: new (...args: any[]) => any,
  output: OutputType = 'record'
): string[] {
  const errors: string[] = [];

  if (!(value instanceof constructor)) {
    const errorMessage = `Must be an instance of ${constructor.name}`;
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  return errors;
}
