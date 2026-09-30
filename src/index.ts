export * from './interfaces';
export * from './validators';
export * from './errors';
export * from './rules';
export * from './functions';
export * from './types';
export * from './helpers';
import {
  IsEmail,
  IsMin,
  IsNumber,
  IsRequired,
  MaxLength,
  MinLength,
  Schema,
  validate,
} from './decorators/schema_builder';
import { ValidationSchema } from './interfaces';
import { validateIsNumber } from './rules';
import { NumberSchema, OutputType } from './types';
import { runSchemaValidation } from './validators';

@Schema({ output: 'record', strict: true })
class User {
  @IsRequired()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @IsRequired()
  @IsEmail()
  email!: string;

  @IsNumber({ isZero: false })
  @IsMin(18)
  age?: number;
}

class User2 {
  declare name: string;
  declare email: string;
  declare age?: number;
  declare list: string[];
}

const schema: ValidationSchema<User2> = {
  name: {
    minLength: 3,
  },
  age: {
    isNumber: { isZero: false, type: 'integer' },
  },
  list: {
    blackList: ['item3', 'item4'],
  },
};

async function main() {
  try {
    const user = new User();
    user.name = 'Al';
    user.age = 0;

    const user2 = new User2();
    user2.name = 'Alice';

    user2.age = 25;
    user2.list = ['item3', 'item2'];

    /*     const errores = validate<User>(user, { output: 'record', strict: true });
    console.log(JSON.stringify(errores, null, 2)); */
    runSchemaValidation(user2, schema);
    console.log('Validation passed successfully');
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
}

main();
