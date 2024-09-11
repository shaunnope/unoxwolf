import { Composer } from "grammy"
import _ from "lodash"
import type { Context } from "~/bot/context"
import { logHandle } from "~/bot/helpers/logging"

import * as Actions from "~/game/gameplay/actions"
import { validateCallbackQuery } from "~/game/helpers/game.context"
import * as Roles from "~/game/roles"

const composer = new Composer<Context>()

const feature = composer.chatType("private")

/**
 * Vote for a player
 */
feature.callbackQuery(/vote([\w.]+)\+([\w.]+)/, logHandle("callback-vote"), async (ctx) => {
  const res = validateCallbackQuery(ctx)
  if (res === undefined)
    return
  const [game, , userId] = res
  const target = game.playerMap.get(Number(userId))
  if (target === undefined) {
    ctx.answerCallbackQuery(ctx.t("game_error.invalid_vote", { user: userId }))
    return
  }

  Actions.Vote.fn(game, ctx, [target])
})

/**
 * Peek at roles
 */
feature.callbackQuery(/peek([\w.]+)\+([\w.]+)/, logHandle("callback-peek"), async (ctx) => {
  const res = validateCallbackQuery(ctx)
  if (res === undefined)
    return
  const [game, player, userId] = res
  if (player.role instanceof Roles.Seer) {
    const targets = []
    let payload: string
    if (userId === "un") {
      targets.push(..._.sampleSize(game.unassignedRoles, 2))
      payload = ctx.t("misc.unassigned", { count: 2 })
    }
    else {
      const target = game.playerMap.get(Number(userId))
      if (target === undefined) {
        ctx.answerCallbackQuery(ctx.t("game_error.invalid_vote", { user: userId }))
        return
      }
      targets.push(target)
      payload = target.name
    }
    Actions.Peek.fn(game, ctx, targets, {
      priority: player.role.priority,
      responsePayload: {
        user: payload,
      },
    })
  }
})

/**
 * Swap roles
 */
feature.callbackQuery(/swap([\w.]+)\+([\w.]+)/, logHandle("callback-swap"), async (ctx) => {
  const res = validateCallbackQuery(ctx)
  if (res === undefined)
    return
  const [game, player, userId] = res
  if (game.privateMsgs.get(player.id) === undefined) {
    ctx.reply(ctx.t("game_error.wrong_qn"))
    return
  }

  if (player.role instanceof Roles.Robber) {
    const target = game.playerMap.get(Number(userId))
    if (target === undefined) {
      ctx.answerCallbackQuery(ctx.t("game_error.invalid_vote", { user: userId }))
      return
    }

    game.privateMsgs.get(player.id)?.then((msg) => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t("vote.cast", { user: target.name }))
    })
    game.privateMsgs.delete(player.id)

    Actions.Swap.fn(game, ctx, [player, target], {
      priority: player.role.priority,
      swapSelf: true,
    })
  }
  else if (player.role instanceof Roles.Troublemaker) {
    const target = game.playerMap.get(Number(userId))
    if (target === undefined) {
      ctx.answerCallbackQuery(ctx.t("game_error.invalid_vote", { user: userId }))
      return
    }

    ctx.session.actions = [
      {
        name: "swap",
        gameId: game.id,
        playerId: player.id,
        targetId: userId,
      },
    ]
    await ctx.conversation.enter("troublemaker")
  }
})

/**
 * Copy roles
 */
feature.callbackQuery(/copy([\w.]+)\+([\w.]+)/, logHandle("callback-swap"), async (ctx) => {
  const res = validateCallbackQuery(ctx)
  if (res === undefined)
    return
  const [game, player, userId] = res

  if (player.role instanceof Roles.Doppelganger) {
    const target = game.playerMap.get(Number(userId))
    if (target === undefined) {
      ctx.answerCallbackQuery(ctx.t("game_error.invalid_vote", { user: userId }))
      return
    }

    Actions.Copy.fn(game, ctx, [target], {
      priority: player.role.priority,
    })
  }
})

export { composer as gameActions }
