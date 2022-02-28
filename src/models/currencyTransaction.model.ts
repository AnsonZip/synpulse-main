import ICurrencyTransaction from './interfaces/currencyTransaction.interface';
import Transaction from './transaction.model';

export default class CurrencyTransaction implements ICurrencyTransaction {
  public currency?: string;

  public amount?: number;

  public transactions?: Transaction[];

  constructor(data: ICurrencyTransaction) {
    Object.assign(this, data);
  }
}
