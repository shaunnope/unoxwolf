import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import * as Roles from '~/game/roles'

const composer = new Composer<Context>()

const feature = composer.chatType('private')
// const groupFeature = composer.chatType(['group', 'supergroup'])

feature.command('help', logHandle('command-help'), ctx => {
  ctx.reply(ctx.t('welcome.help'))
})

feature.command('rolelist', logHandle('command-rolelist'), async ctx => {
  await ctx.reply(ctx.t('roles.page_base'))
  // await ctx.reply(ctx.t('roles.page_daybreak'))
  // await ctx.reply(ctx.t('roles.page_vampire'))
  // await ctx.reply(ctx.t('roles.page_aliens'))
  // await ctx.reply(ctx.t('roles.page_bonus'))
})

Object.values(Roles).forEach(role => {
  feature.command(role.info.descCommand, logHandle(`command-${role.info.descCommand}`), ctx => {
    ctx.reply(`<strong>${ctx.t(role.roleName)}</strong>\n${ctx.t(role.description)}`)
  })
})

export { composer as helpFeature }
