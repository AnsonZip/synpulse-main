import { v4 as uuidv4 } from 'uuid';
import uniqid from 'uniqid';
import Transaction from '../models/transaction.model';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function genTransaction(currency: string) {
  const key = uniqid();

  const transaction = new Transaction({
    identifier: uuidv4(),
    currency: currency,
    amount: getRandomInt(-500, 1000),
    iban: 'CH93-0000-0000-0000-0000-0',
    date: new Date().toISOString().slice(0, 10),
    description: `Online Banking ${currency}`
  })
  const value = Buffer.from(JSON.stringify(transaction));

  return { value, key };
}

export { getRandomInt, genTransaction }