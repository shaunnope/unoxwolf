import { Composer } from "grammy"
import type { Context } from "~/bot/context"
import { logHandle } from "~/bot/helpers/logging"

import type { TEAM_WINLOSE } from "~/prisma/stats.extension"
import { TEAM_WIN } from "~/prisma/stats.extension"

const composer = new Composer<Context>()

const feature = composer.chatType("private")

feature.command("stats", logHandle("command-stats"), async (ctx) => {
  const stats = await ctx.prisma.stats.getUserStats(ctx.from!.id)

  const wins = Object.fromEntries(Object.entries(stats._sum).map(([key, val]) => [key, val || 0])) as Record<
    keyof typeof TEAM_WINLOSE,
    number
  >

  ctx.reply(
    ctx.t("stats", {
      count: stats._count,
      ...Object.entries(wins).reduce(
        (acc, val) => {
          if (Object.keys(TEAM_WIN).includes(val[0])) {
            acc.won += val[1]
          }
          else {
            acc.lost += val[1]
          }
          return acc
        },
        {
          won: 0,
          lost: 0,
        },
      ),
      ...wins,
    }),
  )
})

export { composer as statsFeature }
