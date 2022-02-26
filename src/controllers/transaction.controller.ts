import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { createProducer, createConsumer } from '../utils/kafka';

export default class TransactionController {
  public producer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const producer = await createProducer((err: any, report: any) => {
        if (err) {
          console.warn('Error producing', err)
        } else {
          const { topic, partition, value } = report;
          console.log(`Successfully produced record to topic "${topic}" partition ${partition} ${value}`);
        }
      });

      for (let idx = 0; idx < 10; ++idx) {
        const key = 'alice';
        const value = Buffer.from(JSON.stringify({ count: idx }));

        console.log(`Producing record ${key}\t${value}`);

        producer.produce('test1', -1, value, key);
      }

      producer.flush(10000, () => {
        producer.disconnect();
      });

      return res.status(200).send({ msg: 'success' });
    } catch (err) {
      console.log(err)
      return res.status(500).send(err);
    }
  }




  public consume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let seen = 0;
      const consumer = await createConsumer(({ key, value, partition, offset }: any) => {
        console.log(`Consumed record with key ${key} and value ${value} of partition ${partition} @ offset ${offset}. Updated total count to ${++seen}`);
      });

      consumer.subscribe(['P-0123456789_CHF']);
      consumer.consume();

      process.on('SIGINT', () => {
        console.log('\nDisconnecting consumer ...');
        consumer.disconnect();
      });

      return res.status(200).send({ msg: 'success' });
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ msg: 'pong' });
    return;
  }
}
