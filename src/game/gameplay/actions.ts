import _ from "lodash"
import type { Context } from "~/bot/context"

import { Keyboard } from "~/game/helpers/keyboards"
import * as Events from "~/game/models/events"
import type { GameInfo as Game } from "~/game/models/game"
import * as G from "~/game/models/game.fn"
import type { Player } from "~/game/models/player"

interface TranslationContext {
  [key: string]: string
}

export interface ActionChoice {
  name: string // TODO: specific strings
  gameId: string
  playerId: number
  targetId: string | number
}

export interface ActionOptions {
  priority: number
  required?: true
  swapSelf?: true
  swapUnassigned?: true

  /** An automatic action */
  isAuto?: true

  predicate?: (player: Player) => boolean
  eventCallback?: () => void

  responsePayload?: TranslationContext
}

const DEFAULT_ACTION_OPTIONS: ActionOptions = {
  priority: 0,
}

/**
 * @property {Function} fallback - Select a random option when the player does not respond in time
 * @property {Function} setup - Send the voting question to the player
 * @property {Function} fn - Handle the player's response
 */
export interface Action {
  fallback: (game: Game, player: Player, other?: ActionOptions) => void
  setup: (game: Game, player: Player, other?: ActionOptions) => void
  // TODO: consider if targets should be optional
  fn: (game: Game, playerContext: Context, targets?: Player[], other?: ActionOptions) => void
}

export interface DebugAction {
  force: (game: Game, player: Player, targets?: Player[]) => void

}

/**
 * Vote for a player
 */
export const Vote: Action = {
  fallback: (game: Game, player: Player) => {
    const options = G.others(game, player)

    game.events.push(Events.Vote(player, options[Math.floor(Math.random() * options.length)], game))
  },
  setup: (game: Game, player: Player) => {
    if (player.ctx === undefined || !game.playerMap.has(player.id))
      return

    game.privateMsgs.set(
      player.id,
      new Keyboard(game)
        .addPlayers(other => other.id !== player.id, "vote")
        .send(player, "vote")!,
    )
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[]) => {
    const player = game.playerMap.get(playerCtx.from!.id)!

    if (game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t("game_error.wrong_qn"))
      return
    }
    if (targets === undefined || targets.length !== 1) {
      playerCtx.answerCallbackQuery(
        playerCtx.t("game_error.invalid_vote", { user: targets?.toString() || "undefined" }),
      )
      return
    }
    game.events.push(Events.Vote(player, targets[0], game))
    game.privateMsgs.get(player.id)?.then((msg) => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t("vote.cast", { user: targets[0].name }))
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
    const targets = _.sampleSize(G.others(game, player), 2)
    if (other.swapSelf)
      targets[0] = player

    game.events.push(Events.Swap(player, targets, game, other.priority))
  },
  setup: (game: Game, player: Player) => {
    if (player.ctx === undefined || !game.playerMap.has(player.id))
      return

    game.privateMsgs.set(
      player.id,
      new Keyboard(game)
        .addPlayers(other => other.id !== player.id, "swap")
        .send(player)!,
    )
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[], other: ActionOptions = DEFAULT_ACTION_OPTIONS) => {
    if (playerCtx.from?.id === undefined)
      return
    const player = game.playerMap.get(playerCtx.from?.id)
    if (player === undefined)
      return
    if (targets === undefined || targets.length !== 2) {
      if (!other.isAuto) {
        playerCtx.answerCallbackQuery(
          playerCtx.t("game_error.invalid_vote", { user: targets?.toString() || "undefined" }),
        )
      }
      return
    }

    game.events.push(Events.Swap(player, targets, game, other.priority, !other.isAuto))
    if (!other.isAuto)
      playerCtx.answerCallbackQuery()
  },
}

/**
 * Peek at a player's role
 */
export const Peek: Action = {
  fallback: (_game: Game, _player: Player) => {},
  setup: (_game: Game, _player: Player) => {},
  fn: (game: Game, playerCtx: Context, targets?: Player[], other: ActionOptions = DEFAULT_ACTION_OPTIONS) => {
    const player = game.playerMap.get(playerCtx.from!.id)
    if (player === undefined)
      return
    if (!other.isAuto && game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t("game_error.wrong_qn"))
      return
    }
    if (targets === undefined) {
      if (other.isAuto)
        return
      playerCtx.answerCallbackQuery(playerCtx.t("game_error.invalid_vote", { user: playerCtx.t("misc.undefined") }))
      return
    }
    // TODO: validate that targets in game
    game.events.push(Events.Peek(player, targets, other.eventCallback, other.priority))

    if (!other.isAuto) {
      game.privateMsgs.get(player.id)?.then((msg) => {
        game.ctx.api.editMessageText(
          player.id,
          msg.message_id,
          game.ctx.t("vote.cast", other.responsePayload ?? { user: targets[0].name }),
        )
      })
      game.privateMsgs.delete(player.id)

      playerCtx.answerCallbackQuery()
    }
  },
}

/**
 * Reveal action
 * @property {Function} fallback - Do nothing
 */
export const Reveal: Action = {
  fallback: (_game: Game, _player: Player) => {},
  setup: (_game: Game, _player: Player) => {},
  fn: (game: Game, playerCtx: Context, targets?: Player[], other: ActionOptions = DEFAULT_ACTION_OPTIONS) => {
    const player = game.playerMap.get(playerCtx.from!.id)
    if (player === undefined || targets === undefined)
      return
    game.events.push(Events.Reveal(player, targets, other.eventCallback, other.priority))
  },
}

/**
 * Copy another player's role
 */
export const Copy: Action & DebugAction = {
  force: (game: Game, player: Player, targets?: Player[]) => {
    if (targets === undefined)
      return
    const copyEvent = Events.Copy(player, targets[0], game)
    game.events.push(copyEvent)
    copyEvent.fn()
  },
  fallback: (game: Game, player: Player) => {
    const options = G.others(game, player)
    Copy.force(game, player, [options[Math.floor(Math.random() * options.length)]])
  },
  setup: (game: Game, player: Player) => {
    if (player.ctx === undefined || !game.playerMap.has(player.id))
      return

    game.privateMsgs.set(
      player.id,
      new Keyboard(game)
        .addPlayers(other => other.id !== player.id, "copy")
        .send(player)!,
    )
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[]) => {
    if (playerCtx.from?.id === undefined)
      return
    const player = game.playerMap.get(playerCtx.from?.id)
    if (player === undefined)
      return
    if (game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t("game_error.wrong_qn"))
      return
    }
    if (targets === undefined || targets.length !== 1) {
      playerCtx.answerCallbackQuery(
        playerCtx.t("game_error.invalid_vote", { user: targets?.toString() || "undefined" }),
      )
      return
    }
    game.privateMsgs.get(player.id)?.then((msg) => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t("vote.cast", { user: targets[0].name }))
    })

    const copyEvent = Events.Copy(player, targets[0], game)
    game.events.push(copyEvent)
    // copyEvent.fn()

    playerCtx.answerCallbackQuery()
    game.privateMsgs.delete(player.id)
  },
}

/**
 * Rotate roles around players
 */
export const Rotate: Action = {
  fallback: (game: Game, player: Player, other: ActionOptions = DEFAULT_ACTION_OPTIONS) => {
    const rotation = Math.random() > 0.5 ? 1 : -1
    game.events.push(Events.Rotate(player, rotation, game, other.priority))
  },
  setup: (game: Game, player: Player) => {
    if (player.ctx === undefined || !game.playerMap.has(player.id))
      return

    game.privateMsgs.set(
      player.id,
      new Keyboard(game)
        .addPlayers(other => other.id !== player.id, "rotate")
        .send(player)!,
    )
  },
  fn: (game: Game, playerCtx: Context, targets?: Player[], other: ActionOptions = DEFAULT_ACTION_OPTIONS) => {
    if (playerCtx.from?.id === undefined)
      return
    const player = game.playerMap.get(playerCtx.from?.id)
    if (player === undefined)
      return
    if (targets === undefined || targets.length !== 2) {
      if (!other.isAuto) {
        playerCtx.answerCallbackQuery(
          playerCtx.t("game_error.invalid_vote", { user: targets?.toString() || "undefined" }),
        )
      }
      return
    }

    game.events.push(Events.Swap(player, targets, game, other.priority, !other.isAuto))
    if (!other.isAuto)
      playerCtx.answerCallbackQuery()
  },
}

/**
 * Forfeit action
 */
export const Pass: Action = {
  fallback: (_game: Game, _player: Player) => {},
  setup: (_game: Game, _player: Player) => {},
  fn: (game: Game, playerCtx: Context) => {
    if (playerCtx.from === undefined)
      return
    const player = game.playerMap.get(playerCtx.from.id)
    if (player === undefined)
      return
    if (game.privateMsgs.get(player.id) === undefined) {
      playerCtx.reply(playerCtx.t("game_error.wrong_qn"))
      return
    }

    game.privateMsgs.get(player.id)?.then((msg) => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t("misc.passed"))
    })

    playerCtx.answerCallbackQuery()
    game.privateMsgs.delete(player.id)
  },
}
