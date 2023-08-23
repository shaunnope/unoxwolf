import { Composer, InlineKeyboard } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import { Game } from '~/game'
import { getGame, setGame } from '~/game/helpers/game.context'
import { createPlayers } from '../helpers/mock'

const composer = new Composer<Context>()

composer.command('debug', logHandle('command-debug'), ctx => {
  ctx.reply(JSON.stringify(ctx.session))
})

const feature = composer.chatType(['group', 'supergroup'])
const pmFeature = composer.chatType('private')

feature.command('startgame', logHandle('command-startgame-dev'), ctx => {
  // check if game is already started
  if (getGame(ctx) !== undefined) {
    ctx.reply(ctx.t('game.already_started'))
    return
  }
  const game = new Game(ctx)
  setGame(ctx, game)

  if (Number(ctx.match) && Number(ctx.match) > 0) {
    game.addPlayers(createPlayers(Number(ctx.match)))
  }
})

pmFeature.command('mockcb', logHandle('command-mockcb'), async ctx => {
  const kb = new InlineKeyboard().text('Vote', 'voteabc+-1+asubu').text('Vote2', 'vote2as+asp+koqwn')
  ctx.reply('Test', { reply_markup: kb })
})

export { composer as devGameFeature }
