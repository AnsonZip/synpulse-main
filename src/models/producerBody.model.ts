import IProducerBody from './interfaces/producerBody.interface';
import { IsInt, Min, IsString, IsIn, IsNotEmpty } from 'class-validator';
import { currencyList } from '../config/dev.config';

export default class ProducerBody implements IProducerBody {
  @IsNotEmpty()
  @IsString()
  @IsIn(currencyList)
  public currency: string;

  @IsInt()
  @Min(0)
  public numberOfTransactions: number;

  constructor(data: ProducerBody) {
    this.currency = data.currency;
    
    this.numberOfTransactions = data.numberOfTransactions;
  }
}
