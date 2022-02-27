import Kafka from 'node-rdkafka';

export default class KafkaHelper {

  // public kafkaConfig: any;

  // constructor(config: object) {
  //   this.kafkaConfig = config;
  // }
}

const ERR_TOPIC_ALREADY_EXISTS = 36;

function createProducer( onDeliveryReport: any): Promise<Kafka.Producer> {
  const producer = new Kafka.Producer({
    'bootstrap.servers': 'pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092',
    'sasl.username': 'FHEQH3N2QHTV5BFX',
    'sasl.password': 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp',
    'security.protocol': 'sasl_ssl',
    'sasl.mechanisms': 'PLAIN',
    'dr_msg_cb': true
  });

  return new Promise((resolve, reject) => {
    producer
      .on('ready', () => resolve(producer))
      .on('delivery-report', onDeliveryReport)
      .on('event.error', (err) => {
        console.warn('event.error', err);
        reject(err);
      });
    producer.connect();
  });
}

function createConsumer(onData: any): Promise<Kafka.KafkaConsumer> {
  const consumer = new Kafka.KafkaConsumer({
    'bootstrap.servers': 'pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092',
    'sasl.username': 'FHEQH3N2QHTV5BFX',
    'sasl.password': 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp',
    'security.protocol': 'sasl_ssl',
    'sasl.mechanisms': 'PLAIN',
    'group.id': 'node-example-group-1'
  }, {
    'auto.offset.reset': 'earliest'
  });

  return new Promise((resolve, reject) => {
    consumer
      .on('ready', () => resolve(consumer))
      .on('data', onData);

    consumer.connect();
  });
}

function ensureTopicExists(topic: string) {
  const adminClient = Kafka.AdminClient.create({
    'bootstrap.servers': 'pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092',
    'sasl.username': 'FHEQH3N2QHTV5BFX',
    'sasl.password': 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp',
    'security.protocol': 'sasl_ssl',
    'sasl.mechanisms': 'PLAIN'
  });

  return new Promise((resolve, reject) => {
    adminClient.createTopic({
      topic: topic, // user account
      num_partitions: 1,
      replication_factor: 3
    }, (err) => {
      if (!err) {
        console.log(`Created topic ${topic}`);
        return resolve(topic);
      }

      if (err.code === ERR_TOPIC_ALREADY_EXISTS) {
        return resolve(topic);
      }

      return reject(err);
    });
  });
}

export { createProducer, createConsumer, ensureTopicExists }