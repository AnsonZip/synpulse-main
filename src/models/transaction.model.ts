import ITransaction from './interfaces/transaction.interface';

export default class Transaction implements ITransaction {
  public id?: string;

  public identifier: string;

  public currency: string;

  public amount: number;

  public iban: string;

  public date: string;

  public description: string;

  constructor(data: ITransaction) {
    this.id = data.id;
    this.identifier = data.identifier;
    this.currency = data.currency;
    this.amount = data.amount;
    this.iban = data.iban;
    this.date = data.date;
    this.description = data.description;
  }
}
