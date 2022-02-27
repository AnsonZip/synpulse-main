import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { createProducer, createConsumer, ensureTopicExists } from '../utils/kafka';
import { getRandomInt } from '../utils/helper';
import { v4 as uuidv4 } from 'uuid';
import uniqid from 'uniqid';
import Transaction from '../models/transaction.model';

export default class TransactionController {
  public producer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topic = req.cookies.identity;
      const currencyList: string[] = ['GBP', 'EUR', 'CHF'];

      const promises = currencyList.map(async (currency) => {
        const currencyAccount = `${topic}_${currency}`;
        await ensureTopicExists(currencyAccount);

        const producer = await createProducer((err: any, report: any) => {
          if (err) {
            console.warn('Error producing', err)
          } else {
            const { topic, partition, value } = report;
            console.log(`Successfully produced record to topic '${topic}' partition ${partition} ${value}`);
          }
        });

        for (let idx = 0; idx < 1000; ++idx) {
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

          console.log(`Producing record ${key}\t${value}`);

          producer.produce(currencyAccount, -1, value, key);
        }

        producer.flush(10000, () => {
          producer.disconnect();
        });

        return;
      });

      await Promise.all(promises);

      return res.status(200).send({ msg: 'success' });
    } catch (err) {
      console.log('err', err)
      return res.status(500).send(err);
    }
  }

  public consume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identity = req.cookies.identity;
      const currencyList: string[] = ['GBP', 'EUR', 'CHF'];
      const currencyAccounts = currencyList.map(currency => {
        return `${identity}_${currency}`;
      });

      let seen = 0;
      let transactions: any[] = [];
      const consumer = await createConsumer(({ key, value, partition, offset }: any) => {
        const msgValue = JSON.parse(value);

        transactions.push(new Transaction({ ...msgValue, id: key.toString() }));

        console.log(`Consumed record with key ${key} and value ${value} of partition ${partition} @ offset ${offset}. Updated total count to ${++seen}`);
      });


      consumer.subscribe(currencyAccounts);
      consumer.consume();

      process.on('SIGINT', () => {
        console.log('\nDisconnecting consumer ...');
        consumer.disconnect();
      });

      return setInterval(() => {
        res.status(200).send({ msg: 'success', numOfRecords: seen, data: transactions });
      }, 2000);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ msg: 'pong' });
    return;
  }
}
