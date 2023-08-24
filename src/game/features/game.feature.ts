import _ from 'lodash'
import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import { Game } from '~/game'
import { getChatTitle, getGame, setGame } from '~/game/helpers/game.context'
import * as Actions from '~/game/roles/base.actions'
import * as Roles from '~/game/roles'

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

pmFeature.callbackQuery(/vote(.+)\+(.+)/, logHandle('callback-vote'), async ctx => {
  const [, gameId, userId] = ctx.match
  const game = ctx.games.get(gameId)
  if (game === undefined) {
    ctx.reply(ctx.t('game.not_started'))
    return
  }
  if (!game.playerMap.has(ctx.from?.id)) {
    ctx.reply(ctx.t('game_error.not_in_game', { chat: getChatTitle(game.ctx) }))
    return
  }
  const target = game.playerMap.get(Number(userId))
  if (target === undefined) {
    ctx.answerCallbackQuery(ctx.t('game_error.vote_invalid', { user: userId }))
    return
  }

  Actions.Vote.fn(game, ctx, [target])
})

pmFeature.callbackQuery(/peek(.+)\+(.+)/, logHandle('callback-peek'), async ctx => {
  const [, gameId, userId] = ctx.match
  const game = ctx.games.get(gameId)
  if (game === undefined) {
    ctx.reply(ctx.t('game.not_started'))
    return
  }
  const player = game.playerMap.get(ctx.from?.id)
  if (player === undefined) {
    ctx.reply(ctx.t('game_error.not_in_game', { chat: getChatTitle(game.ctx) }))
    return
  }
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

export { composer as gameFeature }
