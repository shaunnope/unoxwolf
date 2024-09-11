import type { Middleware } from "grammy"
import type { Context } from "~/bot/context"
import { getPrivateChatCommandEntries } from "~/bot/helpers/bot-commands"

export function getWelcomeMessage(): Middleware<Context> {
  return (ctx: Context) => {
    ctx.reply(`${ctx.t("welcome")}\n${getPrivateChatCommandEntries(ctx.from?.language_code || "en")}`)
  }
}
