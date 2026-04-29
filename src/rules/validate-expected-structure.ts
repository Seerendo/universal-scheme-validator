import { validateProperty } from '../functions/validate-property';
import { ValidationRule } from '../interfaces';
import { ExpectedStructure } from '../types';

export const VALIDATION_RULE_KEYS = [
  'minLength',
  'maxLength',
  'isNumber',
  'isMax',
  'isMin',
  'isEqualTo',
  'isString',
  'isArray',
  'isType',
  'isBoolean',
  'isEmail',
  'isNotAlpha',
  'isNotEmpty',
  'isDate',
  'isUUID',
  'isUrl',
  'isRequired',
  'isJSON',
  'containsValue',
  'isObject',
  'isInstance',
  'nestedSchema',
] as const;

function isValidationRule(obj: any): obj is ValidationRule {
  return typeof obj === 'object' && obj !== null && VALIDATION_RULE_KEYS.some((key) => key in obj);
}

/**
 * Validates that the `value` object has the expected keys and value types in `expected`.
 * If an error is found, the error messages are appended to the `errors` array.
 *
 * @param {object} value The object to validate.
 * @param {ExpectedStructure} expected The object that defines the expected keys and their types.
 * @param {string[]} errors The array where error messages are added.
 * @param {string} [path=""] The current path within the object, used to build the error message.
 */
export function validateExpectedStructure(
  value: any,
  expected: ExpectedStructure,
  errors: string[],
  path: string = ''
) {
  for (const [key, ruleOrNested] of Object.entries(expected)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in value)) {
      errors.push(`Required key missing: ${currentPath}`);
      continue;
    }

    const val = value[key];

    if (isValidationRule(ruleOrNested)) {
      const propertyErrors = validateProperty(val, ruleOrNested);
      propertyErrors.forEach((err) => errors.push(`${currentPath}: ${err}`));
    } else if (typeof ruleOrNested === 'object') {
      validateExpectedStructure(val, ruleOrNested as ExpectedStructure, errors, currentPath);
    }
  }
}
