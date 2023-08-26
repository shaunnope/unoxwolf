import Redis from 'ioredis'
import { config } from '~/config'
import { logger } from '~/logger'
import { prisma } from '~/prisma'

import type { Game } from '~/game'

export const redis = new Redis(config.REDIS_URL)
export const games = new Map<string, Game>()

export const container = {
  config,
  logger,
  prisma,
  redis,
  games,
}

export type Container = typeof container
