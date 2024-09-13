import _ from "lodash"
import type { Context, Middleware } from "grammy"

import type { GameInfo } from "~/game/models/game"

import type { Player } from "~/game/models/player"
import { logger } from "~/logger"
import { updateHandledCounter } from "~/metrics"

export function getChatInfo(ctx: Context) {
  if (!_.isNil(ctx.chat)) {
    return {
      chat: _.pick(ctx.chat, ["id", "type"]),
    }
  }

  return {}
}

export function getSenderInfo(ctx: Context) {
  if (!_.isNil(ctx.senderChat)) {
    return {
      sender: _.pick(ctx.senderChat, ["id", "type"]),
    }
  }

  if (!_.isNil(ctx.from)) {
    return {
      sender: _.pick(ctx.from, ["id"]),
    }
  }

  return {}
}

export function getMetadata(ctx: Context) {
  return {
    message_id: ctx.msg?.message_id,
    ...getChatInfo(ctx),
    ...getSenderInfo(ctx),
  }
}

export function getFullMetadata(ctx: Context) {
  return {
    ...ctx.update,
  }
}

export function logHandle(id: string): Middleware<Context> {
  return (ctx, next) => {
    updateHandledCounter.inc({
      from_id: ctx.from?.id,
      chat_id: ctx.chat?.id,
      handler_id: id,
    })

    logger.debug({
      msg: `handle ${id}`,
      ...(id === "unhandled" ? getFullMetadata(ctx) : getMetadata(ctx)),
    })

    return next()
  }
}

export function logGameEvent(id: string, game: GameInfo, player: Player, data?: object) {
  logger.debug({
    msg: `trigger game ${id}`,
    game: game.id,
    player: player.id,
    ...data,
  })
}

export function logConvoHandle<C extends Context>(id: string, ctx: C, isLeave?: true) {
  if (isLeave) {
    updateHandledCounter.inc({
      from_id: ctx.from?.id,
      chat_id: ctx.chat?.id,
      handler_id: id,
    })
  }
  logger.debug({
    msg: `convo ${isLeave ? "leave" : "enter"}-${id}`,
    ...(id === "unhandled" ? getFullMetadata(ctx) : getMetadata(ctx)),
  })
}
