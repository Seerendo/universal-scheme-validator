import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if the value is NOT found in a blacklist of forbidden values.
 *
 * @param value The value or values to validate.
 * @param blackList An array of forbidden values.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const errors = validateBlackList(
 *  ['item3', 'item2'],
 *  ['item3', 'item4'],
 * );
 *
 * console.log(errors);
 * // ["The value 'item3' is not allowed"]
 */
export function validateBlackList(
  value: unknown[],
  blackList: unknown[],
  output: OutputType = 'record'
): string[] {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    return errors;
  }

  const blackListedValues = value.filter((item) =>
    blackList.some((blackListedItem) => blackListedItem === item)
  );

  for (const item of blackListedValues) {
    const errorMessage = `The value '${String(item)}' is not allowed`;
    if (output === 'exception') {
      throw new ValidationError(errorMessage);
    }
    errors.push(errorMessage);
  }

  return errors;
}
