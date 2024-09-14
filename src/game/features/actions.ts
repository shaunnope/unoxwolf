import { Composer } from "grammy"
import _ from "lodash"
import type { Context } from "~/bot/context"
import { logHandle } from "~/bot/helpers/logging"

import * as Actions from "~/game/gameplay/actions"
import { validateCallbackQuery } from "~/game/helpers/game.context"
import type { Player } from "~/game/models/player"
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
  if (!(player.role instanceof Roles.Seer))
    return

  const targets: Player[] = []
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

  let eventCallback: (() => void) | undefined

  if (player.role instanceof Roles.Fool) {
    eventCallback = () => {
      if (player.ctx === undefined)
        return
      const { ctx } = player
      const roles = _.sampleSize(game.roles, targets.length)
      ctx.reply(targets.map((t, index) => ctx.t("misc.peek_role", { user: t.name, role: ctx.t(roles[index].name) })).join("\n"))
    }
  }

  Actions.Peek.fn(game, ctx, targets, {
    priority: player.role.priority,
    responsePayload: {
      user: payload,
    },
    eventCallback,
  })
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

  if (!(player.role instanceof Roles.Robber))
    return

  const target = game.playerMap.get(Number(userId))
  if (target === undefined) {
    ctx.answerCallbackQuery(ctx.t("game_error.invalid_vote", { user: userId }))
    return
  }

  if (player.role instanceof Roles.Troublemaker) {
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
  else if (player.role instanceof Roles.Robber) {
    game.privateMsgs.get(player.id)?.then((msg) => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t("vote.cast", { user: target.name }))
    })
    game.privateMsgs.delete(player.id)

    Actions.Swap.fn(game, ctx, [player, target], {
      priority: player.role.priority,
      swapSelf: true,
    })
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

/**
 * Generic pass action. Forfeit turn
 */
feature.callbackQuery(/pass([\w.]+)\+([\w.]+)/, logHandle("callback-pass"), async (ctx) => {
  const res = validateCallbackQuery(ctx)
  if (res === undefined)
    return
  const [game] = res

  Actions.Pass.fn(game, ctx)
})

export { composer as gameActions }
