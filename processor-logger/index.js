const amqplib = require('amqplib');

(async () => {
  const loggerQueue = "logger"
  console.log('connecting to rabbitmq');
  const conn = await amqplib.connect('amqp://localhost');

  const channel = await conn.createChannel();
  await channel.assertQueue(loggerQueue);


  console.log('connected to '+ loggerQueue +' queue, waiting for messages...');

  // Listener
  channel.consume(loggerQueue, (msg) => {
    if (msg == null) {
        console.log('Consumer cancelled by server');
        return;
    }

    const content = msg.content.toString()
    let log = JSON.parse(content);

    log = `[${log.id}] ${log.msg}`

    console.log(log);
    channel.ack(msg); // inform to queue that the payload have been processed
    
  });
})();