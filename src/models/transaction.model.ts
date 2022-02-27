import ITransaction from './interfaces/transaction.interface';

export default class Transaction implements ITransaction {
  public id?: string;

  public identifier?: string;

  public currency?: string;

  public amount?: number;

  public iban?: string;

  public date?: string;

  public description?: string;

  constructor(data: ITransaction) {
    Object.assign(this, data);
  }
}
