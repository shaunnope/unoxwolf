import _ from 'lodash'
import { Composer, InlineKeyboard } from 'grammy'
import { createConversation } from '@grammyjs/conversations'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import { Game } from '~/game'
import { getGameFromCtx, setGame } from '~/game/helpers/game.context'
import { Conversation } from '~/bot/context'
import { createPlayers } from '../helpers/mock'

const composer = new Composer<Context>()

composer.command('debug', logHandle('command-debug'), ctx => {
  ctx.reply(JSON.stringify(ctx.session))
})

const feature = composer.chatType(['group', 'supergroup'])
const pmFeature = composer.chatType('private')

feature.command('startgame', logHandle('command-startgame-dev'), ctx => {
  // check if game is already started
  if (getGameFromCtx(ctx) !== undefined) {
    ctx.reply(ctx.t('game.already_started'))
    return
  }
  const game = new Game(ctx)
  setGame(ctx, game)

  if (Number(ctx.match) && Number(ctx.match) > 0) {
    game.addPlayers(createPlayers(_.clamp(Number(ctx.match), 1, 10)))
  }
})

pmFeature.command('mockcb', logHandle('command-mockcb'), async ctx => {
  const action = ctx.match || 'vote'
  const kb = new InlineKeyboard().text('Button 1', `${action}abc+-1`).text('Button 2', `${action}def+2`)
  ctx.reply(`Test: ${action}`, { reply_markup: kb })
})

const enterConvo = async (conversation: Conversation, ctx: Context) => {
  ctx.reply('You entered the conversation! Now send me a callback query.')
  const msgCtx = await conversation.waitForCallbackQuery(/vote(.+)\+(.+)/)
  await ctx.reply(`You chose: ${msgCtx.match}`)
  await msgCtx.answerCallbackQuery()
  await ctx.reply('Leaving conversation')
}

pmFeature.use(createConversation(enterConvo))

pmFeature.command('enter', logHandle('command-enter'), async ctx => {
  await ctx.conversation.enter('enterConvo')
})

export { composer as devGameFeature }
