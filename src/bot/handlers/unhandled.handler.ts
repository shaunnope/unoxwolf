import { Composer } from 'grammy'
import type { Context } from '~/bot/context'

import { logHandle } from '~/bot/helpers/logging'

const composer = new Composer<Context>()

composer.on('::bot_command', logHandle('unhandled-command'), ctx => ctx.reply(ctx.t('unhandled')))

composer.on(':text', logHandle('unhandled'))

export { composer as unhandledHandler }
