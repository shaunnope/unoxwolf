import pino from 'pino'
import Redis from 'ioredis'

import { parseConfig } from '~/config'
import { prisma } from '~/prisma'
import type { Game } from '~/game'

const config = parseConfig(process.env)

config.isDev = true

const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    targets: [
      ...(config.isDev
        ? [
            {
              target: 'pino-pretty',
              level: config.LOG_LEVEL,
              options: {
                ignore: 'pid,hostname',
                colorize: true,
                translateTime: true,
              },
            },
          ]
        : [
            {
              target: 'pino/file',
              level: config.LOG_LEVEL,
              options: {},
            },
          ]),
    ],
  },
})

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
