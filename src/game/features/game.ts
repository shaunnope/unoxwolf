import _ from 'lodash'
import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import { Game } from '~/game'
import { getChatTitle, getGameFromCtx, playerInGame, setGame } from '~/game/helpers/game.context'
import { gameActions } from './actions'
import { gameConvos } from './convos'

const composer = new Composer<Context>()
/**
 * conversations must be registered before `start` command
 * otherwise player `Context`s will not contain the registered
 * conversations
 */
composer.use(gameConvos)

const feature = composer.chatType(['group', 'supergroup'])
const pmFeature = composer.chatType('private')

pmFeature.command('start', logHandle('command-start'), ctx => {
  if (!ctx.match) {
    ctx.reply(ctx.t('welcome'))
    return
  }
  if (ctx.match.slice(0, 4) === 'join') {
    const game = ctx.games.get(ctx.match.slice(4))
    if (game === undefined) return // no active game

    const status = playerInGame(game, ctx)
    if (status === false) {
      game.addPlayer(ctx)
      return
    }
    ctx.reply(ctx.t(`game_init.${status}`, { chat: getChatTitle(ctx.games.get(ctx.session.game)!.ctx) }))
  }
})

feature.command('startgame', logHandle('command-startgame'), async ctx => {
  // check if game is already started
  if (getGameFromCtx(ctx) !== undefined) {
    ctx.reply(ctx.t('game.already_started'))
    return
  }
  setGame(ctx, new Game(ctx))
})

feature.command('join', logHandle('command-join'), async ctx => {
  const game = getGameFromCtx(ctx)
  if (game === undefined) {
    ctx.reply(ctx.t('game.not_started'))
    return
  }

  if (game.state !== 'lobby') {
    ctx.reply(ctx.t('join.failure'))
    return
  }
  // TODO: consider handling spam by checking last message time
  game.serviceMsgs.push(await ctx.reply(ctx.t('join.prompt'), { reply_markup: game.callToAction }))
})

feature.command('leave', logHandle('command-leave'), async ctx => {
  const game = getGameFromCtx(ctx)
  if (game === undefined) {
    ctx.reply(ctx.t('game.not_started'))
    return
  }
  if (game.state !== 'lobby') {
    ctx.reply(ctx.t('leave.failure'))
    return
  }
  if (game.playerMap.has(ctx.from?.id)) {
    game.removePlayer(ctx)
    ctx.reply(ctx.t('leave.success', { user: ctx.from?.first_name }))
  }
})

// FIXME: this does not seem to work
feature.command('nextphase', logHandle('command-nextphase'), async ctx => {
  const game = getGameFromCtx(ctx)
  if (game === undefined) return
  // TODO - more conditions: only allow admin/ game owner to skip timer etc.
  if (game.flags.timerRunning) {
    game.flags.killTimer = true
    ctx.reply(ctx.t('game.timer_skipped'))
  }
})

composer.use(gameActions)

export { composer as gameFeature }
