const { Kafka } = require('kafkajs');

class KafkaJS {

    constructor({ clientId, brokers }) {
        this.clientId = clientId;
        this.brokers = brokers;
        this.client = new Kafka({ clientId: this.clientId, brokers: this.brokers });
        this.producer;
        this.consumer;
        this.topic;
        this.msg = null;
    }

    //* ADMIN
    async createTopics(topics) {
        const admin = this.kafka.admin();
        await admin.createTopics({ topics, waitForLeaders: true })
        return await admin.listTopics()
    }

    //* PRODUCER

    async connectProducer() {
        this.producer = this.client.producer();
        return await this.producer.connect();
    }

    async sendMsg({ topic, msg }) {
        if (!this.producer) throw 'KafkaJS: error. First connect as producer.'
        return await this.producer.send({ topic, messages: [{ value: JSON.stringify(msg) }] })
    }

    //* CONSUMER

    async connectConsumer({ groupId, topic, fromBeginning, consumerConfig }) {
        this.consumer = this.client.consumer({ groupId })
        this.topic = topic
        await this.consumer.connect()
        await this.consumer.subscribe({ topic, fromBeginning: fromBeginning || true })
        this.consumer.run({
            ...consumerConfig,
            partitionsConsumedConcurrently: 1,
            eachMessage: async ({ topic, partition, message }) => {
                this.msg = { topic, partition, message }
                this.consumer.pause([{ topic: this.topic }])
                return
            }
        })
    }

    async getMsg() {
        if (this.msg === null) throw 'KafkaJS: No Message'
        else return this.msg
    }

    async msgHandled() {
        this.msg = null
        return this.consumer.resume([{ topic: this.topic }])
    }
}

module.exports = { KafkaJS }