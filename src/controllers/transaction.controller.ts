import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { createProducer, createConsumer, ensureTopicExists } from '../utils/kafka';
import { genTransaction } from '../utils/helper';
import Transaction from '../models/transaction.model';
import RequestBody from '../models/requestBody.model';
import Logger from '../utils/logger';
import { toValidate } from '../utils/validator';
import { DeliveryReport, LibrdKafkaError, Message } from 'node-rdkafka';

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
      const currencyAccount = `${identity}_${body.currency}`;

      let transactions: Transaction[] = [];
      const consumer = await createConsumer();

      consumer.on('data', ({ key, value, partition, offset }: Message) => {
        const msgValue = JSON.parse(value as any);

        transactions.push(new Transaction({
          ...msgValue,
          id: key?.toString()
        }));
      });

      consumer.subscribe([currencyAccount]);
      consumer.consume(body.numberOfTransactions);

      return setTimeout(() => {
        let totalAmount = 0;
        transactions.forEach(t => {
          totalAmount += t.amount;
        });

        consumer.disconnect();

        return res.status(200).send({
          msg: 'success',
          numberOfTransactions: transactions.length,
          currency: body.currency,
          totalAmount: totalAmount,
          transactions: transactions
        });
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
