const amqplib = require('amqplib');

(async () => {
  const queue = 'payloads';
  console.log('connecting to rabbitmq');
  const conn = await amqplib.connect('amqp://localhost');

  const channel = await conn.createChannel();
  await channel.assertQueue(queue);

  console.log('connected, waiting for messages...');

  // Listener
  channel.consume(queue, (msg) => {
    if (msg == null) {
        console.log('Consumer cancelled by server');
    }

    console.log('Recieved:', msg.content.toString());
    channel.ack(msg); // inform to queue that the payload have been processed
  });
})();