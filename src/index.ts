export * from "./interfaces";
export * from "./validators";
export * from "./errors";
export * from "./rules";
export * from "./functions";
export * from "./types";
export * from "./helpers";
import { ValidationSchema } from "./interfaces";
import { runSchemaValidation } from "./validators";

class User {
  declare name: string;
}

const schema: ValidationSchema<User> = {
  name: {
    minLength: 3,
  },
};

async function main() {
  try {
    const user = new User();
    user.name = "Ro";
    runSchemaValidation(user, schema);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
}

main();
