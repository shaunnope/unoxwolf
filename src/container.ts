import { config } from '~/config'
import { logger } from '~/logger'
import { prisma, PrismaClientX } from '~/prisma'

import type { Game } from '~/game'

export const games = new Map<string, Game>()

export const container = {
  config,
  logger,
  prisma: prisma as PrismaClientX,
  games,
}

export type Container = typeof container
