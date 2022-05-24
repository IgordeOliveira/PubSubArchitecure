'use strict'

const queue = require("../../controllers/queue")

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
      await queue.send(request.body)
      reply.code(202).send({
        success: true,
        data: {}
      })
    })
}
