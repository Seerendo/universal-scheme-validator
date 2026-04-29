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
} from "../rules";
import { ValidationRule } from "../interfaces/validation-rule";

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
export function validateProperty<T>(
  value: any,
  rules: ValidationRule<T>
): string[] {
  const propertyErrors: string[] = [];

  // Validation of maxLength
  if (rules.maxLength !== undefined) {
    propertyErrors.push(...validateMaxLength(value, rules.maxLength));
  }

  // Validation of minLength
  if (rules.minLength !== undefined) {
    propertyErrors.push(...validateMinLength(value, rules.minLength));
  }

  // Validation of isNumber
  if (rules.isNumber) {
    propertyErrors.push(...validateIsNumber(value, rules.isNumber));
  }

  // Validation of isString
  if (rules.isString) {
    propertyErrors.push(...validateIsString(value));
  }

  if (rules.isArray) {
    propertyErrors.push(...validateIsArray(value, rules.isArray));
  }

  // Validation of isType
  if (rules.isType) {
    propertyErrors.push(...validateIsType(value, rules.isType));
  }

  // Validation of isBoolean
  if (rules.isBoolean) {
    propertyErrors.push(...validateIsBoolean(value));
  }

  // Validation of isEmail
  if (rules.isEmail) {
    propertyErrors.push(...validateIsEmail(value));
  }

  // Validation of isNotAlpha
  if (rules.isNotAlpha) {
    propertyErrors.push(...validateIsNotAlpha(value, rules.isNotAlpha));
  }

  // Validation of isInstance
  if (rules.isInstance) {
    propertyErrors.push(...validateInstance(value, rules.isInstance));
  }

  // Validation of isUUID
  if (rules.isUUID) {
    propertyErrors.push(...validateIsUUID(value, rules.isUUID));
  }

  // Validation of containsValue
  if (rules.containsValue) {
    propertyErrors.push(...validateContainsValue(value, rules.containsValue));
  }

  // Validation of isDate
  if (rules.isDate) {
    propertyErrors.push(...validateIsDate(value, rules.isDate));
  }

  // Validation of isRequired
  if (rules.isRequired) {
    propertyErrors.push(...validateIsRequired(value));
  }

  // Validation of isNotEmpty
  if (rules.isNotEmpty) {
    propertyErrors.push(...validateIsNotEmpty(value));
  }

  // Validation of isUrl
  if (rules.isUrl) {
    propertyErrors.push(...validateIsUrl(value));
  }

  // Validation of isPath
  if (rules.isPath) {
    propertyErrors.push(...validateIsPath(value, rules.isPath));
  }

  // Validation of isJSON
  if (rules.isJSON) {
    propertyErrors.push(...validateIsJSON(value, rules.isJSON));
  }

  // Validation of isMin
  if (rules.isMin !== undefined) {
    propertyErrors.push(...validateIsMin(value, rules.isMin));
  }

  // Validation of isMax
  if (rules.isMax !== undefined) {
    propertyErrors.push(...validateIsMax(value, rules.isMax));
  }

  // Validation of isEqualTo
  if (rules.isEqualTo !== undefined) {
    propertyErrors.push(...validateIsEqualTo(value, rules.isEqualTo));
  }

  // Validation of isObject
  if (rules.isObject) {
    propertyErrors.push(...validateIsObject(value, rules.isObject));
  }

  return propertyErrors;
}
