import type { Context } from '~/bot/context'

import { getForumTopicId } from '~/bot/helpers/forum'
import { Game } from '~/game'

export const getGame = (ctx: Context) => ctx.games.get(ctx.session.games[getForumTopicId(ctx) || -1])
export const setGame = (ctx: Context, game: Game) => {
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
