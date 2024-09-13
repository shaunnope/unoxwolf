import Redis from "ioredis"

import { config } from "~/config"
import type { Game } from "~/game"
import { buildLogger, logger } from "~/logger"

import { buildPrisma } from "~/prisma"

const serverLogger = buildLogger("error")
const prisma = buildPrisma(serverLogger)

const redis = new Redis(config.REDIS_URL)
const games = new Map<string, Game>()

export const container = {
  config,
  logger,
  prisma,
  redis,
  games,
}

export type Container = typeof container
