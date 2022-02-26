import { validate, ValidationError } from 'class-validator';

const toValidate = async (object: Object): Promise<ValidationError[] | null> => {
  const abc = await validate(object).then((errors) => {
    if (errors.length > 0) {
      console.log('validate err', errors);

      return errors;
    }

    return null;
  });

  return abc;
}

export { toValidate }