import { Composer } from "grammy"
import type { Context } from "~/bot/context"
import { logHandle } from "~/bot/helpers/logging"

import { lgtbFeature } from "."

const composer = new Composer<Context>()

const feature = composer

feature.command("roll", logHandle("command-rng"), async (ctx) => {
  ctx.replyWithDice(["🎲", "🎯", "🎳", "🎰", "🏀", "⚽"][Math.floor(Math.random() * 6)])
})

feature.command("ping", logHandle("command-ping"), async (ctx) => {
  const start = Date.now()
  let ts = start - ctx.msg.date * 1000
  let message = ctx.t("ping_command.ping", { ts })
  const msg = await ctx.reply(message)

  ts = Date.now() - start
  message += `\n${ctx.t("ping_command.pong", { ts })}`
  await msg.editText(message)
})

feature.use(lgtbFeature)

export { composer as miscFeature }
