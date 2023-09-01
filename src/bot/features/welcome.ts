import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

const composer = new Composer<Context>()

const feature = composer.chatType('private')
const groupFeature = composer.chatType(['group', 'supergroup'])

feature.command('start', logHandle('command-start'), ctx => ctx.reply(ctx.t('welcome')))
groupFeature.command('start', logHandle('command-start'), ctx => ctx.reply(ctx.t('welcome.group')))

export { composer as welcomeFeature }
