import { ValidationError } from '../errors';
import { ValidationSchema } from '../interfaces';
import { OutputType } from '../types';
import { runSchemaValidation } from '../validators/run-schema-validation';

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
    output: 'exception',
  }
): Record<string, string[]> {
  if (value === undefined || value === null) {
    return {};
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return {};
    }
  } else {
    const schemaKeys = Object.keys(schema);
    const hasAnyDefinedField = schemaKeys.some((key) => {
      const fieldValue = (value as any)?.[key];
      return fieldValue !== undefined && fieldValue !== null;
    });

    if (!hasAnyDefinedField) {
      return {};
    }
  }
  try {
    const { strict = false, output = 'exception' } = options;

    runSchemaValidation(value, schema, {
      strict: strict,
    });
    return {};
  } catch (error) {
    const newError = error as ValidationError;
    return newError.errors as Record<string, string[]>;
  }
}
