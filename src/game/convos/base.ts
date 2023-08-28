/* eslint-disable no-loop-func */
/* eslint-disable no-continue */
import { createConversation } from '@grammyjs/conversations'
import { Conversation, Context } from '~/bot/context'
import * as Actions from '~/game/gameplay/actions'
import { games } from '~/container'
import { validateCallbackQuery, validateTarget } from '../helpers/game.context'
import { getOptions, createVoteKB } from '../helpers/keyboards'

export const troublemaker = async (conversation: Conversation, ctx: Context) => {
  const { gameId, targetId } = ctx.session.actions[0]
  const game = games.get(gameId)
  if (game === undefined) return
  if (!Number(targetId)) return
  const target = game.playerMap.get(Number(targetId))
  const playerId = ctx.from?.id
  if (playerId === undefined || target === undefined) return

  await conversation.external(() => {
    const leftOptions = getOptions(game.players, other => other.id !== playerId && other.id !== target.id)
    // const leftOptions = game.players.filter(other => other.id !== playerId && other.id !== target.id)
    const leftKb = createVoteKB(leftOptions, `swap${game.id}`)
    game.privateMsgs.get(playerId)?.then(msg => {
      ctx.api.editMessageText(playerId, msg.message_id, game.ctx.t('vote.cast', { user: target.name }))
    })
    game.privateMsgs.set(
      playerId,
      ctx.reply(ctx.t('troublemaker.action2', { user1: target.name }), { reply_markup: leftKb })
    )
  })

  let res: [string, number, number] | undefined
  let actionCtx: Awaited<ReturnType<typeof conversation.waitForCallbackQuery>>
  while (true) {
    actionCtx = await conversation.waitForCallbackQuery(/swap(.+)\+(.+)/)

    res = await conversation.external(() => {
      const val = validateCallbackQuery(actionCtx)
      if (val === undefined) return undefined
      const [game, player, userId] = val
      const target = validateTarget(actionCtx, ...val)
      if (target === undefined) return undefined

      actionCtx.session.actions.push({
        name: 'swap',
        gameId: game.id,
        playerId: player.id,
        targetId: userId,
      })
      return [game.id, player.id, target.id] as [string, number, number]
    })
    if (res === undefined) {
      await actionCtx.answerCallbackQuery(ctx.t('game_error.invalid_vote', { user: actionCtx.match[2] }))
      continue
    }
    await actionCtx.answerCallbackQuery()
    break
  }

  await conversation.external(() => {
    const [{ gameId, playerId, targetId: targetId1 }, { targetId: targetId2 }] = actionCtx.session.actions
    const game = actionCtx.games.get(gameId)
    if (game === undefined) return false
    const player = game.playerMap.get(playerId)
    const target1 = game.playerMap.get(Number(targetId1))
    const target2 = game.playerMap.get(Number(targetId2))
    if (player === undefined || target1 === undefined || target2 === undefined) return false
    game.privateMsgs.get(playerId)?.then(msg => {
      ctx.api.editMessageText(playerId, msg.message_id, game.ctx.t('vote.cast', { user: target2.name }))
    })
    game.privateMsgs.delete(playerId)

    Actions.Swap.fn(game, ctx, [target1, target2], {
      priority: player.role.priority,
    })
    return true
  })
}

export const TroublemakerConvo = createConversation(troublemaker)
