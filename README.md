# universal-scheme-validator

Robust and easy-to-use validation schemas for class-based data models in TypeScript.

## Installation

Install the package using npm:

```bash
npm install universal-scheme-validator
```

## Basic Usage

Define your classes or data types, create a validation schema using the `ValidationSchema` interface, and evaluate your instances using the `runSchemaValidation` function.

```typescript
import { ValidationSchema, runSchemaValidation } from 'universal-scheme-validator';

class User {
  name!: string;
  email!: string;
  age?: number;
}

// 1. Define the validation schema
const userSchema: ValidationSchema<User> = {
  name: {
    isRequired: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    isRequired: true,
    isEmail: true,
  },
  age: {
    isNumber: { isZero: false },
    isMin: 18,
  },
};

// 2. Create an instance and test validation
try {
  const user = new User();
  user.name = 'Ro'; // Minimum length is 3

  // 3. Execute validation
  // Throws an exception if there are errors by default
  runSchemaValidation(user, userSchema);
} catch (error) {
  console.log(error.errors);
  // Expected output:
  // {
  //   "name": ["The value must be at least 3 characters long"],
  //   "email": ["The property 'email' is required"]
  // }
}
```

## Validation Options

The `runSchemaValidation` function accepts a third parameter for configuration options:

- **`strict`** (`boolean`): If `true`, throws an error when the object contains properties that are not defined in the schema.
- **`output`** (`"exception" | "record"`): Determines the format in which errors are returned.
  - `"exception"` (default): Throws a `ValidationError` exception.
  - `"record"`: Returns an object where the keys are the properties and the values are arrays of the found errors.

**Options example:**

```typescript
// Returns errors without throwing an exception and validates in strict mode
const errores = runSchemaValidation(user, userSchema, {
  output: 'record',
  strict: true,
});
```

### Validation of Nested Objects and Arrays

You can validate complex structures, arrays, and nested objects using the `nestedSchema` rule.

```typescript
const schemaComplejo: ValidationSchema = {
  direccion: {
    isObject: true,
    nestedSchema: {
      calle: { isRequired: true, isNotEmpty: true },
      codigoPostal: { isNumber: true },
    },
  },
  etiquetas: {
    isArray: { type: 'string' },
    isRequired: true,
  },
};
```

It is also possible to directly pass an array of instances to `runSchemaValidation(arrayOfInstances, schema)`.

## Available Rules (`ValidationRule`)

The following validation rules are available through the `ValidationRule` interface and can be used on any property:

### Text and Strings

- **`isString: boolean`**: Verifies that the value is a string.
- **`minLength: number`**: Minimum required length of a string.
- **`maxLength: number`**: Maximum required length of a string.
- **`isEmail: boolean`**: Verifies if the string is a valid email.
- **`isUrl: boolean`**: Verifies if the string is a valid URL.
- **`isPath: PathValidationOptions`**: Verifies if the string is a valid path. Allows configuring extra options (e.g., no spaces, not empty).
- **`isUUID: boolean | { version?: number, provider?: "standard" | "oracle" }`**: Validates that it's a valid UUID identifier.
- **`isJSON: boolean | { expectedStructure?: ExpectedStructure }`**: Verifies if the string is a valid JSON.
- **`isNotAlpha: boolean | object`**: Validates that the text does **not** contain purely alphabetical characters, allowing numbers, accents, or symbols.

### Numbers

- **`isNumber: boolean | { isZero?: boolean, type?: NumberSchema }`**: Verifies that the value is numeric.
- **`isMin: number`**: Minimum expected numeric value.
- **`isMax: number`**: Maximum expected numeric value.

### Data Types and Structure

- **`isType: PrimitiveType`**: Verifies that the type matches a primitive ("string" | "number" | "boolean").
- **`isBoolean: boolean`**: Validates that the input value is boolean.
- **`isArray: boolean | { type: PrimitiveType, strict?: boolean }`**: Validates that the structure is an array.
- **`isObject: boolean | { allowEmpty?: boolean, allowArrays?: boolean }`**: Verifies that the value is an object.

### Required and Equality

- **`isRequired: boolean`**: Strict property, throws an error if the value or property is null, undefined, or non-existent in the instance.
- **`isNotEmpty: boolean`**: The value cannot be empty (works with strings, arrays, objects).
- **`isEqualTo: any`**: Checks if the input value is strictly equal to the provided value.
- **`containsValue: any[]`**: Checks if the tested value includes any of the elements from the options array.

### Classes and Nested Schemas

- **`isInstance: class`**: Verifies if the provided value is an instance of a specified class.
- **`nestedSchema`**: An optional object with additional validation schema for embedded/nested structures.

## Errors and Exceptions

By default, if a validation fails, the library will throw an instance of `ValidationError` which can be accessed from `@catch`.

```typescript
import { ValidationError } from 'universal-scheme-validator';

try {
  // ...
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.errors);
  }
}
```
