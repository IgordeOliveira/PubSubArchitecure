const fastify = require('fastify')({
    logger: true
  })
const rabbit = require('amqplib');

async function send(payload){
    const QUEUE_NAME = 'payloads';
    const conn = await rabbit.connect('amqp://localhost');

    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    const payloadbuffer = Buffer.from(JSON.stringify(payload));
    
    channel.sendToQueue(QUEUE_NAME, Buffer.from(payloadbuffer))
    fastify.log.info('Sent to ' + QUEUE_NAME + " queue");
}

module.exports = {
    send
}