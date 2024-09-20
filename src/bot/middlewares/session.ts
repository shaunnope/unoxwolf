import type { Middleware, StorageAdapter } from "grammy"
import { session as createSession } from "grammy"
import type { Context } from "~/bot/context"

export function session(storage: StorageAdapter<unknown>): Middleware<Context> {
  return createSession({
    initial: () => ({
      games: {},
    }),
    storage,
  })
}
