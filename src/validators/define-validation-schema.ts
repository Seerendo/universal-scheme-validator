import { InferValidationSchema, InferredSchemaDefinition, ValidationSchema } from '../interfaces';
import { OutputType } from '../types';
import { runSchemaValidation } from './run-schema-validation';

export interface ValidationOptions {
  strict?: boolean;
  output?: OutputType;
  strictMessage?: string;
}

export type DefinedValidationSchema<
  T,
  Schema extends Record<string, unknown> = ValidationSchema<T>,
> = Schema & {
  /**
   * Validates an instance against the schema and throws an exception if validation fails.
   *
   * @param instance The instance to validate.
   * @example
   * const user = new User();
   * user.name = 'Alice';
   * user.age = 30;
   *
   * userSchema.validate(user);
   * @throws {ValidationError} If validation fails.
   */
  validate(instance: T | T[]): void;
  /**
   * Validates an instance against the schema and returns a record of validation errors if validation fails.
   * @param instance The instance to validate.
   * @returns A record of validation errors, or `undefined` if validation passes.
   */
  safeValidate(instance: T | T[]): Record<string, any> | undefined;
  /**
   * Returns a new validation schema with the specified options.
   * @param options The options to apply.
   * @returns A new validation schema with the specified options.
   */
  withOptions(options: ValidationOptions): DefinedValidationSchema<T, Schema>;
};

/**
 * Creates a validation schema with methods for validating values directly.
 *
 * @param schema The property validation rules.
 * @returns The same schema with `validate`, `safeValidate`, and `withOptions` methods.
 *
 * @example
 * const userSchema = defineValidationSchema<User>({
 *   name: { isRequired: true },
 * });
 *
 * userSchema.validate(user);
 * const result = userSchema.safeValidate(user);
 */
export function defineValidationSchema<const S extends InferredSchemaDefinition>(
  schema: S,
  defaultOptions?: ValidationOptions
): DefinedValidationSchema<InferValidationSchema<S>, S>;
export function defineValidationSchema<T>(
  schema: ValidationSchema<T>,
  defaultOptions?: ValidationOptions
): DefinedValidationSchema<T>;
export function defineValidationSchema<T>(
  schema: ValidationSchema<T>,
  defaultOptions: ValidationOptions = {}
): DefinedValidationSchema<T> {
  const definedSchema = schema as DefinedValidationSchema<T>;

  Object.defineProperties(definedSchema, {
    validate: {
      enumerable: false,
      value: (instance: T | T[]) => {
        runSchemaValidation(instance, definedSchema, {
          ...defaultOptions,
          output: 'exception',
        });
      },
    },
    safeValidate: {
      enumerable: false,
      value: (instance: T | T[]) =>
        runSchemaValidation(instance, definedSchema, {
          ...defaultOptions,
          output: 'record',
        }),
    },
    withOptions: {
      enumerable: false,
      value: (options: ValidationOptions) =>
        defineValidationSchema<T>({ ...definedSchema } as ValidationSchema<T>, {
          ...defaultOptions,
          ...options,
        }),
    },
  });

  return definedSchema;
}
