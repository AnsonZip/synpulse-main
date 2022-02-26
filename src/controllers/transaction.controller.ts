import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { Kafka } from 'kafkajs';
//import Kafka from 'node-rdkafka';

export default class TransactionController {
  public consume = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092'],
        sasl: {
          mechanism: 'plain',
          username: 'FHEQH3N2QHTV5BFX',
          password: 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp'
        }
      });

      const consumer = kafka.consumer({ groupId: 'test-group' });
      await consumer.connect()
      await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value ? message.value.toString() : null,
          })
        },
      })

      return res.status(200).send({ msg: 'success' });
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  // public consume = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     let seen = 0;
  //     const consumer = await this.createConsumer(({ key, value, partition, offset }: any) => {
  //       console.log(`Consumed record with key ${key} and value ${value} of partition ${partition} @ offset ${offset}. Updated total count to ${++seen}`);
  //     });

  //     consumer.subscribe(['P-0123456789_CHF']);
  //     consumer.consume();

  //     process.on('SIGINT', () => {
  //       console.log('\nDisconnecting consumer ...');
  //       consumer.disconnect();
  //     });

  //     return res.status(200).send({ msg: 'success' });
  //   } catch (err) {
  //     return res.status(500).send(err);
  //   }
  // }

  // createConsumer(onData: any): Promise<Kafka.KafkaConsumer> {
  //   const consumer = new Kafka.KafkaConsumer({
  //     'bootstrap.servers': 'pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092',
  //     'sasl.username': 'FHEQH3N2QHTV5BFX',
  //     'sasl.password': 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp',
  //     'security.protocol': 'sasl_ssl',
  //     'sasl.mechanisms': 'PLAIN',
  //     'group.id': 'node-example-group-1'
  //   }, {
  //     'auto.offset.reset': 'earliest'
  //   });

  //   return new Promise((resolve, reject) => {
  //     consumer
  //       .on('ready', () => resolve(consumer))
  //       .on('data', onData);

  //     consumer.connect();
  //   });
  // }
}
