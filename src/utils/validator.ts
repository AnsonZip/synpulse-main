import { validate } from 'class-validator';
import ValidateError from '../models/validateError.model';

export async function toValidate(body: any): Promise<ValidateError[]> {
  return validate(body).then(errors => {
    
    if (errors.length > 0) {
      let errMsg: ValidateError[] = [];
      errors.forEach(error => {
        // console.log(error);
        const err = {
          field: error.property,
          msg: Object.values(error.constraints as object)
        }

        errMsg.push(err);
      });

      return errMsg;
    }

    return [];
  });
}