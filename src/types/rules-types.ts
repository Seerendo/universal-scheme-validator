import { ValidationRule } from "../interfaces";

/**
 * Specify the type of number expected.
 */
export type NumberSchema = "integer" | "float" | "bigint";

/**
 * Defines the validation output type.
 */
export type OutputType = "exception" | "record";

/**
 * Defines the primitive data type the value must belong to.
 */
export type PrimitiveType = "string" | "number" | "boolean";

/**
 * Defines the validation options for paths.
 */
export type PathValidationOptions = {
  /**
   * Do not allow spaces in the path.
   */
  noSpaces?: boolean;

  /**
   * Do not allow trailing slash ("/") in the path.
   */
  noTrailingSlash?: boolean;

  /**
   * Do not allow an empty path or just "/".
   */
  notEmpty?: boolean;

  /**
   * Do not allow query strings (if the input is a full URL).
   */
  noQuery?: boolean;
};

/**
 * Defines the expected data structure for JSON validation.
 */
export type ExpectedStructure = {
  [key: string]: ValidationRule | ExpectedStructure;
};
