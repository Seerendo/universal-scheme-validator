import { ValidationError } from "../errors";
import { ValidationSchema } from "../interfaces";
import { OutputType } from "../types";
import { runSchemaValidation } from "../validators/run-schema-validation";

/**
 * Validates an object against a validation schema.
 *
 * @param value The object to validate.
 * @param schema The validation schema.
 *
 * @returns An object with the validation errors.
 *
 * @example
 * const userSchema: ValidationSchema = {
 *   name: { maxLength: 10 },
 *   email: { isEmail: true },
 *   age: { isNumber: true },
 *   profile: {
 *     isInstance: Profile,
 *     nestedSchema: {
 *       bio: { maxLength: 150 },
 *     },
 *   },
 * };
 *
 * const user = {
 *   name: "Roddy",
 *   email: "roddy.andrade@msp.gob.ec",
 *   age: 26,
 *   profile: {
 *     bio: "I am a programmer with more than 2 years of experience in backend development.",
 *   },
 * };
 *
 * const errors = validateNestedSchema(user, userSchema);
 * console.log(errors);
 * // {}
 */
export function validateNestedSchema(
  value: any,
  schema: ValidationSchema,
  options: { strict?: boolean; output?: OutputType } = {
    strict: false,
    output: "exception",
  },
): Record<string, string[]> {
  /**
   * If the value was not provided (optional field not present),
   * we shouldn't validate the nested schema.
   */
  if (value === undefined || value === null) {
    return {};
  }

  /**
   * If the instance exists but doesn't contain any defined properties
   * from those appearing in the schema (e.g. `new Product()` with uninitialized
   * `declare` fields), we consider it didn't really "come"
   * and we do not validate its required fields.
   */
  try {
    const schemaKeys = Object.keys(schema);
    const hasAnyDefinedField = schemaKeys.some((k) => {
      const v = (value as any)?.[k];
      return v !== undefined && v !== null;
    });

    if (!hasAnyDefinedField) {
      return {};
    }
  } catch (err) {
    /**
     * If something strange happens while inspecting (e.g. value is not indexable),
     * we continue with normal validation so as not to hide errors.
     */
  }
  try {
    const { strict = false, output = "exception" } = options;

    runSchemaValidation(value, schema, {
      strict: strict,
    });
    return {};
  } catch (error) {
    const newError = error as ValidationError;
    return newError.errors as Record<string, string[]>;
  }
}
