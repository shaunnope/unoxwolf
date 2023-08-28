import _ from 'lodash'
import type { Player } from '~/game/models/player'

import * as Events from '~/game/models/events'
import { Context } from '~/bot/context'
import type { GameInfo as Game } from '../models/game'
import { createVoteKB, getOptions, sendActionPrompt } from '../helpers/keyboards'

export type ActionChoice = {
  name: string // TODO: specific strings
  gameId: string
  playerId: number
  targetId: string | number
}

export type ActionOptions = {
  priority: number
  required?: true
  swapSelf?: true
  swapUnassigned?: true
  isAuto?: true
  predicate?: (player: Player) => boolean
  eventCallback?: () => void
}

const DEFAULT_ACTION_OPTIONS: ActionOptions = {
  priority: 0,
}

/**
 * @property {Function} fallback - Select a random option when the player does not respond in time
 * @property {Function} setup - Send the voting question to the player
 * @property {Function} fn - Handle the player's response
 */
export type Action = {
  fallback: (game: Game, player: Player, other?: ActionOptions) => void
  setup: (game: Game, player: Player, other?: ActionOptions) => void
  // TODO: consider if targets should be optional
  fn: (game: Game, playerContext: Context, targets?: Player[], other?: ActionOptions) => void
}

/**
 * Vote for a player
 */
export const Vote: Action = {
  fallback: (game: Game, player: Player) => {
    const options = getOptions(game.players, other => other.id !== player.id)

    game.events.push(Events.Vote(player, options[Math.floor(Math.random() * options.length)], game))
  },
  setup: (game: Game, player: Player) => {
    if (player.ctx === undefined || !game.playerMap.has(player.id)) return
    const options = getOptions(game.players, other => other.id !== player.id)
    game.privateMsgs.set(player.id, sendActionPrompt(player, createVoteKB(options, `vote${game.id}`), 'vote')!)
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[]) => {
    if (playerCtx.from?.id === undefined) return
    const player = game.playerMap.get(playerCtx.from?.id)
    if (player === undefined) return
    if (game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t('game_error.wrong_qn'))
      return
    }
    if (targets === undefined || targets.length !== 1) {
      playerCtx.answerCallbackQuery(
        playerCtx.t('game_error.invalid_vote', { user: targets?.toString() || 'undefined' })
      )
      return
    }
    game.events.push(Events.Vote(player, targets[0], game))
    game.privateMsgs.get(player.id)?.then(msg => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t('vote.cast', { user: targets[0].name }))
    })
    game.privateMsgs.delete(player.id)

    playerCtx.answerCallbackQuery()
  },
}

/**
 * Swap roles between players
 */
export const Swap: Action = {
  fallback: (game: Game, player: Player, other: ActionOptions = DEFAULT_ACTION_OPTIONS) => {
    const options = getOptions(game.players, p => p.id !== player.id)
    const targets = _.sampleSize(options, 2)
    if (other.swapSelf) targets[0] = player

    game.events.push(Events.Swap(player, targets, game, other.priority))
  },
  setup: (game: Game, player: Player) => {
    if (player.ctx === undefined || !game.playerMap.has(player.id)) return
    const options = getOptions(game.players, p => p.id !== player.id)
    game.privateMsgs.set(player.id, sendActionPrompt(player, createVoteKB(options, `swap${game.id}`))!)
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[], other: ActionOptions = DEFAULT_ACTION_OPTIONS) => {
    if (playerCtx.from?.id === undefined) return
    const player = game.playerMap.get(playerCtx.from?.id)
    if (player === undefined) return
    if (targets === undefined || targets.length !== 2) {
      if (!other.isAuto)
        playerCtx.answerCallbackQuery(
          playerCtx.t('game_error.invalid_vote', { user: targets?.toString() || 'undefined' })
        )
      return
    }

    game.events.push(Events.Swap(player, targets, game, other.priority, !other.isAuto))
    if (!other.isAuto) playerCtx.answerCallbackQuery()
  },
}

/**
 * Peek at a player's role
 */
export const Peek: Action = {
  fallback: (game: Game, player: Player) => {},
  setup: (game: Game, player: Player) => {
    const options = getOptions(game.players, other => other.id !== player.id)
    game.privateMsgs.set(
      player.id,
      game.ctx.api.sendMessage(player.id, game.ctx.t('vote'), {
        reply_markup: createVoteKB(options, `vote${game.id}`),
      })
    )
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[]) => {
    if (playerCtx.from?.id === undefined) return
    const player = game.playerMap.get(playerCtx.from?.id)
    if (player === undefined) return
    if (game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t('game_error.wrong_qn'))
      return
    }
    if (targets === undefined || targets.length !== 1) {
      playerCtx.answerCallbackQuery(
        playerCtx.t('game_error.invalid_vote', { user: targets?.toString() || 'undefined' })
      )
      return
    }
    game.events.push(Events.Vote(player, targets[0], game))
    game.privateMsgs.get(player.id)?.then(msg => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t('vote.cast', { user: targets[0].name }))
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
    const options = getOptions(game.players, other => other.id !== player.id)
    game.privateMsgs.set(
      player.id,
      game.ctx.api.sendMessage(player.id, game.ctx.t('vote'), {
        reply_markup: createVoteKB(options, `vote${game.id}`),
      })
    )
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[], other: ActionOptions = DEFAULT_ACTION_OPTIONS) => {
    if (playerCtx.from?.id === undefined) return
    const player = game.playerMap.get(playerCtx.from?.id)
    if (player?.ctx === undefined || targets === undefined) return
    game.events.push(Events.Reveal(player, targets, other.eventCallback, other.priority))
  },
}

/**
 * Copy another player's role
 */
export const Copy: Action = {
  fallback: (game: Game, player: Player) => {
    const options = getOptions(game.players, p => p.id !== player.id)

    Events.Copy(player, options[Math.floor(Math.random() * options.length)], game).fn()
  },
  setup: (game: Game, player: Player) => {
    if (player.ctx === undefined || !game.playerMap.has(player.id)) return
    const options = getOptions(game.players, other => other.id !== player.id)
    game.privateMsgs.set(player.id, sendActionPrompt(player, createVoteKB(options, `copy${game.id}`))!)
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[]) => {
    if (playerCtx.from?.id === undefined) return
    const player = game.playerMap.get(playerCtx.from?.id)
    if (player === undefined) return
    if (game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t('game_error.wrong_qn'))
      return
    }
    if (targets === undefined || targets.length !== 1) {
      playerCtx.answerCallbackQuery(
        playerCtx.t('game_error.invalid_vote', { user: targets?.toString() || 'undefined' })
      )
      return
    }
    game.privateMsgs.get(player.id)?.then(msg => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t('vote.cast', { user: targets[0].name }))
    })

    Events.Copy(player, targets[0], game).fn()

    playerCtx.answerCallbackQuery()
    game.privateMsgs.delete(player.id)
  },
}
