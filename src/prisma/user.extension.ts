import { Prisma, Role } from "@prisma/client"
import type { PrismaClientX } from "~/prisma"

export default Prisma.defineExtension({
  name: "user",
  result: {
    user: {
      isAdmin: {
        needs: { role: true },
        compute(user) {
          return user.role === Role.ADMIN
        },
      },
    },
  },
  model: {
    user: {
      byTelegramId(telegramId: number) {
        return {
          telegramId,
        } satisfies Prisma.UserWhereInput
      },

      byTelegramIds(telegramIds: number[]) {
        return {
          telegramId: {
            in: telegramIds,
          },
        } satisfies Prisma.UserWhereInput
      },

      hasAdminRole() {
        return {
          role: Role.ADMIN,
        } satisfies Prisma.UserWhereInput
      },

      withRoles() {
        return {
          role: true,
          isAdmin: true,
        } satisfies Prisma.UserSelect<PrismaClientX["$extends"]["extArgs"]>
      },
    },
  },
})
