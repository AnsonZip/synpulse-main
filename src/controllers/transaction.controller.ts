import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { createProducer, createConsumer, ensureTopicExists } from '../utils/kafka';
import { genTransaction } from '../utils/helper';
import Transaction from '../models/transaction.model';
import CurrencyTransaction from '../models/currencyTransaction.model';
import RequestBody from '../models/requestBody.model';
import { currencyList } from '../config/dev.config';
import Logger from '../utils/logger';
import { toValidate } from '../utils/validator';
import { DeliveryReport, LibrdKafkaError } from 'node-rdkafka';

export default class TransactionController {
  public producer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // verify req body
      const body = new RequestBody(req.body);
      const errMsg = await toValidate(body);
      if (errMsg.length > 0) {
        throw (errMsg);
      }

      const identity = req.cookies.identity;
      const currencyAccount = `${identity}_${body.currency}`;
      await ensureTopicExists(currencyAccount);

      const producer = await createProducer((err: LibrdKafkaError, report: DeliveryReport) => {
        if (err) {
          console.warn('Error producing', err);
          throw (err);
        } else {
          const { topic, partition, value } = report;
          console.log(`Successfully produced record to topic '${topic}' partition ${partition} ${value}`);
        }
      });

      for (let idx = 0; idx < body.numberOfTransactions; ++idx) {
        const t = genTransaction(body.currency);
        producer.produce(currencyAccount, -1, t.value, t.key);
      }

      producer.flush(10000, () => {
        producer.disconnect();
      });

      return res.status(200).json({
        msg: 'success',
        numberOfTransactions: body.numberOfTransactions
      });
    } catch (err) {
      Logger.loggerInstance.error(err);
      return res.status(500).send(err);
    }
  }

  public consume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // verify req body
      const body = new RequestBody(req.body);
      const errMsg = await toValidate(body);
      if (errMsg.length > 0) {
        throw (errMsg);
      }
      
      const identity = req.cookies.identity;
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
        let currencyTransactions: CurrencyTransaction[] = [];
        currencyList.map(currency => {
          let amount = 0;
          let currencyTransaction = transactions.filter(t => t.currency === currency);
          currencyTransaction.forEach(t => {
            amount += t.amount;
          });

          let transactionList = new CurrencyTransaction({
            currency: currency,
            amount: amount,
            transactions: currencyTransaction
          });

          currencyTransactions.push(transactionList);
        });


        return res.status(200).json({ msg: 'success', numOfRecords: seen, data: currencyTransactions });
      }, 2000);
    } catch (err) {
      Logger.loggerInstance.error(err);
      return res.status(500).send(err);
    }
  }

  public healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ msg: 'pong' });
    } catch (err) {
      Logger.loggerInstance.error(err);
      return res.status(500).send(err);
    }
  }
}
