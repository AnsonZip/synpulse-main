import ITransaction from './transaction.interface'

export default interface ICurrencyTransaction {
  currency?: string;
  amount?: number;
  transactions?: ITransaction[];
}
