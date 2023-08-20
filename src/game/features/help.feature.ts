import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import * as Roles from '~/game/roles'

const composer = new Composer<Context>()

const feature = composer.chatType('private')
const groupFeature = composer.chatType(['group', 'supergroup'])

feature.command('help', logHandle('command-help'), ctx => {
  ctx.reply(ctx.t('welcome.help'))
})

feature.command('rolelist', logHandle('command-rolelist'), ctx => {
  ctx.reply(ctx.t('roles.page_base'))
  ctx.reply(ctx.t('roles.page_daybreak'))
  ctx.reply(ctx.t('roles.page_vampire'))
  ctx.reply(ctx.t('roles.page_aliens'))
  ctx.reply(ctx.t('roles.page_bonus'))
})

for (const role of Object.values(Roles)) {
  feature.command(role.descCommand, logHandle('command-'+role.descCommand), ctx => {
    ctx.reply(ctx.t(role.description))
  })
}

export { composer as helpFeature }
