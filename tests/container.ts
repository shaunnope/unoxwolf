import Redis from 'ioredis'

import { config } from '~/config'
import { prisma } from '~/prisma'
import type { Game } from '~/game'

import { buildLogger } from '~/logger'

const logger = buildLogger(true)

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
