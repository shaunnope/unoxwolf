import { Composer } from 'grammy'
import type { Context } from '~/bot/context'
import { logHandle } from '~/bot/helpers/logging'

import * as Roles from '~/game/roles'
import * as RoleGroups from '~/game/roles/role.groups'
import { getRoleListEntry } from '~/game/helpers/rolelist'

import { statsFeature } from './stats'

const composer = new Composer<Context>()

composer.use(statsFeature)

const feature = composer.chatType('private')
// const groupFeature = composer.chatType(['group', 'supergroup'])

feature.command('help', logHandle('command-help'), ctx => {
  ctx.reply(ctx.t('welcome.help'))
})

feature.command('rolelist', logHandle('command-rolelist'), async ctx => {
  let page = ''
  for (const [idx, role] of RoleGroups.ALL_ROLES.entries()) {
    page += `${getRoleListEntry(ctx, role)}\n`
    if (idx % 12 === 11) {
      await ctx.reply(page)
      page = ''
    }
  }
  if (page) {
    await ctx.reply(page)
  }
})

Object.values(Roles).forEach(role => {
  feature.command(role.info.command, logHandle(`command-${role.info.command}`), ctx => {
    ctx.reply(`<strong>${ctx.t(role.roleName)}</strong>\n${ctx.t(role.description)}`)
  })
})

export { composer as infoFeature }
