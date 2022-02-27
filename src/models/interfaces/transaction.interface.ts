
export default interface ITransaction {
  id?: string;
  identifier?: string;
  currency?: string;
  amount?: number;
  iban?: string;
  date?: string;
  description?: string;
}
