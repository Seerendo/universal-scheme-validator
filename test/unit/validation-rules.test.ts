import { describe, expect, it } from 'vitest';
import { defineValidationSchema } from '../../src';

class Product {
  id = 1;
}

describe('ValidationSchema primitive rules', () => {
  it('validates strings', () => {
    const schema = defineValidationSchema<{ value: unknown }>({ value: { isString: true } });

    expect(schema.safeValidate({ value: 'text' })).toBeUndefined();
    expect(schema.safeValidate({ value: 10 } as never)).toEqual({
      value: ['Must be a text string'],
    });
  });

  it('validates booleans', () => {
    const schema = defineValidationSchema<{ value: unknown }>({ value: { isBoolean: true } });

    expect(schema.safeValidate({ value: true })).toBeUndefined();
    expect(schema.safeValidate({ value: 'true' } as never)).toEqual({
      value: ['Must be a boolean'],
    });
  });

  it('validates numbers and number constraints', () => {
    const schema = defineValidationSchema<{ value: unknown }>({
      value: { isNumber: true, isMin: 1, isMax: 10 },
    });

    expect(schema.safeValidate({ value: 5 })).toBeUndefined();
    expect(schema.safeValidate({ value: -1 })).toEqual({
      value: ['The minimum value must be greater than or equal to 1'],
    });
    expect(schema.safeValidate({ value: 11 })).toEqual({
      value: ['The maximum value must not be greater than 10'],
    });

    const integerSchema = defineValidationSchema<{ value: unknown }>({
      value: { isNumber: { type: 'integer' } },
    });
    const floatSchema = defineValidationSchema<{ value: unknown }>({
      value: { isNumber: { type: 'float' } },
    });
    const bigintSchema = defineValidationSchema<{ value: unknown }>({
      value: { isNumber: { type: 'bigint' } },
    });

    expect(integerSchema.safeValidate({ value: 3.14 })).toEqual({
      value: ['Must be an integer'],
    });
    expect(floatSchema.safeValidate({ value: 3 })).toEqual({
      value: ['Must be a float number'],
    });
    expect(bigintSchema.safeValidate({ value: 3 } as never)).toEqual({
      value: ['Must be a BigInt'],
    });
    expect(schema.safeValidate({ value: 'not-a-number' } as never)).toEqual({
      value: ['Must be a number'],
    });
  });

  it('validates primitive types', () => {
    const schema = defineValidationSchema<{ value: unknown }>({ value: { isType: 'string' } });

    expect(schema.safeValidate({ value: 'text' })).toBeUndefined();
    expect(schema.safeValidate({ value: 10 } as never)).toEqual({
      value: ['Must be a primitive text string, the specified type is: string'],
    });
  });

  it('validates dates', () => {
    const schema = defineValidationSchema<{ value: unknown }>({
      value: { isDate: { formatDate: 'YYYY-MM-DD' } },
    });

    expect(schema.safeValidate({ value: '2024-01-02' })).toBeUndefined();
    expect(schema.safeValidate({ value: {} })).toEqual({
      value: ['Must be a valid date'],
    });
    const dateFormatSchema = defineValidationSchema<{ value: unknown }>({
      value: { isDate: { formatDate: 'DD/MM/YYYY' } },
    });
    expect(dateFormatSchema.safeValidate({ value: '2024-01-02' })).toBeUndefined();
  });
});

describe('ValidationSchema collection and text rules', () => {
  it('validates arrays', () => {
    const schema = defineValidationSchema<{ value: unknown }>({
      value: { isArray: { type: 'string', strict: true } },
    });

    expect(schema.safeValidate({ value: ['one', 'two'] })).toBeUndefined();
    expect(schema.safeValidate({ value: [1] } as never)).toEqual({
      value: ['The element at index [1] of the array must be of type string: [1] -> number'],
    });

    expect(schema.safeValidate({ value: 'not-an-array' } as never)).toEqual({
      value: ['Must be an array'],
    });
    const numberArraySchema = defineValidationSchema<{ value: unknown }>({
      value: { isArray: { type: 'number' } },
    });
    expect(numberArraySchema.safeValidate({ value: ['1', 2] } as never)).toBeUndefined();
  });

  it('validates minimum and maximum length', () => {
    const schema = defineValidationSchema<{ value: unknown }>({
      value: { minLength: 3, maxLength: 5 },
    });

    expect(schema.safeValidate({ value: 'text' })).toBeUndefined();
    expect(schema.safeValidate({ value: 'x' })).toEqual({
      value: ['Must have a minimum of 3 characters'],
    });
    expect(schema.safeValidate({ value: 'abcdef' })).toEqual({
      value: ['Cannot exceed 5 characters'],
    });
  });

  it('validates non-empty values', () => {
    const schema = defineValidationSchema({ value: { isNotEmpty: true } });

    expect(schema.safeValidate({ value: 'text' })).toBeUndefined();
    expect(schema.safeValidate({ value: '' })).toEqual({
      value: ['Cannot be an empty string'],
    });
    expect(schema.safeValidate({ value: [] })).toEqual({
      value: ['Cannot be an empty array'],
    });
  });

  it('validates email and URL values', () => {
    const schema = defineValidationSchema<{ email: unknown; url: unknown }>({
      email: { isEmail: true },
      url: { isUrl: true },
    });

    expect(
      schema.safeValidate({ email: 'person@example.com', url: 'https://example.com' })
    ).toBeUndefined();
    expect(schema.safeValidate({ email: 'invalid@', url: 'invalid' })).toEqual({
      email: ['The email format is not valid.'],
      url: [
        'The URL must start with http://, https://, or ftp://',
        'The URL does not have a valid structure',
      ],
    });
    expect(
      schema.safeValidate({ email: `${'a'.repeat(65)}@example.com`, url: 'ftp://127.0.0.1' })
    ).toEqual({
      email: ["The part before the '@' cannot have more than 64 characters."],
    });
  });

  it('validates paths and allowed characters', () => {
    const schema = defineValidationSchema<{ path: unknown; value: unknown }>({
      path: { isPath: { noSpaces: true, noTrailingSlash: true } },
      value: { isNotAlpha: { allowNumbers: true } },
    });

    expect(schema.safeValidate({ path: '/users/1', value: 'User 123' })).toBeUndefined();
    expect(schema.safeValidate({ path: '/bad path/', value: 'User!' })).toEqual({
      path: ['The path must not contain spaces', "The path must not end with '/'"],
      value: ['Must contain only letters, numbers, and spaces, no accents or punctuation marks'],
    });
  });
});

describe('ValidationSchema object and comparison rules', () => {
  it('validates objects and JSON', () => {
    const schema = defineValidationSchema<{ object: unknown; json: unknown }>({
      object: { isObject: true },
      json: { isJSON: true },
    });

    expect(schema.safeValidate({ object: { id: 1 }, json: '{"id":1}' })).toBeUndefined();
    expect(schema.safeValidate({ object: 'invalid', json: 'invalid' })).toEqual({
      object: ['Must be an object'],
      json: ['Must be a valid JSON'],
    });
    const structuredSchema = defineValidationSchema<{ value: unknown }>({
      value: {
        isJSON: {
          expectedStructure: {
            user: { isString: true },
          },
        },
      },
    });
    expect(structuredSchema.safeValidate({ value: '{"user":10}' })).toEqual({
      value: ['user: Must be a text string'],
    });
    const arrayObjectSchema = defineValidationSchema<{ value: unknown }>({
      value: { isObject: { allowArrays: true } },
    });
    expect(arrayObjectSchema.safeValidate({ value: [{}, { id: 1 }] })).toEqual({
      value: ['The element [0] cannot be empty'],
    });
  });

  it('validates equality and allowed values', () => {
    const schema = defineValidationSchema<{ role: unknown; status: unknown }>({
      role: { isEqualTo: { value: 'admin', message: 'Role must be admin' } },
      status: { containsValue: ['active', 'pending'] },
    });

    expect(schema.safeValidate({ role: 'admin', status: 'active' })).toBeUndefined();
    expect(schema.safeValidate({ role: 'user', status: 'disabled' } as never)).toEqual({
      role: ['Role must be admin'],
      status: ['The value must be in the allowed list: ["active","pending"]'],
    });
  });

  it('validates blacklists and instances', () => {
    const schema = defineValidationSchema<{ values: unknown; product: unknown }>({
      values: { blackList: ['admin'] },
      product: { isInstance: Product },
    });

    expect(schema.safeValidate({ values: ['user'], product: new Product() })).toBeUndefined();
    expect(schema.safeValidate({ values: ['admin'], product: {} } as never)).toEqual({
      values: ["The value 'admin' is not allowed"],
      product: ['Must be an instance of Product'],
    });
  });

  it('validates UUIDs', () => {
    const schema = defineValidationSchema<{ value: unknown }>({
      value: { isUUID: { version: 4 } },
    });

    expect(schema.safeValidate({ value: '550e8400-e29b-41d4-a716-446655440000' })).toBeUndefined();
    expect(schema.safeValidate({ value: 'invalid' })).toEqual({
      value: [
        'The UUID must be exactly 36 characters long.',
        'Must be a valid UUID of version 4 with a correct variant.',
      ],
    });
  });
});
