import { RedisAdapter } from "@grammyjs/storage-redis"

import type { ApiCallFn } from "grammy"

import type { RawApi } from "node_modules/grammy/out/core/client"

import type { Container } from "tests/container"
import { createBot } from "~/bot"

type TupleToObject<T extends any[]> = Omit<T, keyof any[]>

type TupleToObjectWithPropNames<
  T extends any[],
  N extends Record<keyof TupleToObject<T>, PropertyKey>,
> =
  { [K in keyof TupleToObject<T> as N[K]]: T[K] }

type ApiRequest<R extends RawApi> = TupleToObjectWithPropNames<
  Parameters<ApiCallFn<R>>,
  ["method", "payload", "signal"]
>

export type RawApiRequest = ApiRequest<RawApi>

/** Common setup and teardown process for testing */
export function setupTestEnv(outgoing: ApiRequest<RawApi>[], container: Container) {
  const { redis, logger, prisma } = container
  const bot = createBot("test", {
    container,
    sessionStorage: new RedisAdapter({
      instance: redis,
    }),
  })

  beforeAll(async () => {
    bot.api.config.use((prev, method, payload, signal) => {
      outgoing.push({ method, payload, signal })
      return { ok: true, result: true } as ReturnType<ApiCallFn<RawApi>>
    })

    bot.botInfo = {
      id: 42,
      first_name: "Test Bot",
      is_bot: true,
      username: "bot",
      can_join_groups: true,
      // to support testing, allow bot to read all messages in groups. (might not be needed)
      can_read_all_group_messages: true,
      supports_inline_queries: false,
      can_connect_to_business: false,
      has_main_web_app: false,
    }
    await bot.init()

    await prisma.$connect()

    logger.trace("Initialized test bot")
  }, 5000)

  afterAll(async () => {
    await bot.stop()
    await redis.quit()
  })

  return bot
}
