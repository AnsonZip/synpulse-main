import IRequestBody from './interfaces/requestBody.interface';
import { IsInt, Min, IsString, IsIn, IsNotEmpty } from 'class-validator';
import { currencyList } from '../config/dev.config';

export default class RequestBody implements IRequestBody {
  @IsNotEmpty()
  @IsString()
  @IsIn(currencyList)
  public currency: string;

  @IsInt()
  @Min(0)
  public numberOfTransactions: number;

  constructor(data: RequestBody) {
    this.currency = data.currency;
    
    this.numberOfTransactions = data.numberOfTransactions;
  }
}
