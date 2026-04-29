import { ExpectedStructure, NumberSchema, PathValidationOptions, PrimitiveType } from '../types';

/**
 * Interface that defines the validation rules for a specific field.
 * @template T Type of the value to validate.
 *
 * @example
 * // Define a validation schema for a user
 * const userSchema: ValidationSchema = {
 *   userName: { minLength: 3, maxLength: 20, isNotEmpty: true },
 *   email: { isEmail: true },
 *   age: { isNumber: { isZero: false } },
 *   website: { isUrl: true },
 *   profile: {
 *     isInstance: Profile,
 *     nestedSchema: {
 *       bio: { maxLength: 150 },
 *     },
 *   },
 * };
 */
export interface ValidationRule<T = any> {
  /**
   * Minimum allowed length for a text string.
   * @example
   * { minLength: 5 }
   */
  minLength?: number;

  /**
   * Maximum allowed length for a text string.
   * @example
   * { maxLength: 20 }
   */
  maxLength?: number;

  /**
   * Defines if the value must be a number.
   * Can be a boolean or an object with advanced options.
   * @example
   * { isNumber: true }
   * { isNumber: { isZero: false } }
   */
  isNumber?:
    | {
        /**
         * Indicates if the number can be zero.
         * @example
         * { isZero: false }
         */
        isZero?: boolean;
        /**
         * Specifies the type of numeric schema.
         */
        type?: NumberSchema;
      }
    | boolean;

  /**
   * Maximum value for a number.
   * @example
   * { isMax: 10 }
   */
  isMax?: number;

  /**
   * Minimum value for a number.
   * @example
   * { isMin: 1 }
   */
  isMin?: number;

  /**
   * Defines if the value must be equal to the input property.
   * @example
   * { isEqualTo: 5 }
   * { isEqualTo: "Hello World" }
   */
  isEqualTo?: any;

  /**
   * Defines if the value must be a text string.
   * @example
   * { isString: true }
   */
  isString?: boolean;

  /**
   * Defines if the value must be an array.
   * @example
   * { isArray: true }
   * { isArray: { type: "number" } }
   * { isArray: { type: "string", strict: true } }
   */
  isArray?:
    | {
        /**
         * Defines the type of elements the array must contain.
         * @example
         * { isArray: { type: "number" } }
         * { isArray: { type: "string" } }
         * { isArray: { type: "boolean" } }
         */
        type: PrimitiveType;
        /**
         * Defines if the array must be strict in its element types.
         * @example
         * { isArray: { type: "number", strict: true } }
         */
        strict?: boolean;
      }
    | boolean;

  /**
   * Defines if the value must be of a specific type.
   * @example
   * { isType: "string" }
   * { isType: "number" }
   * { isType: "boolean" }
   */
  isType?: PrimitiveType;

  /**
   * Defines if the value must be a boolean value.
   * @example
   * { isBoolean: true }
   */
  isBoolean?: boolean;

  /**
   * Defines if the value must be a valid email.
   * @example
   * { isEmail: true }
   */
  isEmail?: boolean;

  /**
   * Defines if the value must not contain alphanumeric characters.
   * Can be a boolean or an object with advanced options.
   * @example
   * { isNotAlpha: true }
   * { isNotAlpha: { allowNumbers: true } }
   * { isNotAlpha: { allowPunctuation: true } }
   */
  isNotAlpha?:
    | {
        /**
         * Allows numbers in the value.
         * @example
         * { allowNumbers: true }
         */
        allowNumbers?: boolean;
        /**
         * Allows accented characters.
         * @example
         * { allowAccents: true }
         */
        allowAccents?: boolean;
        /**
         * Allows punctuation marks in the value.
         * @example
         * { allowPunctuation: true }
         */
        allowPunctuation?: boolean;
      }
    | boolean;

  /**
   * Indicates that the value must not be empty.
   * @example
   * { isNotEmpty: true }
   */
  isNotEmpty?: boolean;

  /**
   * Indicates if the value must be a date.
   * Can be a boolean or an object with a specific date format.
   * @example
   * { isDate: true }
   * { isDate: { formatDate: "YYYY-MM-DD" } }
   */
  isDate?:
    | {
        /**
         * Expected date format.
         * @example
         * { formatDate: "DD/MM/YYYY" }
         */
        formatDate: string;
      }
    | boolean;

  /**
   * Indicates if the value must be a valid UUID.
   * You can choose the UUID version and provider for validation.
   * @example
   * { isUUID: true }
   * { isUUID: { version: 5 } }
   * { isUUID: { provider: "oracle" } }
   * { isUUID: { version: 4, provider: "standard" } }
   * @default
   * { isUUID: { version: 4, provider: "standard" } }
   */
  isUUID?:
    | {
        /**
         * Specify a specific version (only valid for standard RFC 4122 UUIDs).
         * @example
         * { version: 5 }
         */
        version?: number;
        /**
         * Determines if the UUID follows the RFC 4122 standard or Oracle format.
         * - `"standard"`: Uses versions 1-5 according to RFC 4122.
         * - `"oracle"`: Allows UUIDs generated by Oracle without version restriction.
         * @example
         * { provider: "oracle" }
         * @default "standard"
         */
        provider?: 'standard' | 'oracle';
      }
    | boolean;

  /**
   * Indicates if the value must be a valid URL.
   * @example
   * { isUrl: true }
   */
  isUrl?: boolean;

  /**
   * Indicates if the value must be a valid path, either a direct route (e.g., "/module/feature")
   * or a path extracted from a URL. Allows applying custom validations over the path structure.
   *
   * @example
   * { isPath: true }
   * { isPath: { noSpaces: true, noTrailingSlash: true, notEmpty: true } }
   */
  isPath?: PathValidationOptions;

  /**
   * Indicates if the value is required
   * @example
   * { isRequired: true }
   */
  isRequired?: boolean;

  /**
   * Indicates if the value must be a valid JSON
   * @example
   * { isJSON: true }
   */
  isJSON?:
    | {
        /**
         * Expected structure of the JSON.
         * @example
         * { expectedStructure: { key: "string" } }
         */
        expectedStructure?: ExpectedStructure;
      }
    | boolean;

  /**
   * Indicates if the value must contain any of the specified elements.
   * @example
   * { containsValue: ["admin", "user"] }
   */
  containsValue?: any[];

  /**
   * Defines if the value must be an object.
   * Can be a boolean or an object with advanced options.
   * @example
   * { isObject: true }
   * { isObject: { allowEmpty: false } }
   * { isObject: { allowArrays: true } }
   */
  isObject?:
    | {
        /**
         * Allows the object to be empty.
         * @example
         * { allowEmpty: true }
         */
        allowEmpty?: boolean;
        /**
         * Allows input of an array of objects.
         * @example
         * { allowArrays: true }
         */
        allowArrays?: boolean;
      }
    | boolean;

  /**
   * Defines if the value must be an instance of a specific class.
   * @example
   * { isInstance: Person }
   */
  isInstance?: new (...args: any[]) => T;

  /**
   * Nested validation schema to validate more complex data structures.
   * If T is an array (e.g., Product[]), the schema applies to each element (Product).
   * If T is an object (e.g., User), the schema applies to its properties.
   */
  nestedSchema?: T extends (infer U)[]
    ? ValidationSchema<U> // If it's an array, schema of elements
    : ValidationSchema<T>; // If not, schema of the type itself
}

/**
 * Defines a validation schema for a generic object.
 * Each property of the object can have its own validation rules.
 *
 * @template T Type of the object to be validated.
 *
 * @example
 * // Define a validation schema for a user
 * const userSchema: ValidationSchema<User> = {
 *   name: { minLength: 3, isNotEmpty: true },
 *   email: { isEmail: true },
 *   age: { isNumber: { isZero: false } },
 *   address: {
 *     nestedSchema: {
 *       street: { isNotEmpty: true },
 *       zipCode: { isNumber: true }
 *     }
 *   }
 * };
 */
export type ValidationSchema<T = any> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};
