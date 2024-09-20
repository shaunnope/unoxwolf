import type { PrismaClientX } from "."
import { Prisma } from "@prisma/client"
import { Team } from "~/game/models/enums"
import type { GameInfo } from "~/game/models/game"

import type { Player } from "~/game/models/player"

function incTeamStat(team: Team, p: Player, win: boolean) {
  return p.currentRole.info.team === team && p.won === win ? 1 : 0
}

export const TEAM_WIN = {
  villageWin: true as const,
  werewolfWin: true as const,
  tannerWin: true as const,
}

export const TEAM_LOSE = {
  villageLose: true as const,
  werewolfLose: true as const,
  tannerLose: true as const,
}

export const TEAM_WINLOSE = {
  ...TEAM_WIN,
  ...TEAM_LOSE,
}

// export type UserStats = {
//   chatId: bigint
//   topicId: bigint
// } & Record<keyof typeof TEAM_WINS, number>

const statsExtension = Prisma.defineExtension({
  name: "stats",
  result: {
    stats: {
      totalGames: {
        needs: TEAM_WINLOSE,
        compute(stats) {
          return Object.values(stats).reduce((acc, val) => acc + val, 0)
        },
      },
    },
  },
  model: {
    stats: {
      byUserGroup(userId: number, chatId: number, topicId: number) {
        return {
          group_id: {
            userId,
            chatId,
            topicId,
          },
        } satisfies Prisma.StatsWhereUniqueInput
      },
      byUserChat(userId: number, chatId: number) {
        return {
          userId,
          chatId,
        } satisfies Prisma.StatsWhereInput
      },

      async getUserGroupStats(userId: number, chatId: number, topicId: number) {
        return Prisma.getExtensionContext(this).findUnique({
          where: Prisma.getExtensionContext(this).byUserGroup(userId, chatId, topicId),
          select: {
            ...TEAM_WINLOSE,
          },
        })
      },
      async getUserChatStats(userId: number, chatId: number, aggregate: boolean = true) {
        return aggregate
          ? Prisma.getExtensionContext(this).aggregate({
            _sum: {
              ...TEAM_WINLOSE,
            },
            where: Prisma.getExtensionContext(this).byUserChat(userId, chatId),
          })
          : Prisma.getExtensionContext(this).findMany({
            where: Prisma.getExtensionContext(this).byUserChat(userId, chatId),
            select: {
              ...TEAM_WINLOSE,
            },
          })
      },
      async getUserStats(userId: number) {
        return Prisma.getExtensionContext(this).aggregate({
          _count: true,
          _sum: {
            ...TEAM_WINLOSE,
          },
          where: {
            userId,
          },
        })
      },

      async logGame(p: Player, game: GameInfo) {
        const topicId = game.topicId || -1
        await Prisma.getExtensionContext(this).upsert({
          where: Prisma.getExtensionContext(this).byUserGroup(p.id, game.chatId, topicId),

          create: {
            userId: p.id,
            chatId: game.chatId,
            topicId,
            villageWin: incTeamStat(Team.Village, p, true),
            villageLose: incTeamStat(Team.Village, p, false),
            werewolfWin: incTeamStat(Team.Werewolf, p, true),
            werewolfLose: incTeamStat(Team.Werewolf, p, false),
            tannerWin: incTeamStat(Team.Tanner, p, true),
            tannerLose: incTeamStat(Team.Tanner, p, false),
          },

          update: {
            villageWin: {
              increment: incTeamStat(Team.Village, p, true),
            },
            villageLose: {
              increment: incTeamStat(Team.Village, p, false),
            },
            werewolfWin: {
              increment: incTeamStat(Team.Werewolf, p, true),
            },
            werewolfLose: {
              increment: incTeamStat(Team.Werewolf, p, false),
            },
            tannerWin: {
              increment: incTeamStat(Team.Tanner, p, true),
            },
            tannerLose: {
              increment: incTeamStat(Team.Tanner, p, false),
            },
          },
        })
      },
    },
  },
})

export type UserStats = Awaited<
  ReturnType<ReturnType<PrismaClientX["$extends"]["extArgs"]["model"]["stats"]["getUserStats"]>>
>

export default statsExtension
