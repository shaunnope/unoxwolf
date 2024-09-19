import Redis from "ioredis"

import { config } from "~/config"
import { games } from "~/container"
import { buildLogger, logger } from "~/logger"

import { buildPrisma } from "~/prisma"

const serverLogger = buildLogger("error")
const prisma = buildPrisma(serverLogger)

const redis = new Redis(config.REDIS_URL)

export const container = {
  config,
  logger,
  prisma,
  redis,
  games,
}

export type Container = typeof container
