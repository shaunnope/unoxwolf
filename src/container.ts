import Redis from "ioredis";
import { config } from "~/config";
import { createLogger } from "~/logger";
import { createPrisma } from "~/prisma";

import type { Game } from "~/game";

export const createAppContainer = () => {
  const logger = createLogger(config);
  const prisma = createPrisma(logger);
  const redis = new Redis(config.REDIS_URL);
  const games = new Map<string, Game>();

  return {
    config,
    logger,
    prisma,
    redis,
    games,
  };
};

export type Container = ReturnType<typeof createAppContainer>;