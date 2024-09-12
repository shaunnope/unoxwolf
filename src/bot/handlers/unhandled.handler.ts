import { Composer } from "grammy"
import type { Context } from "~/bot/context"

import { logHandle } from "~/bot/helpers/logging"

const composer = new Composer<Context>()

composer.on("::bot_command", logHandle("unhandled-command"), ctx => ctx.reply(ctx.t("unhandled.command")))

composer.on(":text", logHandle("unhandled"), ctx => ctx.reply(ctx.t("unhandled.text")))

export { composer as unhandledHandler }
