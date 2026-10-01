import { describe, expect, it } from 'vitest';
import { defineValidationSchema } from '../../src';

describe('ValidationSchema edge cases', () => {
  it('covers all primitive isType branches', () => {
    const schema = defineValidationSchema<{
      string: unknown;
      number: unknown;
      boolean: unknown;
    }>({
      string: { isType: 'string' },
      number: { isType: 'number' },
      boolean: { isType: 'boolean' },
    } as any);

    expect(schema.safeValidate({ string: 10, number: 'not-a-number', boolean: 'maybe' })).toEqual({
      string: ['Must be a primitive text string, the specified type is: string'],
      number: ['Must be a primitive number, the specified type is: number'],
      boolean: ['Must be a primitive boolean value, the specified type is: boolean'],
    });
    expect(schema.safeValidate({ string: 'text', number: '10', boolean: 'true' })).toBeUndefined();
  });

  it('covers array number failures and boolean element configuration', () => {
    const schema = defineValidationSchema<{ numbers: unknown; booleans: unknown }>({
      numbers: { isArray: { type: 'number' } },
      booleans: { isArray: { type: 'boolean' } },
    } as any);

    expect(schema.safeValidate({ numbers: ['not-a-number'], booleans: [true, 'false'] })).toEqual({
      numbers: [
        'The element at index [1] of the array must be of type number: [not-a-number] -> string',
      ],
    });

    const containsSchema = defineValidationSchema({
      values: { containsValue: ['allowed'] },
    });
    expect(containsSchema.safeValidate({ values: ['other'] })).toEqual({
      values: ['The array must contain at least one of the following values: ["allowed"]'],
    });
  });

  it('covers email validation boundaries', () => {
    const schema = defineValidationSchema({ email: { isEmail: true } });

    expect(schema.safeValidate({ email: 10 })).toEqual({
      email: ['Must be a text string'],
    });
    expect(schema.safeValidate({ email: 'a@b@c.com' })).toEqual({
      email: ["The email address must contain exactly one '@' symbol."],
    });
    expect(schema.safeValidate({ email: `person@${'a'.repeat(64)}.com` })).toEqual({
      email: ['No part of the domain can have more than 63 characters.'],
    });
    const longDomain = ['a', 'b', 'c', 'd'].map((letter) => letter.repeat(63)).join('.') + '.com';
    expect(schema.safeValidate({ email: `person@${longDomain}` })).toEqual({
      email: ["The part after the '@' cannot have more than 255 characters."],
    });
  });

  it('covers URL length and non-string values', () => {
    const schema = defineValidationSchema({ url: { isUrl: true } });

    expect(schema.safeValidate({ url: 10 })).toEqual({
      url: ['Must be a text string'],
    });
    expect(schema.safeValidate({ url: `https://example.com/${'a'.repeat(2048)}` })).toEqual({
      url: ['The URL is too long'],
    });
  });

  it('covers path queries and malformed URLs', () => {
    const schema = defineValidationSchema({
      path: { isPath: { noQuery: true, notEmpty: true } },
    });

    expect(schema.safeValidate({ path: '/users?active=true' })).toEqual({
      path: ['Query parameters are not allowed in the URL path'],
    });
    expect(schema.safeValidate({ path: 'https://[invalid' })).toEqual({
      path: ['Failed to parse the path'],
    });
    expect(schema.safeValidate({ path: '/' })).toEqual({
      path: ['The path must not be empty'],
    });
  });

  it('covers UUID type, version and exception errors', () => {
    const schema = defineValidationSchema({
      value: { isUUID: { version: 9 as 1 } },
    });

    expect(schema.safeValidate({ value: 10 })).toEqual({
      value: [
        'Must be a text string.',
        'The UUID must be exactly 36 characters long.',
        'The UUID version must be between 1 and 8.',
        'Must be a valid UUID of version 9 with a correct variant.',
      ],
    });
    expect(schema.safeValidate({ value: '' })).toEqual({
      value: ['The UUID cannot be an empty string.'],
    });
  });

  it('covers JSON type and missing structure errors', () => {
    const schema = defineValidationSchema({
      value: {
        isJSON: {
          expectedStructure: {
            name: { isRequired: true },
          },
        },
      },
    });

    expect(schema.safeValidate({ value: 10 })).toEqual({
      value: ['Must be a text string'],
    });
    expect(schema.safeValidate({ value: '{"other":true}' })).toEqual({
      value: ['Required key missing: name'],
    });
  });

  it('covers array length validation', () => {
    const schema = defineValidationSchema({
      value: { minLength: 2, maxLength: 3 },
    });

    expect(schema.safeValidate({ value: [1] })).toEqual({
      value: ['Must have a minimum of 2 elements'],
    });
    expect(schema.safeValidate({ value: [1, 2, 3, 4] })).toEqual({
      value: ['Cannot exceed 3 elements'],
    });
  });

  it('covers date format and invalid date errors', () => {
    const schema = defineValidationSchema({
      value: { isDate: { formatDate: 'unknown' } },
    });

    expect(schema.safeValidate({ value: '2024-01-02' })).toEqual({
      value: ['The date format is not valid (unknown)'],
    });
    expect(schema.safeValidate({ value: {} })).toEqual({
      value: ['Must be a valid date', 'The date format is not valid (unknown)'],
    });
  });

  it('covers custom optional and nullable messages', () => {
    const schema = defineValidationSchema({
      optional: { isOptional: { value: false, message: 'Optional value is missing' } },
      nullable: { isNullable: { value: false, message: 'Nullable value is invalid' } },
    });

    expect(schema.safeValidate({ nullable: 'value' })).toEqual({
      optional: ['Optional value is missing'],
    });
    expect(schema.safeValidate({ optional: 'value', nullable: null })).toEqual({
      nullable: ['Nullable value is invalid'],
    });
  });

  it('covers all non-alpha option combinations', () => {
    const schema = defineValidationSchema({
      numbersAccents: { isNotAlpha: { allowNumbers: true, allowAccents: true } },
      numbersPunctuation: { isNotAlpha: { allowNumbers: true, allowPunctuation: true } },
      accentsPunctuation: { isNotAlpha: { allowAccents: true, allowPunctuation: true } },
      accents: { isNotAlpha: { allowAccents: true } },
      punctuation: { isNotAlpha: { allowPunctuation: true } },
    });

    expect(
      schema.safeValidate({
        numbersAccents: 'value!',
        numbersPunctuation: 'value á',
        accentsPunctuation: 'value 1',
        accents: 'value 1',
        punctuation: 'value 1',
      })
    ).toEqual({
      numbersAccents: [
        'Must contain only letters, numbers, accents, and spaces, no punctuation marks',
      ],
      numbersPunctuation: [
        'Must contain only letters, numbers, punctuation marks, and spaces, no accents',
      ],
      accentsPunctuation: [
        'Must contain only letters, accents, punctuation marks, and spaces, no numbers',
      ],
      accents: ['Must contain only letters, accents, and spaces, no numbers or punctuation marks'],
      punctuation: [
        'Must contain only letters, punctuation marks, and spaces, no numbers or accents',
      ],
    });
  });
});
