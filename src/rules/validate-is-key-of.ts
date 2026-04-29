/**
 * @deprecated
 * Validates if a property is a key of a class.
 * @param propertyKey The property to validate
 * @param classType The class to which the property belongs
 * @returns An array of strings representing the validation errors
 */
export function validateIsKeyOf<K extends string>(
  propertyKey: K,
  classType: new () => object
): string[] {
  const errors: string[] = [];

  // Create an instance of the class to get its properties
  const instance = new classType();
  const classProperties = Object.getOwnPropertyNames(instance);

  if (classProperties.length === 0) {
    errors.push(`No properties found in class ${classType.name}.`);
    return errors;
  }

  // Check if the property name exists in the class properties
  if (!classProperties.includes(propertyKey)) {
    errors.push(
      `The property '${propertyKey}' is not a valid key of class ${classType.name}`
    );
  }

  return errors;
}
