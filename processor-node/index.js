const amqplib = require('amqplib');

(async () => {
  const queue = 'store';
  const loggerQueue = "logger"
  console.log('connecting to rabbitmq');
  const conn = await amqplib.connect('amqp://localhost');

  const channel = await conn.createChannel();
  await channel.assertQueue(queue);
  await channel.assertQueue(loggerQueue);


  console.log('connected to '+ queue +' queue, waiting for messages...');

  // Listener
  channel.consume(queue, (msg) => {
    if (msg == null) {
        console.log('Consumer cancelled by server');
        return;
    }

    const content = msg.content.toString()

    console.log('Recieved:', content);
    channel.ack(msg); // inform to queue that the payload have been processed
    
    const lead = JSON.parse(content);

    const logMsg = {msg: "Node processed", "id": lead.id}
    
    channel.sendToQueue(loggerQueue, Buffer.from(JSON.stringify(logMsg)))
    
  });
})();