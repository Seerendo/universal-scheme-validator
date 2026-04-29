export class ValidationError extends Error {
  public errors: Record<string, string[]> | string[] | string;

  /**
   * Creates an instance of ValidationError
   *
   * @param errors An object with the found validation errors
   * @example
   * const errors = {
   *   name: ['The name is required'],
   *   email: ['The email is required', 'The email is not valid'],
   * }
   * const error = new ValidationError(errors);
   * console.log(error.message); // 'Validation Error'
   * console.log(error.errors): Record<string, string[]>; // { name: ['The name is required'], email: ['The email is required', 'The email is not valid'] }
   * console.log(error.errors): string[]; // ['The email is required', 'The email is not valid']
   * console.log(error.errors): string; // 'The email is required'
   */
  constructor(errors: Record<string, string[]> | string[] | string) {
    super('Validation Error');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
