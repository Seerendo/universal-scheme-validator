import { ValidationError } from '../errors';
import { OutputType } from '../types';

/**
 * Validates if the value is a string that does not contain alphanumeric characters,
 * accents, or punctuation marks, according to the provided rules.
 *
 * @param value The value to validate.
 * @param rules An object that can contain the properties:
 *  - `allowNumbers`: boolean indicating if numbers are allowed.
 *  - `allowAccents`: boolean indicating if accents are allowed.
 *  - `allowPunctuation`: boolean indicating if punctuation marks are allowed.
 *  Or a boolean indicating if none are allowed.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 *
 * If the value is not a string, an error is returned.
 * If the value does not comply with the specified rules, an error is returned
 * describing the restricted patterns that have not been met.
 */
export function validateIsNotAlpha(
  value: any,
  rules:
    | {
        allowNumbers?: boolean;
        allowAccents?: boolean;
        allowPunctuation?: boolean;
      }
    | boolean = false,
  output: OutputType = 'record'
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  if (typeof value !== 'string') {
    errors.push(`Must be a text string`);
    return errors;
  }

  const allowNumbers = typeof rules === 'boolean' ? false : rules.allowNumbers || false;
  const allowAccents = typeof rules === 'boolean' ? false : rules.allowAccents || false;
  const allowPunctuation = typeof rules === 'boolean' ? false : rules.allowPunctuation || false;

  let regexPattern = 'A-Za-z'; // Only basic letters

  if (allowAccents) {
    regexPattern += 'áéíóúÁÉÍÓÚñÑüÜ'; // Add accents and special spanish characters
  }
  if (allowNumbers) {
    regexPattern += '0-9'; // Add numbers
  }
  if (allowPunctuation) {
    regexPattern += `.,;:!?()\\[\\]{}'"-`; // Add punctuation marks
  }

  // Always include spaces
  regexPattern += '\\s';

  // Create the dynamic regular expression
  const regex = new RegExp(`^[${regexPattern}]+$`);

  if (!regex.test(value)) {
    let errorMessage = 'Must contain only letters, no alphanumeric values or punctuation marks';
    if (allowNumbers && allowAccents && allowPunctuation) {
      errorMessage = 'Must contain only letters, numbers, accents, punctuation marks, and spaces';
    } else if (allowNumbers && allowAccents) {
      errorMessage =
        'Must contain only letters, numbers, accents, and spaces, no punctuation marks';
    } else if (allowNumbers && allowPunctuation) {
      errorMessage =
        'Must contain only letters, numbers, punctuation marks, and spaces, no accents';
    } else if (allowAccents && allowPunctuation) {
      errorMessage =
        'Must contain only letters, accents, punctuation marks, and spaces, no numbers';
    } else if (allowNumbers) {
      errorMessage =
        'Must contain only letters, numbers, and spaces, no accents or punctuation marks';
    } else if (allowAccents) {
      errorMessage =
        'Must contain only letters, accents, and spaces, no numbers or punctuation marks';
    } else if (allowPunctuation) {
      errorMessage =
        'Must contain only letters, punctuation marks, and spaces, no numbers or accents';
    }
    errors.push(errorMessage);
  }

  if (output === 'exception' && errors.length > 0) {
    throw new ValidationError(errors.join('\n'));
  }

  return errors;
}
