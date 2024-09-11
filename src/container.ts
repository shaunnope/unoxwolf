import { config } from "~/config"
import type { Game } from "~/game"
import { logger } from "~/logger"

import type { PrismaClientX } from "~/prisma"
import { prisma } from "~/prisma"

export const games = new Map<string, Game>()

export const container = {
  config,
  logger,
  prisma: prisma as PrismaClientX,
  games,
}

export type Container = typeof container
