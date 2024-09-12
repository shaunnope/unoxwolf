import { RedisAdapter } from "@grammyjs/storage-redis"

import type { ApiCallFn } from "grammy"

import type { RawApi } from "node_modules/grammy/out/core/client"

import { createBot } from "~/bot"
import { container } from "./container"

import { MockChat } from "./runner/chat"
import { mockUser } from "./runner/user"

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

try {
  const { redis, logger, prisma } = container
  const bot = createBot("test", {
    container,
    sessionStorage: new RedisAdapter({
      instance: redis,
    }),
  })

  let outgoingRequests: ApiRequest<RawApi>[] = []

  beforeAll(async () => {
    bot.api.config.use((prev, method, payload, signal) => {
      logger.info("Push req")
      outgoingRequests.push({ method, payload, signal })
      return { ok: true, result: true } as ReturnType<ApiCallFn<RawApi>>
    })

    bot.botInfo = {
      id: 42,
      first_name: "Test Bot",
      is_bot: true,
      username: "bot",
      can_join_groups: true,
      can_read_all_group_messages: false,
      supports_inline_queries: false,
      can_connect_to_business: false,
      has_main_web_app: false,
    }
    await bot.init()

    await prisma.$connect()

    logger.trace("Initialized test bot")
  }, 5000)

  beforeEach(() => {
    outgoingRequests = []
  })

  it("can handle /start in private", async () => {
    logger.trace("test start command")

    const user = mockUser(1234)
    const chat = MockChat.fromUser(user)

    await bot.handleUpdate(chat.mockCommand(user, "start"))

    expect(outgoingRequests).toHaveLength(1)
    // const result = outgoingRequests.pop();
    // if (result && "text" in result.payload) {
    //   expect(result.payload.text).toBe(1);
    // } else {
    //   throw new Error("No text in payload");
    // }
  }, 5000)

  afterAll(async () => {
    await bot.stop()
    await redis.quit()
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
