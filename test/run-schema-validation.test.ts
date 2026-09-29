import assert from 'node:assert/strict';
import test from 'node:test';

import { ValidationError } from '../src/errors';
import { ValidationSchema } from '../src/interfaces';
import { runSchemaValidation } from '../src/validators/run-schema-validation';

type User = {
  name: string;
};

const userSchema: ValidationSchema<User> = {
  name: { minLength: 3, isRequired: true },
};

test('validates a valid object', () => {
  assert.doesNotThrow(() => runSchemaValidation({ name: 'John' }, userSchema));
});

test('rejects an invalid object', () => {
  assert.throws(
    () => runSchemaValidation({ name: 'Jo' }, userSchema),
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.deepEqual(error.errors, {
        name: ['Must have a minimum of 3 characters'],
      });
      return true;
    }
  );
});

test('validates a valid array', () => {
  assert.doesNotThrow(() => runSchemaValidation([{ name: 'John' }, { name: 'Jane' }], userSchema));
});

test('rejects an invalid array when an element has invalid structure', () => {
  assert.throws(
    () => runSchemaValidation([{ name: 'John' }, ['invalid'] as unknown as User], userSchema),
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.deepEqual(error.errors, {
        1: {
          _self: ['Each array element must be an object compatible with the schema'],
        },
      });
      return true;
    }
  );
});

test('accepts empty arrays', () => {
  assert.doesNotThrow(() => runSchemaValidation([], userSchema));
});

test('rejects nested arrays because they are not supported as schema elements', () => {
  assert.throws(
    () => runSchemaValidation([[{ name: 'John' }]] as unknown as User[], userSchema),
    (error: unknown) => {
      assert.ok(error instanceof ValidationError);
      assert.deepEqual(error.errors, {
        0: {
          _self: ['Each array element must be an object compatible with the schema'],
        },
      });
      return true;
    }
  );
});
