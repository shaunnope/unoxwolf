import { RedisAdapter } from '@grammyjs/storage-redis'

import { createBot } from '~/bot'

import { container } from './container'

import type { ApiCallFn } from 'grammy'
import type { RawApi } from 'node_modules/grammy/out/core/client'

import { generateMessage } from './helpers'

type TupleToObject<T extends any[]> = Omit<T, keyof any[]>

type TupleToObjectWithPropNames<
  T extends any[],
  N extends Record<keyof TupleToObject<T>, PropertyKey>
  > =
  { [K in keyof TupleToObject<T> as N[K]]: T[K] };

type ApiRequest<R extends RawApi> = TupleToObjectWithPropNames<
  Parameters<ApiCallFn<R>>,
  ['method', 'payload', 'signal']
  >

try {
  const { redis } = container
  const bot = createBot("test", {
    container,
    sessionStorage: new RedisAdapter({
      instance: redis,
    }),
  })

  let outgoingRequests: ApiRequest<RawApi>[] = [];

  beforeAll(async () => {
    bot.api.config.use((prev, method, payload, signal) => {
      outgoingRequests.push({ method, payload, signal });
      return { ok: true, result: true } as ReturnType<ApiCallFn<RawApi>>;
    });

    bot.botInfo = {
      id: 42,
      first_name: "Test Bot",
      is_bot: true,
      username: "bot",
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    };
    await bot.init();
  }, 5000);

  beforeEach(() => {
    outgoingRequests = [];
  });

  test("start command", async () => {
    await bot.handleUpdate(generateMessage("/start"));

    expect(outgoingRequests.length).toBe(1);
    // const result = outgoingRequests.pop();
    // if (result && "text" in result.payload) {
    //   expect(result.payload.text).toBe(1);
    // } else {
    //   throw new Error("No text in payload");
    // }
  }, 5000);

  afterAll(async () => {
    await bot.stop();
    await redis.quit();
  })

} catch (error) {
  container.logger.error(error);
  process.exit(1);
}
