import { chatAction } from "@grammyjs/auto-chat-action"
import { Role } from "@prisma/client"
import { Composer, Keyboard } from "grammy"
import { or } from "grammy-guard"
import type { Context } from "~/bot/context"
import { isAdminUser, isOwnerUser } from "~/bot/filters"
import { setCommandsHandler } from "~/bot/handlers"
import { DEFAULT_LANGUAGE_CODE, getLanguageCommand, getPrivateChatAdminCommands } from "~/bot/helpers/bot-commands"
import { logHandle } from "~/bot/helpers/logging"
import { userRequests } from "~/bot/helpers/user-requests"

import { isMultipleLocales } from "~/bot/i18n"

const composer = new Composer<Context>()

const feature = composer.chatType("private").filter(or(isOwnerUser, isAdminUser))

const featureForOwner = composer.chatType("private").filter(isOwnerUser)

featureForOwner.command("admin", logHandle("command-admin"), ctx =>
  ctx.reply(ctx.t("admin.select-user"), {
    reply_markup: {
      resize_keyboard: true,
      keyboard: new Keyboard()
        .requestUsers(ctx.t("admin.select-user-btn"), userRequests.getId("make-admin"), {
          user_is_bot: false,
        })
        .build(),
    },
  }))

featureForOwner.filter(
  userRequests.filter("make-admin"),
  logHandle("user-shared-for-admin-role"),
  chatAction("typing"),
  async (ctx) => {
    const userId = ctx.message.users_shared?.users[0].user_id

    if (userId === undefined) {
      return ctx.reply(ctx.t("admin.user-not-found"))
    }

    let user = await ctx.prisma.user.findUnique({
      where: ctx.prisma.user.byTelegramId(userId),
      select: {
        id: true,
        languageCode: true,
        ...ctx.prisma.user.withRoles(),
      },
    })

    if (user === null) {
      return ctx.reply(ctx.t("admin.user-not-found"))
    }

    user = await ctx.prisma.user.update({
      where: ctx.prisma.user.byTelegramId(userId),
      data: {
        role: user.role === Role.ADMIN ? Role.USER : Role.ADMIN,
      },
      select: {
        id: true,
        languageCode: true,
        ...ctx.prisma.user.withRoles(),
      },
    })

    const notifyOwner = ctx.reply(
      ctx.t("admin.user-role-changed", {
        id: user.id,
        role: user.role,
      }),
      {
        reply_markup: {
          remove_keyboard: true,
        },
      },
    )

    const notifyUser = ctx.api.sendMessage(
      userId,
      ctx.t("admin.your-role-changed", {
        role: user.role,
      }),
    )

    const updateCommandsForUser = user.isAdmin
      ? ctx.api.setMyCommands(
        [
          ...getPrivateChatAdminCommands(user.languageCode ?? DEFAULT_LANGUAGE_CODE),
          ...(isMultipleLocales ? [getLanguageCommand(user.languageCode ?? DEFAULT_LANGUAGE_CODE)] : []),
        ],
        {
          scope: {
            type: "chat",
            chat_id: Number(userId),
          },
        },
      )
      : ctx.api.deleteMyCommands({
        scope: {
          type: "chat",
          chat_id: Number(userId),
        },
      })

    return Promise.all([notifyOwner, notifyUser, updateCommandsForUser])
  },
)

feature.command("botstats", logHandle("command-stats"), chatAction("typing"), async (ctx) => {
  const usersCount = await ctx.prisma.user.count()

  return ctx.reply(`Users count: ${usersCount}`)
})

feature.command("setcommands", logHandle("command-setcommands"), chatAction("typing"), setCommandsHandler)

export { composer as botAdminFeature }
