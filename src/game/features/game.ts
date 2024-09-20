import { Composer } from "grammy"
import type { Context } from "~/bot/context"
import { getForumTopicId } from "~/bot/helpers/forum"
import { logHandle } from "~/bot/helpers/logging"

import { getWelcomeMessage } from "~/bot/middlewares"
import { getChatTitle, getGameFromCtx, playerInGame } from "~/game/helpers/game.context"
import { runGame, startGame } from "../middlewares/game"
import { gameActions } from "./actions"
import { gameConvos } from "./convos"

const composer = new Composer<Context>()
/**
 * conversations must be registered before `start` command
 * otherwise player `Context`s will not contain the registered
 * conversations
 */
composer.use(gameConvos)

const feature = composer.chatType(["group", "supergroup"])
const pmFeature = composer.chatType("private")

pmFeature.command(
  "start",
  logHandle("command-start"),
  (ctx, next) => {
    if (!ctx.match) {
      next()
      return
    }
    if (ctx.match.slice(0, 4) === "join") {
      const game = ctx.games.get(ctx.match.slice(4))
      if (game === undefined) {
        ctx.reply(ctx.t("join.not_found"))
        return
      }

      const status = playerInGame(game, ctx)
      if (status === false) {
        game.addPlayer(ctx)
        return
      }
      ctx.reply(ctx.t(`join.${status}`, { chat: getChatTitle(ctx.games.get(ctx.session.game)!.ctx) }))
    }
  },
  getWelcomeMessage(),
)

feature.command("startgame", logHandle("command-startgame"), startGame(), runGame())

feature.command("join", logHandle("command-join"), async (ctx) => {
  const game = getGameFromCtx(ctx)
  if (game === undefined) {
    ctx.reply(ctx.t("game.not_started"), { reply_to_message_id: getForumTopicId(ctx) })
    return
  }

  if (game.state !== "lobby") {
    ctx.reply(ctx.t("join.failure"), { reply_to_message_id: getForumTopicId(ctx) })
    return
  }
  // TODO: consider handling spam by checking last message time
  game.serviceMsgs.push(
    await ctx.reply(ctx.t("join.prompt"), {
      reply_markup: game.callToAction,
      reply_to_message_id: getForumTopicId(ctx),
    }),
  )
})

feature.command("leave", logHandle("command-leave"), async (ctx) => {
  const game = getGameFromCtx(ctx)
  if (game === undefined) {
    ctx.reply(ctx.t("game.not_started"), { reply_to_message_id: getForumTopicId(ctx) })
    return
  }
  if (game.state !== "lobby") {
    ctx.reply(ctx.t("leave.failure"), { reply_to_message_id: getForumTopicId(ctx) })
    return
  }
  if (game.playerMap.has(ctx.from?.id)) {
    game.removePlayer(ctx)
    ctx.reply(ctx.t("leave.success", { user: ctx.from?.first_name }), { reply_to_message_id: getForumTopicId(ctx) })
  }
})

feature.command("forcenext", logHandle("command-forcenext"), async (ctx) => {
  const game = getGameFromCtx(ctx)
  if (game === undefined)
    return
  if (game.createdBy !== ctx.from?.id || 0)
    return
  if (game.flags.timerRunning) {
    game.flags.killTimer = true
    ctx.reply(ctx.t("game.timer_skipped"), { reply_to_message_id: getForumTopicId(ctx) })
  }
})

feature.command("players", logHandle("command-players"), async (ctx) => {
  const game = getGameFromCtx(ctx)
  if (game === undefined)
    return
  await ctx.reply(
    `${ctx.t("join.count", {
      count: game.players.length,
    })}\n${game.players.map(p => p.name).join("\n")}`,
    { reply_to_message_id: getForumTopicId(ctx) },
  )
})

composer.use(gameActions)

export { composer as gameFeature }
