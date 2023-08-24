import _ from 'lodash'
import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import { Game } from '~/game'
import { getGame, setGame } from '~/game/helpers/game.context'
import { gameActions } from './game.actions'

const composer = new Composer<Context>()

const feature = composer.chatType(['group', 'supergroup'])
const pmFeature = composer.chatType('private')

pmFeature.command('start', logHandle('command-start'), ctx => {
  if (!ctx.match) {
    ctx.reply(ctx.t('welcome'))
    return
  }
  if (ctx.match.slice(0, 4) === 'join') {
    const game = ctx.games.get(ctx.match.slice(4))
    if (game === undefined) return
    game.addPlayer(ctx)
  }
})

feature.command('startgame', logHandle('command-startgame'), ctx => {
  // check if game is already started
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
  // TODO: consider handling spam by checking last message time
  game.serviceMsgs.push(ctx.reply(ctx.t('game.join_prompt'), { reply_markup: game.callToAction }))
})

feature.command('leave', logHandle('command-leave'), async ctx => {
  const game = getGame(ctx)
  if (game === undefined) {
    ctx.reply(ctx.t('game.not_started'))
    return
  }
  if (game.state !== 'lobby') {
    ctx.reply(ctx.t('game.no_leave'))
    return
  }
  if (game.playerMap.has(ctx.from?.id)) {
    game.removePlayer(ctx)
    ctx.reply(ctx.t('game.player_flee', { user: ctx.from?.first_name }))
  }
})

// FIXME: this does not seem to work
feature.command('nextphase', logHandle('command-nextphase'), async ctx => {
  const game = getGame(ctx)
  if (game === undefined) return
  // TODO - more conditions: only allow admin/ game owner to skip timer etc.
  if (game.flags.timerRunning) {
    game.flags.killTimer = true
    ctx.reply(ctx.t('game.timer_skipped'))
  }
})

composer.use(gameActions)

export { composer as gameFeature }
