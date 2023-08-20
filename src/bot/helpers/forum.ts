import { Context } from "~/bot/context"

export const getForumTopicId = (ctx: Context) => {
    if (!(ctx.chat?.type == 'supergroup' && ctx.chat?.is_forum)) return undefined;
    return ctx.message?.message_thread_id;
}