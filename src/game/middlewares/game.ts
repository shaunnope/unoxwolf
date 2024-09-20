import type { Middleware } from "grammy"
import type { Context } from "~/bot/context"

import { getForumTopicId } from "~/bot/helpers/forum"

import { Game } from "~/game"
import { getGameFromCtx, setGame } from "~/game/helpers/game.context"

export function startGame(): Middleware<Context> {
  return (ctx, next) => {
    // check if game is already started
    if (getGameFromCtx(ctx) !== undefined) {
      ctx.reply(ctx.t("game.already_started"), { reply_to_message_id: getForumTopicId(ctx) })
      return
    }
    setGame(ctx, new Game(ctx))
    return next()
  }
}

export function runGame(): Middleware<Context> {
  return async ctx => getGameFromCtx(ctx)!.run()
}
