import _ from 'lodash'
import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import { validateCallbackQuery } from '~/game/helpers/game.context'
import * as Actions from '~/game/gameplay/actions'
import * as Roles from '~/game/roles'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

/**
 * Vote for a player
 */
feature.callbackQuery(/vote(.+)\+(.+)/, logHandle('callback-vote'), async ctx => {
  const res = validateCallbackQuery(ctx)
  if (res === undefined) return
  const [game, , userId] = res
  const target = game.playerMap.get(Number(userId))
  if (target === undefined) {
    ctx.answerCallbackQuery(ctx.t('game_error.vote_invalid', { user: userId }))
    return
  }

  Actions.Vote.fn(game, ctx, [target])
})

/**
 * Peek at roles
 */
feature.callbackQuery(/peek(.+)\+(.+)/, logHandle('callback-peek'), async ctx => {
  const res = validateCallbackQuery(ctx)
  if (res === undefined) return
  const [game, player, userId] = res
  let msg = ''
  if (player.role instanceof Roles.Seer) {
    if (userId === 'un') {
      const [role1, role2] = _.sampleSize(game.unassignedRoles, 2)
      msg = ctx.t('role_message.seer_reveal2', { role1: ctx.t(role1.name), role2: ctx.t(role2.name) })
    } else {
      const target = game.playerMap.get(Number(userId))
      if (target === undefined) {
        ctx.answerCallbackQuery(ctx.t('game_error.vote_invalid', { user: userId }))
        return
      }
      msg = ctx.t('role_message.seer_reveal', { user: target.name, role: ctx.t(target.role.name) })
    }
    game.privateMsgs.get(player.id)?.then(oldMsg => {
      ctx.api.editMessageText(player.id, oldMsg.message_id, msg)
    })
    game.privateMsgs.delete(player.id)
  }
})

/**
 * Swap roles
 */
feature.callbackQuery(/swap(.+)\+(.+)/, logHandle('callback-swap'), async ctx => {
  const res = validateCallbackQuery(ctx)
  if (res === undefined) return
  const [game, player, userId] = res
  if (game.privateMsgs.get(player.id) === undefined) {
    ctx.reply(ctx.t('game_error.wrong_qn'))
    return
  }

  if (player.role instanceof Roles.Robber) {
    const target = game.playerMap.get(Number(userId))
    if (target === undefined) {
      ctx.answerCallbackQuery(ctx.t('game_error.vote_invalid', { user: userId }))
      return
    }

    game.privateMsgs.get(player.id)?.then(msg => {
      game.ctx.api.editMessageText(player.id, msg.message_id, game.ctx.t('game.vote_cast', { user: target.name }))
    })
    game.privateMsgs.delete(player.id)

    Actions.Swap.fn(game, ctx, [player, target], {
      priority: player.role.priority,
      swapSelf: true,
    })
  } else if (player.role instanceof Roles.Troublemaker) {
    const target = game.playerMap.get(Number(userId))
    if (target === undefined) {
      ctx.answerCallbackQuery(ctx.t('game_error.vote_invalid', { user: userId }))
      return
    }

    ctx.session.actions = [
      {
        name: 'swap',
        gameId: game.id,
        playerId: player.id,
        targetId: userId,
      },
    ]
    await ctx.conversation.enter('troublemaker')
  }
})

export { composer as gameActions }
