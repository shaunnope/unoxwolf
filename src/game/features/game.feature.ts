import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import { Game } from '~/game'
import { getGame, setGame } from '~/game/helpers/game.context'

const composer = new Composer<Context>()

composer.command('debug', logHandle('command-debug'), ctx => {
  ctx.reply(JSON.stringify(ctx.session))
  console.log(ctx.session)
  console.log(ctx.games.size)
})

const feature = composer.chatType(['group', 'supergroup'])

feature.command('startgame', logHandle('command-startgame'), ctx => {
  //check if game is already started
  if (getGame(ctx) !== undefined) {
    ctx.reply(ctx.t('game.already_started'))
    return
  }

  const game = new Game(ctx)
  setGame(ctx, game)
})

feature.command('join', logHandle('command-join'), async ctx => {
  const game = getGame(ctx)
  if (game === undefined) {
    ctx.reply(ctx.t('game.not_started'))
    return
  }

  if (game.state !== 'lobby') {
    ctx.reply(ctx.t('game.no_join'))
    return
  }
  if (!game._players.has(ctx.from?.id)) {
    game.addPlayer(ctx)
  }

})

feature.command('leave', logHandle('command-leave'), async ctx => {
  const game = getGame(ctx)
  if (!game) {
    ctx.reply(ctx.t('game.not_started'))
    return
  }
  if (game.state !== 'lobby') {
    ctx.reply(ctx.t('game.no_leave'))
    return
  }
  if (game._players.has(ctx.from?.id)) {
    game.removePlayer(ctx)
    ctx.reply(ctx.t('game.player_flee', { user: ctx.from?.first_name }))
  }
})

export { composer as gameFeature }