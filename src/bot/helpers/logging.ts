import { Middleware, type Context } from 'grammy'
import _ from 'lodash'
import { updateHandledCounter } from '~/metrics'

import { logger } from '~/logger'
import { Player } from '~/game/models/player'
import { GameInfo } from '~/game/models/game'

export const getChatInfo = (ctx: Context) => {
  if (!_.isNil(ctx.chat)) {
    return {
      chat: _.pick(ctx.chat, ['id', 'type']),
    }
  }

  return {}
}

export const getSenderInfo = (ctx: Context) => {
  if (!_.isNil(ctx.senderChat)) {
    return {
      sender: _.pick(ctx.senderChat, ['id', 'type']),
    }
  }

  if (!_.isNil(ctx.from)) {
    return {
      sender: _.pick(ctx.from, ['id']),
    }
  }

  return {}
}

export const getMetadata = (ctx: Context) => ({
  message_id: ctx.msg?.message_id,
  ...getChatInfo(ctx),
  ...getSenderInfo(ctx),
})

export const getFullMetadata = (ctx: Context) => ({
  ...ctx.update,
})

export const logHandle =
  (id: string): Middleware<Context> =>
  (ctx, next) => {
    updateHandledCounter.inc({
      from_id: ctx.from?.id,
      chat_id: ctx.chat?.id,
      handler_id: id,
    })

    logger.info({
      msg: `handle ${id}`,
      ...(id === 'unhandled' ? getFullMetadata(ctx) : getMetadata(ctx)),
    })

    return next()
  }

export const logGameEvent = (id: string, game: GameInfo, player: Player, data?: object) => {
  logger.info({
    msg: `trigger game ${id}`,
    game: game.id,
    player: player.id,
    ...data,
  })
}

export const logConvoHandle = <C extends Context>(id: string, ctx: C, isLeave?: true) => {
  if (isLeave) {
    updateHandledCounter.inc({
      from_id: ctx.from?.id,
      chat_id: ctx.chat?.id,
      handler_id: id,
    })
  }
  logger.info({
    msg: `convo ${isLeave ? 'leave' : 'enter'}-${id}`,
    ...(id === 'unhandled' ? getFullMetadata(ctx) : getMetadata(ctx)),
  })
}
