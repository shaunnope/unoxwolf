import type { Context } from '~/bot/context'

import { getForumTopicId } from '~/bot/helpers/forum'
import { Game } from '~/game'
import { Player } from '~/game/models/player'

export const getGame = (ctx: Context) => ctx.games.get(ctx.session.games[getForumTopicId(ctx) || -1])
export const setGame = (ctx: Context, game: Game) => {
  const key = `${ctx.chat?.id || 0}+${getForumTopicId(ctx) || -1}`
  ctx.session.games[key] = game.id
  ctx.games.set(game.id, game)
}

export const playerAddGame = (ctx: Context, game: Game) => {
  ctx.session.games[getForumTopicId(ctx) || -1] = game.id
  ctx.games.set(game.id, game)
}

export const deleteGame = (ctx: Context) => {
  const game = getGame(ctx)
  if (game) {
    ctx.games.delete(game.id)
    delete ctx.session.games[getForumTopicId(ctx) || -1]
  }
}

export const getChatTitle = (ctx: Context) => {
  let groupTitle = ''
  switch (ctx.chat?.type) {
    case 'supergroup':
    // TODO: Add topic name
    case 'group':
      groupTitle = ctx.chat?.title
      break
    default:
      groupTitle = 'null'
  }
  return groupTitle
}

export const validateCallbackQuery = (ctx: Context) => {
  if (ctx.match === undefined) return undefined
  const [, gameId, userId] = ctx.match
  const game = ctx.games.get(gameId)
  if (game === undefined) {
    ctx.reply(ctx.t('game.not_started'))
    return undefined
  }
  if (ctx.from?.id === undefined) return undefined
  const player = game.playerMap.get(ctx.from?.id)
  if (player === undefined) {
    ctx.reply(ctx.t('game_error.not_in_game', { chat: getChatTitle(game.ctx) }))
    return undefined
  }
  return [game, player, userId] as [Game, Player, string]
}
