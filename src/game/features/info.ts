import { Composer } from "grammy"
import type { Context } from "~/bot/context"
import { logHandle } from "~/bot/helpers/logging"

import { getRoleListEntry } from "~/game/helpers/commandlist"
import * as Roles from "~/game/roles"
import * as RoleGroups from "~/game/roles/role.groups"

import { statsFeature } from "./stats"

const composer = new Composer<Context>()

composer.use(statsFeature)

const feature = composer.chatType("private")
// const groupFeature = composer.chatType(['group', 'supergroup'])

async function phases(ctx: Context) {
  await ctx.reply(
    `${ctx.t("help.copy")}\n${RoleGroups.PHASES.copy.map(role => getRoleListEntry(ctx, role)).join("\n")}\n\n`
    + `${ctx.t("help.night")}\n${RoleGroups.PHASES.night.map(role => getRoleListEntry(ctx, role)).join("\n")}\n\n`,
  )
  await ctx.reply(
    `${ctx.t("help.passive")}\n${RoleGroups.PHASES.passive.map(role => getRoleListEntry(ctx, role)).join("\n")}`,
  )
}

feature.command(
  "help",
  logHandle("command-help"),
  async (ctx, next) => {
    await ctx.reply(ctx.t("help"))
    await next()
  },
  phases,
)

feature.command("phases", logHandle("command-orderinfo"), phases)

feature.command("rolelist", logHandle("command-rolelist"), async (ctx) => {
  let page = ""
  for (const [idx, role] of RoleGroups.ALL_ROLES.entries()) {
    page += `${getRoleListEntry(ctx, role)}\n`
    if (idx % 12 === 11) {
      await ctx.reply(page)
      page = ""
    }
  }
  if (page) {
    await ctx.reply(page)
  }
})

Object.values(Roles).forEach((role) => {
  feature.command(role.info.command, logHandle(`command-${role.info.command}`), (ctx) => {
    ctx.reply(`<strong>${ctx.t(role.roleName)}</strong>\n${ctx.t(role.description)}`)
  })
})

export { composer as infoFeature }
