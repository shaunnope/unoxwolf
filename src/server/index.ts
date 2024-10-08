import fastify from "fastify"
import { BotError, webhookCallback } from "grammy"
import { register } from "prom-client"
import type { Bot } from "~/bot"
import { errorHandler } from "~/bot/handlers"
import type { Container } from "~/container"

export async function createServer(bot: Bot, container: Container) {
  const { logger, prisma } = container

  const server = fastify({
    loggerInstance: logger,
  })

  server.setErrorHandler(async (error, req, res) => {
    if (error instanceof BotError) {
      errorHandler(error)

      await res.code(200).send({})
    }
    else {
      logger.error(error)

      await res.status(500).send({ error: "Oops! something went wrong." })
    }
  })

  server.post(`/${bot.token}`, webhookCallback(bot, "fastify"))

  server.get(`/${bot.token}/metrics`, async (req, res) => {
    try {
      const appMetrics = await register.metrics()
      const prismaMetrics = prisma.$metrics !== undefined ? await prisma.$metrics.prometheus() : ""
      const metrics = appMetrics + prismaMetrics

      await res.header("Content-Type", register.contentType).send(metrics)
    }
    catch (err) {
      await res.status(500).send(err)
    }
  })

  return server
}
