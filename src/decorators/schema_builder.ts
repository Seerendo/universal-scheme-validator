import 'reflect-metadata';
import { ValidationRule, ValidationSchema } from '../interfaces';
import { NumberSchema, OutputType } from '../types';
import { runSchemaValidation } from '../validators';

const SCHEMA_KEY = Symbol('validationSchema');

export function addRule(target: object, propertyKey: string, rule: Partial<ValidationRule>) {
  // Reflect.getMetadata ya recorre la cadena de prototipos, útil para herencia
  const existingSchema: ValidationSchema<any> = Reflect.getOwnMetadata(SCHEMA_KEY, target) || {};

  existingSchema[propertyKey] = { ...(existingSchema[propertyKey] || {}), ...rule };
  Reflect.defineMetadata(SCHEMA_KEY, existingSchema, target);
}

export function getSchema(target: object): ValidationSchema<any> {
  // Si querés soportar herencia, podés hacer merge subiendo por getPrototypeOf
  return Reflect.getMetadata(SCHEMA_KEY, target) || {};
}

export function IsRequired(): PropertyDecorator {
  return (target, propertyKey) => addRule(target, propertyKey as string, { isRequired: true });
}

export function IsNotEmpty(): PropertyDecorator {
  return (target, propertyKey) => addRule(target, propertyKey as string, { isNotEmpty: true });
}

export function IsNumber(
  rules: { isZero?: boolean; type?: NumberSchema } | boolean = true
): PropertyDecorator {
  return (target, propertyKey) => addRule(target, propertyKey as string, { isNumber: rules });
}

export function MinLength(length: number): PropertyDecorator {
  return (target, propertyKey) => addRule(target, propertyKey as string, { minLength: length });
}

export function MaxLength(length: number): PropertyDecorator {
  return (target, propertyKey) => addRule(target, propertyKey as string, { maxLength: length });
}

export function IsEmail(): PropertyDecorator {
  return (target, propertyKey) => addRule(target, propertyKey as string, { isEmail: true });
}

export function IsMin(min: number): PropertyDecorator {
  return (target, propertyKey) => addRule(target, propertyKey as string, { isMin: min });
}

export function NestedSchema(schema: ValidationSchema<any>): PropertyDecorator {
  return (target, propertyKey) =>
    addRule(target, propertyKey as string, { isObject: true, nestedSchema: schema });
}

// Escotilla de escape para cualquier regla que no tenga decorador propio todavía
export function Rule(rule: Partial<ValidationRule>): PropertyDecorator {
  return (target, propertyKey) => addRule(target, propertyKey as string, rule);
}

export function validate<T extends object>(
  instance: T,
  options?: { strict?: boolean; output?: OutputType }
) {
  const schema = getSchema(Object.getPrototypeOf(instance));
  return runSchemaValidation(instance, schema, options);
}

export function Schema(defaultOptions?: { strict?: boolean; output?: OutputType }) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      validate(overrideOptions?: { strict?: boolean; output?: OutputType }) {
        const schema = getSchema(constructor.prototype);
        return runSchemaValidation(this, schema, overrideOptions ?? defaultOptions);
      }
    };
  };
}
