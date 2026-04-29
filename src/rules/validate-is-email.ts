import { ValidationError } from "../errors";
import { OutputType } from "../types";

/**
 * Validates if the value is a valid email.
 *
 * An email is valid if:
 *
 * 1. It is a text string.
 * 2. It is not empty.
 * 3. It contains exactly one '@' symbol.
 * 4. The part before the '@' has no more than 64 characters.
 * 5. The part after the '@' has no more than 255 characters.
 * 6. No part of the domain has more than 63 characters.
 * 7. The email format complies with the following regular expression:
 *
 *     /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
 *
 * @param value The value to evaluate.
 * @param output The expected validation output type, of type {@link OutputType}.
 *  - `record`: Returns an array of strings representing the validation errors.
 *  - `exception`: Throws an error with validation messages.
 *
 * @returns An array of strings representing the validation errors.
 */
export function validateIsEmail(
  value: any,
  output: OutputType = "record"
): string[] {
  const errors: string[] = [];

  if (!value || value === null || value === undefined) {
    return errors;
  }

  // Verify that the value is a string
  if (typeof value !== "string") {
    const errorMessage = "Must be a text string";
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  // Verify that the email is not empty
  if (!value) {
    const errorMessage = "The email address cannot be empty.";
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  // Separate the email into two parts: before and after the '@'
  const emailParts = value.split("@");

  // Verify that there is exactly one '@'
  if (emailParts.length !== 2) {
    const errorMessage =
      "The email address must contain exactly one '@' symbol.";
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  const account = emailParts[0];
  const address = emailParts[1];

  // Verify that the part before the '@' does not have more than 64 characters
  if (account.length > 64) {
    const errorMessage =
      "The part before the '@' cannot have more than 64 characters.";
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  // Verify that the part after the '@' does not have more than 255 characters
  if (address.length > 255) {
    const errorMessage =
      "The part after the '@' cannot have more than 255 characters.";
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  // Divide the domain into parts by '.'
  const domainParts = address.split(".");

  // Verify that no part of the domain has more than 63 characters
  if (domainParts.some((part) => part.length > 63)) {
    const errorMessage =
      "No part of the domain can have more than 63 characters.";
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
      return errors;
    }
  }

  // Regular expression to check the email format
  const regExp =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  // Verify that the email format is valid
  if (!regExp.test(value)) {
    const errorMessage = "The email format is not valid.";
    if (output === "exception") {
      throw new ValidationError(errorMessage);
    } else {
      errors.push(errorMessage);
    }
  }

  return errors;
}
