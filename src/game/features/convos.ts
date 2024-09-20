import { Composer } from "grammy"
import type { Context } from "~/bot/context"
import { logHandle } from "~/bot/helpers/logging"

import * as Convos from "~/game/convos"

const composer = new Composer<Context>()

composer.command("activeconvos", logHandle("command-convos"), async (ctx) => {
  const convoStats = await ctx.conversation.active()
  ctx.reply(JSON.stringify(convoStats))
})

composer.command("exitconvos", logHandle("command-stopconvos"), async (ctx) => {
  const convoStats = await ctx.conversation.active()
  if (ctx.match && convoStats[ctx.match] !== undefined) {
    await ctx.conversation.exit(ctx.match)
    ctx.reply(`Exited conversation: ${ctx.match}`)
  }
  else {
    await ctx.conversation.exit()
    ctx.reply(`Exited conversations:\n${JSON.stringify(convoStats)}`)
  }
})

// const feature = composer.chatType(['group', 'supergroup'])
const pmFeature = composer.chatType("private")

pmFeature.use(Convos.TroublemakerConvo)

export { composer as gameConvos }
