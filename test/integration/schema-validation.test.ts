import { describe, expect, it } from 'vitest';
import {
  defineValidationSchema,
  InferValidationSchema,
  runSchemaValidation,
  ValidationError,
  ValidationSchema,
} from '../../src';

describe('schema validation integration', () => {
  it('validates directly through the schema methods', () => {
    const schema = defineValidationSchema({
      name: { isString: true, isRequired: true },
    });

    expect(schema.safeValidate({ name: 'Alice' })).toBeUndefined();
    expect(schema.safeValidate({})).toEqual({
      name: ["The property 'name' is required"],
    });
    expect(() => schema.validate({})).toThrow(ValidationError);
  });

  it('supports schemas inferred from their definitions', () => {
    const schema = defineValidationSchema({
      name: { isString: true, isRequired: true },
      age: { isNumber: true },
      nickname: { isString: true, isNullable: true },
    });

    type User = InferValidationSchema<typeof schema>;
    const user: User = { name: 'Alice', nickname: null };

    expect(schema.safeValidate(user)).toBeUndefined();
  });

  it('keeps compatibility with an explicit model type', () => {
    interface User {
      name: string;
    }

    const schema = defineValidationSchema<User>({
      name: { isString: true, isRequired: true },
    });

    const user: User = { name: 'Alice' };
    expect(schema.safeValidate(user)).toBeUndefined();
  });

  it('validates nested objects and arrays', () => {
    const productSchema = defineValidationSchema({
      name: { isString: true, isRequired: true },
    });
    const userSchema = defineValidationSchema({
      products: { nestedSchema: productSchema },
    });

    expect(userSchema.safeValidate({ products: [{ name: 'Book' }, { name: '' }] })).toEqual({
      products: {
        1: {
          name: ['Is a required value'],
        },
      },
    });
  });

  it('supports optional and nullable properties', () => {
    const schema: ValidationSchema<{ nickname?: string | null }> = {
      nickname: {
        isOptional: true,
        isNullable: true,
        isString: true,
      },
    };

    expect(runSchemaValidation({}, schema, { output: 'record' })).toBeUndefined();
    expect(runSchemaValidation({ nickname: null }, schema, { output: 'record' })).toBeUndefined();
    expect(
      runSchemaValidation(
        {} as { nickname?: string | null },
        { nickname: { isOptional: false } },
        {
          output: 'record',
        }
      )
    ).toEqual({ nickname: ["The property 'nickname' cannot be omitted"] });
  });

  it('uses messages attached to individual rules', () => {
    const schema = defineValidationSchema({
      name: {
        isString: { message: 'Name must be text' },
        minLength: { value: 3, message: 'Name is too short' },
        isRequired: { message: 'Name is required' },
      },
    });

    expect(schema.safeValidate({})).toEqual({ name: ['Name is required'] });
    expect(schema.safeValidate({ name: 10 })).toEqual({ name: ['Name must be text'] });
    expect(schema.safeValidate({ name: 'Al' })).toEqual({ name: ['Name is too short'] });
  });

  it('supports custom nested and strict messages', () => {
    const schema = defineValidationSchema(
      {
        profile: {
          nestedSchema: {
            value: { name: { isRequired: true } },
            message: 'Profile is invalid',
          },
        },
      },
      { strict: true, strictMessage: 'Extra properties are not allowed' }
    );

    expect(schema.safeValidate({ profile: { name: '' }, extra: true })).toEqual({
      _strict: ['Extra properties are not allowed'],
      profile: 'Profile is invalid',
    });
  });

  it('creates independent schemas with withOptions', () => {
    const schema = defineValidationSchema({ name: { isString: true } });
    const strictSchema = schema.withOptions({ strict: true });

    expect(schema.safeValidate({ name: 'Alice', extra: true })).toBeUndefined();
    expect(strictSchema.safeValidate({ name: 'Alice', extra: true })).toEqual({
      _strict: ['Properties not present in the schema: extra'],
    });
  });
});
