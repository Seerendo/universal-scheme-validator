import { validateNestedSchema } from "../rules";
import { validateProperty } from "../functions/validate-property";
import { ValidationError } from "../errors";
import { OutputType } from "../types";
import { ValidationSchema } from "../interfaces";

/**
 * Validates a Schema according to the specified validation guidelines
 *
 * @param instance The Object or array of objects to validate
 * @param schema The validation Schema with the guidelines
 * @param [options] - Configuration options for validation.
 * @param [options.strict=false] - If `true`, throws an error when the object contains properties not defined in the schema.
 * @param [options.output="exception"] - Output type for errors, of type {@link OutputType}:
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with the validation messages.
 *
 * @returns An object with validation errors for each schema property.
 *
 * @example
 * // Define classes to use with validation
 *
 * class Book {
 *   book: string;
 *   constructor(book: string) {
 *     this.book = book;
 *   }
 * }
 *
 * class Person {
 *   name: string;
 *   book: Book;
 *   constructor(name: string, book: Book) {
 *     this.name = name;
 *     this.book = book;
 *   }
 * }
 *
 * class User {
 *   user: string;
 *   email: string;
 *   age?: number;
 *   person: Person;
 *   constructor(user: string, email: string, age: number, person: Person) {
 *     this.user = user;
 *     this.email = email;
 *     this.age = age;
 *     this.person = person;
 *   }
 * }
 *
 * // Create an instance of a User object
 * const invalidBook = new Book("I am not a Book");
 * const invalidPerson = new Person("John", invalidBook);
 * const invalidUser = new User("Peter", "invalid_email", 0, invalidPerson);
 *
 * // Define the validation schema
 * const userSchema: ValidationSchema = {
 *   user: { maxLength: 10 },
 *   email: { isEmail: true },
 *   age: { isNumber: true },
 *   person: {
 *     isInstance: Person,
 *     nestedSchema: {
 *       name: { maxLength: 20 },
 *       book: { isInstance: Book }
 *     }
 *   }
 * };
 *
 * // Validate the object, by default returns an exception
 * runSchemaValidation(invalidUser, userSchema);
 *
 * // Return errors per object
 * runSchemaValidation(invalidUser, userSchema, {
 *  output: "record",
 * });
 *
 * // Strict validation: additional properties not allowed
 * runSchemaValidation(differentUser, differentUserSchema, {
 *  strict: true,
 * });
 *
 * // In case errors exist, an exception will be generated with the following format:
 *
 * {
 *   "email": ["Must be a valid email address"],
 *   "person": {
 *     "book": ["Must be an instance of Book"]
 *   }
 * }
 */
export function runSchemaValidation<T>(
  instance: T | T[],
  schema: ValidationSchema<T>,
  options: { strict?: boolean; output?: OutputType } = {
    strict: false,
    output: "exception",
  },
): void | Record<string, any> {
  const { strict = false, output = "exception" } = options;

  // If it is an array, we validate each one separately
  if (Array.isArray(instance)) {
    const allErrors: Record<number, any> = {};

    instance.forEach((item, index) => {
      try {
        const errors = runSchemaValidation(item, schema, {
          strict,
          output: "record",
        });
        if (errors && Object.keys(errors).length > 0) {
          allErrors[index] = errors;
        }
      } catch (error) {
        allErrors[index] = (error as ValidationError).errors || error;
      }
    });

    if (Object.keys(allErrors).length > 0) {
      if (output === "exception") {
        throw new ValidationError(allErrors);
      } else {
        return allErrors;
      }
    }

    return;
  }

  // Original case: single object
  const errors: Record<string, any> = {};
  const instanceKeys = Object.keys(instance as object);
  const schemaKeys = Object.keys(schema);

  if (strict) {
    const extraProperties = instanceKeys.filter(
      (key) => !schemaKeys.includes(key),
    );

    if (extraProperties.length > 0) {
      errors["_strict"] = [
        `Properties not present in the schema: ${extraProperties.join(", ")}`,
      ];
    }
  }

  // Validate each property
  for (const property in schema) {
    const rules = schema[property];
    if (!rules) continue;

    const value = (instance as any)[property];

    // Validate if the property is required and not present
    // If the property is not in the object, it is considered not required
    if (rules.isRequired && (value === undefined || value === null)) {
      errors[property] = [`The property '${property}' is required`];
      continue;
    }

    if (rules?.nestedSchema) {
      const nestedErrors = validateNestedSchema(
        value ?? {},
        rules.nestedSchema,
        { strict, output: "record" },
      );

      if (Object.keys(nestedErrors).length > 0) {
        errors[property] = nestedErrors;
      }
    }

    if (value !== undefined && value !== null) {
      const propertyErrors = validateProperty(value, rules);
      if (propertyErrors.length > 0) {
        errors[property] = (errors[property] || []).concat(propertyErrors);
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    if (output === "exception") {
      throw new ValidationError(errors);
    } else {
      return errors;
    }
  }
}
