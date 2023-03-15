import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

const composer = new Composer<Context>()

const feature = composer

feature.command('roll', logHandle('command-rng'), async ctx => {
  ctx.replyWithDice(['🎲', '🎯', '🎳', '🎰', '🏀', '⚽'][Math.floor(Math.random() * 6)])
})

export { composer as miscFeature }
