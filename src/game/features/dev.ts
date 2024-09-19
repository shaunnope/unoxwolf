import { createConversation } from "@grammyjs/conversations"
import { Composer, InlineKeyboard } from "grammy"
import type { Context, Conversation } from "~/bot/context"

import { logHandle } from "~/bot/helpers/logging"
import { config } from "~/config"
import { Game } from "~/game"
import { createPlayers } from "~/game/helpers/create-players"
import { getGameFromCtx } from "~/game/helpers/game.context"
import { startGame } from "../middlewares/game"

const composer = new Composer<Context>()

composer.command("debug", logHandle("command-debug"), (ctx) => {
  ctx.reply(JSON.stringify(ctx.session))
})

const feature = composer.chatType(["group", "supergroup"])
const pmFeature = composer.chatType("private")

feature.command("startgame", logHandle("command-startgame-dev"), startGame(), async (ctx) => {
  if (config.isTest)
    return
  const game = getGameFromCtx(ctx)!
  game.run()

  if (Number(ctx.match) && Number(ctx.match) > 0) {
    game.addPlayers(createPlayers(Number(ctx.match)))
  }
})

if (config.isTest) {
  feature.command("spawn", async (ctx) => {
    const game = new Game(ctx)
    ctx.games.set(game.id, game)
  })
}

pmFeature.command("mockcb", logHandle("command-mockcb"), async (ctx) => {
  const action = ctx.match || "vote"
  const kb = new InlineKeyboard().text("Button 1", `${action}abc+-1`).text("Button 2", `${action}def+2`)
  ctx.reply(`Test: ${action}`, { reply_markup: kb })
})

async function enterConvo(conversation: Conversation, ctx: Context) {
  ctx.reply("You entered the conversation! Now send me a callback query.")
  const msgCtx = await conversation.waitForCallbackQuery(/vote([\w.]+)\+([\w.]+)/)
  await ctx.reply(`You chose: ${msgCtx.match}`)
  await msgCtx.answerCallbackQuery()
  await ctx.reply("Leaving conversation")
}

pmFeature.use(createConversation(enterConvo))

pmFeature.command("enter", logHandle("command-enter"), async (ctx) => {
  await ctx.conversation.enter("enterConvo")
})

export { composer as devGameFeature }
