import type { Context } from "~/bot/context"

export function getForumTopicId(ctx: Context) {
  // if (!(ctx.chat?.type === 'supergroup' && ctx.chat?.is_forum)) return undefined
  return ctx.message?.message_thread_id
}
