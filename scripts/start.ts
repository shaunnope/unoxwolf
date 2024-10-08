#!/usr/bin/env tsx
import Redis from 'ioredis'
import { RedisAdapter } from "@grammyjs/storage-redis";
import { Role } from "@prisma/client";
import { onShutdown } from "node-graceful-shutdown";
import { createBot } from "~/bot";
import { container } from "~/container";
import { createServer } from "~/server";

try {
  const { config, logger, prisma } = container;
  const redis = new Redis(config.REDIS_URL);
  const bot = createBot(config.BOT_TOKEN, {
    container,
    sessionStorage: new RedisAdapter({
      instance: redis,
    }),
  });
  await bot.init();

  const server = await createServer(bot, container);

  // Graceful shutdown
  onShutdown(async () => {
    logger.debug("shutdown");

    await bot.stop();
    await server.close();
  });

  await prisma.$connect();

  // update bot admins role
  await Promise.all(
    config.BOT_ADMIN_USER_ID.map(async (id) => {
      await prisma.user.upsert({
        where: prisma.user.byTelegramId(id),
        create: {
          telegramId: id,
          role: Role.ADMIN,
        },
        update: {
          role: Role.ADMIN,
        },
      });
    })
  )

  await prisma.user.upsert({
    where: prisma.user.byTelegramId(config.BOT_OWNER_USER_ID),
    create: {
      telegramId: config.BOT_OWNER_USER_ID,
      role: Role.ADMIN,
    },
    update: {
      role: Role.ADMIN,
    },
  });


  if (config.isProd) {
    await server.listen({
      host: config.BOT_SERVER_HOST,
      port: config.BOT_SERVER_PORT,
    });

    await bot.api.setWebhook(config.BOT_WEBHOOK, {
      allowed_updates: config.BOT_ALLOWED_UPDATES,
    });
  } else if (config.isDev) {
    await bot.start({
      allowed_updates: config.BOT_ALLOWED_UPDATES,
      onStart: ({ username }) =>
        logger.debug({
          msg: "bot running...",
          username,
        }),
    });
  }
} catch (error) {
  container.logger.error(error);
  process.exit(1);
}
