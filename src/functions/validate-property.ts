import {
  validateMaxLength,
  validateIsEmail,
  validateInstance,
  validateIsNumber,
  validateIsNotAlpha,
  validateIsUUID,
  validateContainsValue,
  validateIsDate,
  validateMinLength,
  validateIsRequired,
  validateIsBoolean,
  validateIsString,
  validateIsNotEmpty,
  validateIsUrl,
  validateIsJSON,
  validateIsMin,
  validateIsMax,
  validateIsEqualTo,
  validateIsObject,
  validateIsType,
  validateIsArray,
  validateIsPath,
  validateBlackList,
} from '../rules';
import { ValidationRule } from '../interfaces/validation-rule';
import { applyRuleMessage, getRuleValue } from '../helpers';

/**
 * Validates a property of an object according to the specified validation rules.
 *
 * @param value The value of the property to validate.
 * @param rules The validation rule for the property.
 *
 * @returns An array of strings representing the validation errors.
 *
 * @example
 * const userSchema: ValidationSchema = {
 *   name: {
 *     isString: true,
 *     maxLength: 10,
 *     minLength: 3,
 *     isRequired: true,
 *   },
 *   email: {
 *     isEmail: true,
 *     isRequired: true,
 *   },
 *   age: {
 *     isNumber: true,
 *     isRequired: true,
 *   },
 *   website: {
 *     isUrl: true,
 *   },
 *   profile: {
 *     isObject: true,
 *     nestedSchema: {
 *       bio: {
 *         maxLength: 150,
 *       },
 *     },
 *   },
 * };
 *
 * const user: User = {
 *   name: "Pedro",
 *   email: "pedro@example.com",
 *   age: 0,
 *   website: "https://example.com",
 *   profile: {
 *     bio: "I am a programmer with more than 10 years of experience in web development.",
 *   },
 * };
 *
 * const errors = validateProperty(user, userSchema);
 * console.log(errors);
 * // ["The value of the property 'age' must be a number", "The value of the property 'website' must be a URL"]
 */
export function validateProperty<T>(value: any, rules: ValidationRule<T>): string[] {
  const propertyErrors: string[] = [];

  const runRule = (rule: unknown, validate: () => string[]) => {
    propertyErrors.push(...applyRuleMessage(validate(), rule));
  };

  // Validation of blackList
  if (rules.blackList !== undefined) {
    runRule(rules.blackList, () => validateBlackList(value, getRuleValue(rules.blackList)!));
  }

  // Validation of maxLength
  if (rules.maxLength !== undefined) {
    runRule(rules.maxLength, () => validateMaxLength(value, getRuleValue(rules.maxLength)!));
  }

  // Validation of minLength
  if (rules.minLength !== undefined) {
    runRule(rules.minLength, () => validateMinLength(value, getRuleValue(rules.minLength)!));
  }

  // Validation of isNumber
  if (rules.isNumber) {
    runRule(rules.isNumber, () => validateIsNumber(value, getRuleValue(rules.isNumber) as any));
  }

  // Validation of isString
  if (rules.isString) {
    runRule(rules.isString, () => validateIsString(value));
  }

  if (rules.isArray) {
    runRule(rules.isArray, () => validateIsArray(value, getRuleValue(rules.isArray) as any));
  }

  // Validation of isType
  if (rules.isType) {
    runRule(rules.isType, () => validateIsType(value, getRuleValue(rules.isType) as any));
  }

  // Validation of isBoolean
  if (rules.isBoolean) {
    runRule(rules.isBoolean, () => validateIsBoolean(value));
  }

  // Validation of isEmail
  if (rules.isEmail) {
    runRule(rules.isEmail, () => validateIsEmail(value));
  }

  // Validation of isNotAlpha
  if (rules.isNotAlpha) {
    runRule(rules.isNotAlpha, () =>
      validateIsNotAlpha(value, getRuleValue(rules.isNotAlpha) as any)
    );
  }

  // Validation of isInstance
  if (rules.isInstance) {
    runRule(rules.isInstance, () =>
      validateInstance(value, getRuleValue(rules.isInstance) as new (...args: any[]) => T)
    );
  }

  // Validation of isUUID
  if (rules.isUUID) {
    runRule(rules.isUUID, () => validateIsUUID(value, getRuleValue(rules.isUUID) as any));
  }

  // Validation of containsValue
  if (rules.containsValue) {
    runRule(rules.containsValue, () =>
      validateContainsValue(value, getRuleValue(rules.containsValue)!)
    );
  }

  // Validation of isDate
  if (rules.isDate) {
    runRule(rules.isDate, () => validateIsDate(value, getRuleValue(rules.isDate) as any));
  }

  // Validation of isRequired
  if (rules.isRequired) {
    runRule(rules.isRequired, () => validateIsRequired(value));
  }

  // Validation of isNotEmpty
  if (rules.isNotEmpty) {
    runRule(rules.isNotEmpty, () => validateIsNotEmpty(value));
  }

  // Validation of isUrl
  if (rules.isUrl) {
    runRule(rules.isUrl, () => validateIsUrl(value));
  }

  // Validation of isPath
  if (rules.isPath) {
    runRule(rules.isPath, () => validateIsPath(value, rules.isPath!));
  }

  // Validation of isJSON
  if (rules.isJSON) {
    runRule(rules.isJSON, () => validateIsJSON(value, getRuleValue(rules.isJSON) as any));
  }

  // Validation of isMin
  if (rules.isMin !== undefined) {
    runRule(rules.isMin, () => validateIsMin(value, getRuleValue(rules.isMin)!));
  }

  // Validation of isMax
  if (rules.isMax !== undefined) {
    runRule(rules.isMax, () => validateIsMax(value, getRuleValue(rules.isMax)!));
  }

  // Validation of isEqualTo
  if (rules.isEqualTo !== undefined) {
    runRule(rules.isEqualTo, () => validateIsEqualTo(value, getRuleValue(rules.isEqualTo)));
  }

  // Validation of isObject
  if (rules.isObject) {
    runRule(rules.isObject, () => validateIsObject(value, getRuleValue(rules.isObject) as any));
  }

  return propertyErrors;
}
