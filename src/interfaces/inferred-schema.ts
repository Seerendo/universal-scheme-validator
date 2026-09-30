import { ValidationRule } from './validation-rule';

/**
 * A schema definition that does not require a pre-existing TypeScript type.
 */
export type InferredSchemaDefinition = Record<string, InferredValidationRule>;

export type InferredValidationRule = Omit<ValidationRule<any>, 'nestedSchema'> & {
  nestedSchema?: InferredSchemaDefinition;
};

type SchemaFields<S extends Record<string, unknown>> = Omit<
  S,
  'validate' | 'safeValidate' | 'withOptions'
>;

type ArrayValue<R> = R extends { isArray: infer ArrayRule }
  ? ArrayRule extends { type: infer ElementType }
    ? ElementType extends 'string'
      ? string[]
      : ElementType extends 'number'
        ? number[]
        : ElementType extends 'boolean'
          ? boolean[]
          : unknown[]
    : ArrayRule extends true
      ? unknown[]
      : never
  : never;

type DeclaredRuleValue<R> =
  | (R extends { nestedSchema: infer Nested extends Record<string, unknown> }
      ? InferValidationSchema<Nested>
      : never)
  | (R extends { isInstance: new (...args: any[]) => infer Instance } ? Instance : never)
  | ArrayValue<R>
  | (R extends { isBoolean: true } | { isType: 'boolean' } ? boolean : never)
  | (R extends { isNumber: infer NumberRule }
      ? NumberRule extends { type: 'bigint' }
        ? bigint
        : NumberRule extends false
          ? never
          : number
      : R extends { isType: 'number' }
        ? number
        : never)
  | (R extends { isString: true } | { isType: 'string' } ? string : never)
  | (R extends { isDate: true } ? Date : never)
  | (R extends { isEqualTo: infer EqualValue } ? EqualValue : never);

type RuleValue<R> = [DeclaredRuleValue<R>] extends [never] ? unknown : DeclaredRuleValue<R>;

type NullableValue<R, Value> = R extends {
  isNullable: true;
}
  ? Value | null
  : Value;

type IsRequired<R> = R extends { isRequired: true }
  ? true
  : R extends { isOptional: false }
    ? true
    : false;

/**
 * Infers the object type represented by an inferred schema definition.
 * Properties are optional by default, matching the current ValidationSchema behavior.
 */
type RequiredFields<S extends Record<string, unknown>> = {
  [
    K in keyof SchemaFields<S> as IsRequired<SchemaFields<S>[K]> extends true ? K : never
  ]-?: NullableValue<SchemaFields<S>[K], RuleValue<SchemaFields<S>[K]>>;
};

type OptionalFields<S extends Record<string, unknown>> = {
  [
    K in keyof SchemaFields<S> as IsRequired<SchemaFields<S>[K]> extends true ? never : K
  ]?: NullableValue<SchemaFields<S>[K], RuleValue<SchemaFields<S>[K]>>;
};

type Simplify<T> = { [K in keyof T]: T[K] };

/**
 * Infers the validation schema type.
 * Properties are optional by default, matching the current ValidationSchema behavior.
 * @example
 * const userSchema = defineValidationSchema({
 *   name: { isString: true, isRequired: true },
 *   age: { isNumber: true },
 *   person: {
 *     isInstance: Person,
 *     nestedSchema: {
 *       name: { maxLength: 20 },
 *       book: { isInstance: Book }
 *     }
 *   }
 * });
 *
 * type UserFromSchema = InferValidationSchema<typeof userSchema>;
 *
 * const validUser: UserFromSchema = {
 *   name: 'Alice',
 *   age: 30,
 *   person: new Person(),
 * };
 *
 * // @ts-expect-error name is required and must be a string.
 * const invalidUser: UserFromSchema = {};
 */
export type InferValidationSchema<S extends Record<string, unknown>> = Simplify<
  RequiredFields<S> & OptionalFields<S>
>;
