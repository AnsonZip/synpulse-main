import { NextFunction } from 'connect';
import { Request, Response } from 'express';
// import { toValidate } from '../utils/validator';
import User from '../models/user.model';
import UserService from '../services/user.services';
import * as kafka from 'kafka-node';

export default class UserController {

  public static readonly collectionName: string = 'users';

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userService: UserService = new UserService(UserController.collectionName)
      let user: User = new User(req.body);

      // const msg = await toValidate(user);
      // console.log('msg', msg);

      const data = await userService.create(user);
      return res.status(200).send(data);
    } catch (err) {
      console.log('controller', err)
      return res.status(200).send(err)
    }
  }

  public producer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = new kafka.KafkaClient({
        kafkaHost: 'pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092',
        sasl: {
          mechanism: 'plain',
          username: 'FHEQH3N2QHTV5BFX',
          password: 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp'
        }
      });
      client.on('error', (err) => {
        console.log('client', err);
      });

      // const topicsToCreate = [
      //   {
      //     topic: 'topic1',
      //     partitions: 1,
      //     replicationFactor: 2
      //   }
      // ]
      // await new Promise((resolve, reject) => {
      //   client.createTopics(topicsToCreate, (error, result) => {
      //     if (error) {
      //       console.log('createTopicsError', error);
      //       return reject(error);
      //     }
      //     if (result) {
      //       console.log('createTopicsResult', result)
      //       return resolve(result);
      //     }
      //   });
      // })

      // const producer = new kafka.Producer(client);
      // const payloads = [
      //   { topic: 'topic1', messages: 'hi', partition: 0 },
      //   { topic: 'topic1', messages: ['hello', 'world'] }
      // ]
      // producer.on('ready', function () {
      //   console.log(`connected to kafka`);
      //   producer.send(payloads, function (err, data) {
      //     console.log(data);

      //   });
      // });
      const transArray: any[] = [
        'test1',
        'test2',
        'test3',
        'test4'
      ]
      const producer = new kafka.Producer(client);
      producer.on('ready', () => {
        console.log(`connected to kafka`);
        let tranNumSentToKafka = 0
        for (let index = 0; index < transArray.length; index++) {
          const element = JSON.stringify(transArray[index])
          console.log(`sending data to kafka`);
          producer.send([{
            topic: 'confluent',
            messages: element
          }],
            (err, data) => {
              if (err) { console.error(err) }
              else {
                tranNumSentToKafka += 1
                console.log(`data sent: ${JSON.stringify(data)}`);
                console.log(`sent ${tranNumSentToKafka} transactions to kafka`);
              }
            })
        }
      })

      producer.on('error', function (err) {
        return res.status(200).send(err)
      });

      return res.status(200).send({ msg: 'success' });
    } catch (err) {
      console.log('controller', err)
      return res.status(200).send(err)
    }
  }

  public createTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = new kafka.KafkaClient({
        kafkaHost: 'pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092',
        sasl: {
          mechanism: 'plain',
          username: 'FHEQH3N2QHTV5BFX',
          password: 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp'
        }
      });

      const topicsToCreate = [{
        topic: 'topic1',
        partitions: 1,
        replicationFactor: 2
      },
      {
        topic: 'topic2',
        partitions: 5,
        replicationFactor: 3,
        // Optional set of config entries
        configEntries: [
          {
            name: 'compression.type',
            value: 'gzip'
          },
          {
            name: 'min.compaction.lag.ms',
            value: '50'
          }
        ],
        // Optional explicit partition / replica assignment
        // When this property exists, partitions and replicationFactor properties are ignored
        replicaAssignment: [
          {
            partition: 0,
            replicas: [3, 4]
          },
          {
            partition: 1,
            replicas: [2, 1]
          }
        ]
      }];

      const result = await new Promise((resolve, reject) => {
        client.createTopics(topicsToCreate, (error, result) => {
          // result is an array of any errors if a given topic could not be created
          if (!error) {
            return resolve(result);
          }

          return reject(error);
        });
      });

      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  public consume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = await this.createClient();

      // const consumer = new kafka.Consumer(client, [
      //   { topic: '', partition: 0 }
      // ], { autoCommit: false });
      return res.status(200).send({ msg: 'success', client });
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  createClient(): Promise<kafka.KafkaClient> {
    const client = new kafka.KafkaClient({
      kafkaHost: 'pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092',
      sasl: {
        mechanism: 'plain',
        username: 'FHEQH3N2QHTV5BFX',
        password: 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp'
      }
    });

    return new Promise((resolve, reject) => {
      client.on('ready', () => resolve(client));
      client.connect();
    });
  }

  public healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ msg: 'pong' });
    return;
  }
}

