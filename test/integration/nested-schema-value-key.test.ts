import { describe, expect, it } from 'vitest';
import { defineValidationSchema } from '../../src';

describe('nested schemas with a value property', () => {
  it('validates the complete nested schema when a field is named value', () => {
    const telecomSchema = defineValidationSchema({
      system: { isString: true, isRequired: true },
      value: { isString: true, isRequired: true },
    });
    const personSchema = defineValidationSchema({
      telecom: {
        isArray: true,
        nestedSchema: telecomSchema,
      },
    });

    expect(
      personSchema.safeValidate({
        telecom: [{ system: '', value: '' }],
      })
    ).toEqual({
      telecom: {
        0: {
          system: ['Is a required value'],
          value: ['Is a required value'],
        },
      },
    });
  });
});
