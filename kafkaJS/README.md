# KAFKAJS

Create a Server with docker and handle messages on simple way.

## How To Use

> For the server set-up make sure installed Docker. After than run `sudo docker-compose up` command.

- First, push a message.

> Install kafkajs in your project. `npm install kafkajs`

```js
// producer.js

const { KafkaJS } = require("./index");

(async () => {
  const kafka = new KafkaJS({ clientId: "classTester", brokers: ["KAFKA-SERVER-IP:9092"] }); //TODO: Enter Kafka Server ip address.
  
  // if topic is doesn't exist use the code below.
  // await kafka.createTopics([{ topic: "testTopic", numPartitions: 1 }]);

  await kafka.connectProducer();
  await kafka.sendMsg({ topic: "testTopic", msg: { about: "This is a test message.", date: Date.now() } });
})();
```

- Second, is read the message.

```js
// consumer.js

(async () => {
  const kafka = new KafkaJS({ clientId: "classTester", brokers: ["KAFKA-SERVER-IP:9092"] }); //TODO: Enter Kafka Server ip address.
  await kafka.connectConsumer({ groupId: "test-group", topic: "testTopic" });
  setInterval(async () => {
    let msg = await kafka.getMsg();
    console.log(">>> msg: \n", msg);
    await kafka.msgHandled(); // This is to keep getting messages. If doesn't use this function, You're taken every time same message.
  }, 10000);
})();
```
