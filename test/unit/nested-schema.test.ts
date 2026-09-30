import { describe, expect, it } from 'vitest';
import { runSchemaValidation } from '../../src';

describe('nested schema validation', () => {
  it('validates arrays nested inside an object', () => {
    const productSchema = {
      name: {
        isRequired: true,
      },
    };
    const userSchema = {
      products: {
        nestedSchema: productSchema,
      },
    };
    const user = {
      products: [{ name: 'Product 1' }, { name: '' }],
    };

    expect(() => runSchemaValidation(user, userSchema)).toThrow();
    expect(runSchemaValidation(user, userSchema, { output: 'record' })).toEqual({
      products: {
        1: {
          name: ['Is a required value'],
        },
      },
    });
  });
});
