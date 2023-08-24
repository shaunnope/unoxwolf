import type { Player } from '~/game/models/player'
import type { Game } from '~/game'

import * as Events from '~/game/models/events'
import { Context } from '~/bot/context'
import { createVoteKB, createOptions } from '../helpers/game.convos'

export type Action = {
  fallback: (game: Game, player: Player) => void
  setup: (game: Game, player: Player) => void
  fn: (game: Game, playerContext: Context, targets?: Player[]) => void
}

/**
 * Vote action
 * @property {Function} fallback - Select a random option when the player does not respond in time
 * @property {Function} setup - Send the voting question to the player
 * @property {Function} fn - Handle the player's response
 */
export const Vote: Action = {
  fallback: (game: Game, player: Player) => {
    const options = createOptions(game.players, (other: Player) => other.id !== player.id)

    game.events.push(Events.Vote(player, [options[Math.floor(Math.random() * options.length)]], game))
  },
  setup: (game: Game, player: Player) => {
    game.privateMsgs.set(
      player.id,
      game.ctx.api.sendMessage(player.id, game.ctx.t('game.voting_qn'), {
        reply_markup: createVoteKB(game.players, (other: Player) => other.id !== player.id, `vote${game.id}`),
      })
    )
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[]) => {
    if (playerCtx.from?.id === undefined) return
    const player = game._players.get(playerCtx.from?.id)
    if (player === undefined) return
    if (game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t('game_error.vote_no_qn'))
      return
    }
    if (targets === undefined || targets.length !== 1) {
      playerCtx.answerCallbackQuery(
        playerCtx.t('game_error.vote_invalid', { user: targets?.toString() || 'undefined' })
      )
      return
    }
    game.events.push(Events.Vote(player, targets, game))
    game.privateMsgs.get(player.id)?.then(msg => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t('game.vote_cast', { user: targets[0].name }))
    })
    game.privateMsgs.delete(player.id)

    playerCtx.answerCallbackQuery()
  },
}

/**
 * Reveal action
 * @property {Function} fallback - Do nothing
 */
export const Reveal: Action = {
  fallback: (game: Game, player: Player) => {},
  setup: (game: Game, player: Player) => {
    game.privateMsgs.set(
      player.id,
      game.ctx.api.sendMessage(player.id, game.ctx.t('game.voting_qn'), {
        reply_markup: createVoteKB(game.players, (other: Player) => other.id !== player.id, `vote${game.id}`),
      })
    )
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[]) => {
    if (playerCtx.from?.id === undefined) return
    const player = game._players.get(playerCtx.from?.id)
    if (player === undefined) return
    if (game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t('game_error.vote_no_qn'))
      return
    }
    if (targets === undefined || targets.length !== 1) {
      playerCtx.answerCallbackQuery(
        playerCtx.t('game_error.vote_invalid', { user: targets?.toString() || 'undefined' })
      )
      return
    }
    game.events.push(Events.Vote(player, targets, game))
    game.privateMsgs.get(player.id)?.then(msg => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t('game.vote_cast', { user: targets[0].name }))
    })
    game.privateMsgs.delete(player.id)

    playerCtx.answerCallbackQuery()
  },
}

// export const Swap: Action = {
//   fn: (game: Game) => {
//     return () => {}
//   },
// }

// export const Peek: Action = {
//   fn: (game: Game) => {
//     return () => {}
//   },
// }

// export const Copy: Action = {
//   fn: async (self: Player, other: Player) => {
//     // TODO: might require concat
//     self.actions = other.role.doppleActions
//   },
// }
