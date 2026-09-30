import { describe, expect, it } from 'vitest';
import { defineValidationSchema } from '../../src/validators/define-validation-schema';
import { InferValidationSchema } from '../../src/interfaces/inferred-schema';

const productSchema = defineValidationSchema({
  id: { isNumber: true, isRequired: true },
  name: { isString: true, isRequired: true },
});

const userSchema = defineValidationSchema({
  name: { isString: true, isRequired: true },
  age: { isNumber: true },
  nickname: { isString: true, isNullable: true },
  products: { nestedSchema: productSchema },
});

const legacySchema = defineValidationSchema<{ name: string }>({
  name: { isString: true },
});

type UserFromSchema = InferValidationSchema<typeof userSchema>;

const validUser: UserFromSchema = {
  name: 'Alice',
  nickname: null,
  products: {
    id: 1,
    name: 'Book',
  },
};

// @ts-expect-error name is required and must be a string.
const invalidUser: UserFromSchema = {};
const inferredName: string = validUser.name;

const primitiveSchema = defineValidationSchema({
  primitive: {
    isBoolean: true,
    isString: true,
    isNumber: true,
    isRequired: true,
  },
});

type PrimitiveFromSchema = InferValidationSchema<typeof primitiveSchema>;
const inferredPrimitive: boolean | string | number =
  undefined as unknown as PrimitiveFromSchema['primitive'];

describe('schema type inference', () => {
  it('infers a usable type from the schema', () => {
    expect(userSchema.safeValidate(validUser)).toBeUndefined();
  });

  it('keeps runtime validation available without a pre-existing type', () => {
    expect(userSchema.safeValidate({})).toEqual({
      name: ["The property 'name' is required"],
    });
  });

  it('keeps the explicit generic form compatible', () => {
    expect(legacySchema.safeValidate({ name: 'Alice' })).toBeUndefined();
  });
});
