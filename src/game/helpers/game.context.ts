import type { Context } from "~/bot/context"

import { getForumTopicId } from "~/bot/helpers/forum"

import { games } from "~/container"
import type { Game } from "~/game"
import type { Player } from "~/game/models/player"

// FIXME: middleware unable to get existing game
export const getGameFromCtx = (ctx: Context) => games.get(ctx.session.games[getForumTopicId(ctx) || -1])
export function setGame(ctx: Context, game: Game) {
  const key = getForumTopicId(ctx) || -1
  ctx.session.games[key] = game.id
  games.set(game.id, game)
}

export function playerAddGame(ctx: Context, game: Game) {
  ctx.session.games[game.id] = game.id
}

export function deleteGame(game: Game) {
  games.delete(game.id)
  delete game.ctx.session.games[getForumTopicId(game.ctx) || -1]
}

export function getChatTitle(ctx: Context) {
  let groupTitle = ""
  switch (ctx.chat?.type) {
    case "supergroup":
      // TODO: Add topic name
      groupTitle = ctx.chat?.title
      break
    case "group":
      groupTitle = ctx.chat?.title
      break
    default:
      groupTitle = "null"
  }
  return groupTitle
}

/**
 * Check if player is in a game
 * @param game
 * @param ctx
 * @returns false if player is not in any game, 'already_in_game' if player is already in game, 'in_another_game' if player is in another game
 */
export function playerInGame(game: Game, ctx: Context): false | "already_in_game" | "in_another_game" {
  // no active game
  if (ctx.session.game === undefined)
    return false

  const oldGame = ctx.games.get(ctx.session.game)
  // game ended
  if (oldGame === undefined)
    return false
  const playerId = ctx.from!.id // TODO: filter Context type to only include messages with from.id

  if (oldGame.id !== game.id) {
    if (oldGame.playerMap.has(playerId))
      return "in_another_game"
    return false
  }
  if (game.playerMap.has(playerId))
    return "already_in_game"

  return false
}

export function validateCallbackQuery(ctx: Context) {
  if (ctx.match === undefined)
    return undefined
  const [, gameId, userId] = ctx.match
  const game = games.get(gameId)
  if (game === undefined) {
    ctx.answerCallbackQuery(ctx.t("game.not_started"))
    return undefined
  }
  if (ctx.from?.id === undefined)
    return undefined
  const player = game.playerMap.get(ctx.from?.id)
  if (player === undefined) {
    ctx.answerCallbackQuery(ctx.t("game_error.not_in_game", { chat: getChatTitle(game.ctx) }))
    return undefined
  }
  return [game, player, userId] as [Game, Player, string]
}

export function validateTarget(ctx: Context, game: Game, player: Player, userId: string) {
  const target = game.playerMap.get(Number(userId))
  if (target === undefined) {
    ctx.answerCallbackQuery(ctx.t("game_error.invalid_vote", { user: userId }))
    return undefined
  }
  if (game.privateMsgs.get(player.id) === undefined) {
    ctx.answerCallbackQuery(ctx.t("game_error.wrong_qn"))
    return undefined
  }
  return target
}

export type MaybeCallbackRes = [string, number, string] | undefined

export function validateConvoCallback(ctx: Context): MaybeCallbackRes {
  const res = validateCallbackQuery(ctx)
  if (res === undefined)
    return undefined
  const [game, player, userId] = res
  return [game.id, player.id, userId]
}

export function validateConvoTarget(ctx: Context, game: Game, player: Player, userId: string) {
  const target = validateTarget(ctx, game, player, userId)
  return target === undefined ? undefined : target.id
}
