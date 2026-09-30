import { InferValidationSchema } from './interfaces';
import { ValidationSchema } from './interfaces/validation-rule';
import { defineValidationSchema } from './validators';

export * from './interfaces';
export * from './validators';
export * from './errors';
export * from './rules';
export * from './functions';
export * from './types';
export * from './helpers';

const userSchema = defineValidationSchema({
  name: {
    isString: true,
    isRequired: true,
  },
});

type User = InferValidationSchema<typeof userSchema>;

function main() {
  try {
    console.log('Universal Scheme Validator');
    const user: User = {
      name: '',
    };

    userSchema.validate(user);
  } catch (error) {
    console.error('Validation failed:', JSON.stringify(error, null, 2));
  }
}

main();
