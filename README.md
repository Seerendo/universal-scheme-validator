# Universal Scheme Validator

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/github/license/Seerendo/universal-scheme-validator" alt="License"></a>
  <a href="https://github.com/Seerendo/universal-scheme-validator"><img src="https://img.shields.io/badge/coverage-85.83%25-brightgreen" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/universal-scheme-validator"><img src="https://img.shields.io/npm/v/universal-scheme-validator" alt="npm version"></a>
</p>

Runtime validation schemas for TypeScript objects, with inferred types, nested structures, custom messages and class compatibility.

## Installation

```bash
npm install universal-scheme-validator
```

## Quick start

```typescript
import { defineValidationSchema } from 'universal-scheme-validator';

const userSchema = defineValidationSchema({
  name: {
    isString: true,
    isRequired: true,
    minLength: 3,
  },
  email: {
    isString: true,
    isEmail: true,
    isRequired: true,
  },
  age: {
    isNumber: { isZero: false },
    isMin: 18,
  },
});

const user = {
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
};

userSchema.validate(user);
```

`validate()` throws a `ValidationError` when the value is invalid. Use `safeValidate()` to receive an error record instead:

```typescript
const errors = userSchema.safeValidate(user);

if (errors) {
  console.log(errors);
}
```

`safeValidate()` returns `undefined` for a valid value and a record grouped by property for an invalid value.

## Type inference

The schema can be the source of the TypeScript type. A class or interface is optional:

```typescript
import { defineValidationSchema, InferValidationSchema } from 'universal-scheme-validator';

const userSchema = defineValidationSchema({
  name: {
    isString: true,
    isRequired: true,
  },
  nickname: {
    isString: true,
    isNullable: true,
  },
  age: {
    isNumber: true,
  },
});

type User = InferValidationSchema<typeof userSchema>;

const user: User = {
  name: 'Alice',
  nickname: null,
};
```

The inferred type is equivalent to:

```typescript
type User = {
  name: string;
  nickname?: string | null;
  age?: number;
};
```

Properties are optional by default. Use `isRequired: true` or `isOptional: false` to make a property required. Use `isNullable: true` to allow `null`.

## Existing model types

Schemas can still be checked against an existing class or interface:

```typescript
interface User {
  name: string;
  age?: number;
}

const userSchema = defineValidationSchema<User>({
  name: {
    isString: true,
    isRequired: true,
  },
  age: {
    isNumber: true,
  },
});

userSchema.safeValidate({ name: 'Alice' });
```

## Rule configuration

Rules keep a compact shorthand when no custom message is needed:

```typescript
const schema = defineValidationSchema({
  name: {
    isString: true,
    minLength: 3,
    isRequired: true,
  },
});
```

Rules can carry their own message. For rules with a value, use `value` and `message`:

```typescript
const schema = defineValidationSchema({
  name: {
    isString: {
      message: 'The name must be text',
    },
    minLength: {
      value: 3,
      message: 'The name must contain at least 3 characters',
    },
    isRequired: {
      message: 'The name is mandatory',
    },
  },
});
```

The custom message replaces only the default message produced by that rule.

## Available rules

### Primitive and text rules

- `isString`: Requires a string.
- `isBoolean`: Requires a boolean.
- `isNumber`: Requires a number or `bigint`. Supports `isZero` and `type` (`integer`, `float` or `bigint`).
- `isType`: Validates a primitive type: `string`, `number` or `boolean`.
- `isEmail`: Validates an email address.
- `isUrl`: Validates an HTTP, HTTPS or FTP URL.
- `isPath`: Validates a path or URL path. Options include `noSpaces`, `noTrailingSlash`, `notEmpty` and `noQuery`.
- `isUUID`: Validates UUID versions 1 through 8. A boolean configuration uses version 4.
- `isDate`: Validates a `Date` or a parseable date string. Supports `YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY` and `DD-MM-YYYY` formats.
- `isJSON`: Validates a JSON string and can validate an expected structure.
- `isNotAlpha`: Restricts numbers, accents and punctuation according to its options.
- `minLength`: Sets the minimum length of a string or array.
- `maxLength`: Sets the maximum length of a string or array.
- `isNotEmpty`: Rejects empty strings and arrays.

### Structure and comparison rules

- `isArray`: Requires an array and optionally validates primitive element types. Supports `strict` element checking.
- `isObject`: Requires an object. Supports `allowEmpty` and `allowArrays`.
- `isInstance`: Requires an instance of a class.
- `nestedSchema`: Applies another schema to an object or array of objects.
- `isEqualTo`: Requires strict equality with a configured value.
- `containsValue`: Requires an array, string or number to contain one of the configured values.
- `blackList`: Rejects values found in a blacklist.
- `whiteList`: Validates that a value belongs to an allowed list when called directly.
- `isMin`: Requires a number greater than or equal to the configured minimum.
- `isMax`: Requires a number less than or equal to the configured maximum.

### Presence rules

`isOptional` and `isNullable` represent different conditions:

```typescript
const profileSchema = defineValidationSchema({
  nickname: {
    isOptional: true,
    isNullable: true,
    isString: true,
  },
  email: {
    isRequired: true,
    isString: true,
  },
});
```

- `isRequired: true`: Rejects both `undefined` and `null`.
- `isOptional: true`: Allows the property to be omitted.
- `isOptional: false`: Rejects an omitted property.
- `isNullable: true`: Allows the property to contain `null`.
- `isNullable: false`: Rejects `null`.

## Nested schemas and arrays

Use `nestedSchema` to compose object schemas:

```typescript
const productSchema = defineValidationSchema({
  name: {
    isString: true,
    isRequired: true,
  },
});

const userSchema = defineValidationSchema({
  products: {
    nestedSchema: productSchema,
  },
});

userSchema.safeValidate({
  products: [{ name: 'Book' }, { name: '' }],
});
```

You can replace the nested error tree with a custom message:

```typescript
const userSchema = defineValidationSchema({
  product: {
    nestedSchema: {
      value: productSchema,
      message: 'The product is invalid',
    },
  },
});
```

## Options and strict mode

Use `withOptions()` to derive an independent schema with different defaults:

```typescript
const strictUserSchema = userSchema.withOptions({
  strict: true,
  strictMessage: 'Extra properties are not allowed',
});
```

Available options:

- `strict`: Rejects properties not declared in the schema.
- `strictMessage`: Replaces the default strict-mode error message.
- `output`: Controls low-level validation output: `exception` or `record`.

`validate()` always throws on failure. `safeValidate()` always returns a record or `undefined`.

## Legacy validation function

`runSchemaValidation()` remains available for existing users and function-based code:

```typescript
import { runSchemaValidation } from 'universal-scheme-validator';

runSchemaValidation(user, userSchema);

const errors = runSchemaValidation(user, userSchema, {
  output: 'record',
});
```

New code can use the schema methods directly.

## Errors

Validation failures thrown by `validate()` are instances of `ValidationError`:

```typescript
import { ValidationError } from 'universal-scheme-validator';

try {
  userSchema.validate(user);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.errors);
  }
}
```

The `errors` property contains the detailed error record grouped by property. Nested schemas preserve nested error paths unless a custom nested message is configured.

## License

MIT © Seerendo
