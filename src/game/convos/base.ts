import { createConversation } from "@grammyjs/conversations"
import type { Context, Conversation } from "~/bot/context"
import { games } from "~/container"
import * as Actions from "~/game/gameplay/actions"
import { validateCallbackQuery, validateTarget } from "~/game/helpers/game.context"
import { Keyboard } from "~/game/helpers/keyboards"

export async function troublemaker(conversation: Conversation, ctx: Context) {
  const { gameId, targetId } = ctx.session.actions[0]
  const game = games.get(gameId)!

  if (!Number(targetId))
    return
  const target = game.playerMap.get(Number(targetId))!
  const playerId = ctx.from!.id

  await conversation.external(() => {
    const kb = new Keyboard(game).addPlayers(other => other.id !== playerId && other.id !== target.id, "swap")
    game.privateMsgs.get(playerId)?.then((msg) => {
      ctx.api.editMessageText(playerId, msg.message_id, game.ctx.t("vote.cast", { user: target.name }))
    })
    game.privateMsgs.set(
      playerId,
      ctx.reply(ctx.t("troublemaker.action2", { user1: target.name }), { reply_markup: kb.kb }),
    )
  })

  let res: [string, number, number] | undefined
  let actionCtx: Awaited<ReturnType<typeof conversation.waitForCallbackQuery>>
  while (true) {
    actionCtx = await conversation.waitForCallbackQuery(/swap([\w.]+)\+([\w.]+)/)

    res = await conversation.external(() => {
      const val = validateCallbackQuery(actionCtx)
      if (val === undefined)
        return undefined
      const [game, player, userId] = val
      const target = validateTarget(actionCtx, ...val)
      if (target === undefined)
        return undefined

      actionCtx.session.actions.push({
        name: "swap",
        gameId: game.id,
        playerId: player.id,
        targetId: userId,
      })
      return [game.id, player.id, target.id] as [string, number, number]
    })
    if (res === undefined) {
      await actionCtx.answerCallbackQuery(ctx.t("game_error.invalid_vote", { user: actionCtx.match[2] }))
      continue
    }
    await actionCtx.answerCallbackQuery()
    break
  }

  await conversation.external(() => {
    const [{ gameId, playerId, targetId: targetId1 }, { targetId: targetId2 }] = actionCtx.session.actions
    const game = actionCtx.games.get(gameId)
    if (game === undefined)
      return false
    const player = game.playerMap.get(playerId)
    const target1 = game.playerMap.get(Number(targetId1))
    const target2 = game.playerMap.get(Number(targetId2))
    if (player === undefined || target1 === undefined || target2 === undefined)
      return false
    game.privateMsgs.get(playerId)?.then((msg) => {
      ctx.api.editMessageText(playerId, msg.message_id, game.ctx.t("vote.cast", { user: target2.name }))
    })
    game.privateMsgs.delete(playerId)

    Actions.Swap.fn(game, ctx, [target1, target2], {
      priority: player.role.priority,
    })
    return true
  })

  actionCtx.session.actions = []
}

export const TroublemakerConvo = createConversation(troublemaker)
