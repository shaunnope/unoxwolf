import { config } from "~/config"
import type { Game } from "~/game"
import { logger } from "~/logger"

import { prisma } from "~/prisma"

export const games = new Map<string, Game>()

export const container = {
  config,
  logger,
  prisma,
  games,
}

export type Container = typeof container
