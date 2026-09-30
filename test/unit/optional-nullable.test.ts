import { describe, expect, it } from 'vitest';
import { runSchemaValidation, ValidationSchema } from '../../src';

describe('optional and nullable rules', () => {
  it('allows omitted and null values when explicitly configured', () => {
    const schema: ValidationSchema<{ nickname?: string | null }> = {
      nickname: {
        isOptional: true,
        isNullable: true,
        isString: true,
      },
    };

    expect(runSchemaValidation({}, schema, { output: 'record' })).toBeUndefined();
    expect(runSchemaValidation({ nickname: null }, schema, { output: 'record' })).toBeUndefined();
  });

  it('rejects omitted values when optional is false', () => {
    const schema = { nickname: { isOptional: false } };

    expect(runSchemaValidation({}, schema, { output: 'record' })).toEqual({
      nickname: ["The property 'nickname' cannot be omitted"],
    });
  });

  it('rejects null values when nullable is false', () => {
    const schema = { nickname: { isNullable: false } };

    expect(runSchemaValidation({ nickname: null }, schema, { output: 'record' })).toEqual({
      nickname: ["The property 'nickname' cannot be null"],
    });
  });
});
