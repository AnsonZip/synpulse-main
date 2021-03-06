import Kafka from 'node-rdkafka';
import { kafkaConfig } from '../config/dev.config';

const ERR_TOPIC_ALREADY_EXISTS = 36;

function createProducer(onDeliveryReport: any): Promise<Kafka.Producer> {
  const producer = new Kafka.Producer({
    'bootstrap.servers': kafkaConfig.servers,
    'sasl.username': kafkaConfig.username,
    'sasl.password': kafkaConfig.password,
    'security.protocol': 'sasl_ssl',
    'sasl.mechanisms': 'PLAIN',
    'dr_msg_cb': true
  });

  return new Promise((resolve, reject) => {
    producer
      .on('ready', () => resolve(producer))
      .on('delivery-report', onDeliveryReport)
      .on('event.error', (err) => {
        reject(err);
      });
      
    producer.connect();
  });
}

function createConsumer(): Promise<Kafka.KafkaConsumer> {
  const consumer = new Kafka.KafkaConsumer({
    'bootstrap.servers': kafkaConfig.servers,
    'sasl.username': kafkaConfig.username,
    'sasl.password': kafkaConfig.password,
    'security.protocol': 'sasl_ssl',
    'sasl.mechanisms': 'PLAIN',
    'group.id': 'node-example-group-1'
  }, {
    'auto.offset.reset': 'earliest'
  });

  return new Promise((resolve, reject) => {
    consumer.on('ready', () => resolve(consumer));
    consumer.connect();
  });
}

function ensureTopicExists(topic: string) {
  const adminClient = Kafka.AdminClient.create({
    'bootstrap.servers': kafkaConfig.servers,
    'sasl.username': kafkaConfig.username,
    'sasl.password': kafkaConfig.password,
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