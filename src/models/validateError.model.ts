import IValidateError from './interfaces/validateError.interface';

export default class ValidateError implements IValidateError {
  public field?: string;

  public msg?: string[];

  constructor(data: ValidateError) {
    Object.assign(this, data);
  }
}
