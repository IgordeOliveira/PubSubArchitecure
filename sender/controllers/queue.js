const fastify = require('fastify')({
    logger: true
  })
const rabbit = require('amqplib');

async function send(payload){
    const EXCHANGE_NAME = 'payloads';
    const conn = await rabbit.connect('amqp://localhost');

    const channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "fanout")
    await channel.assertQueue("store")
    await channel.assertQueue("validateInfo")
    await channel.assertQueue("editImage",{ durable: false})

    channel.bindQueue("store", EXCHANGE_NAME)
    channel.bindQueue("validateInfo", EXCHANGE_NAME)
    channel.bindQueue("editImage", EXCHANGE_NAME)


    const payloadbuffer = Buffer.from(JSON.stringify(payload));

    channel.publish(EXCHANGE_NAME, '', Buffer.from(payloadbuffer))
    fastify.log.info('Sent to ' + EXCHANGE_NAME + " exchange");
}

module.exports = {
    send
}