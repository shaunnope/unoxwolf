import type { Context } from "~/bot/context"
import * as Actions from "~/game/gameplay/actions"
import { Team } from "~/game/models/enums"
import type { GameInfo } from "~/game/models/game"
import type { Player } from "~/game/models/player"

import type { RoleInfo } from "~/game/models/role"
import { Role } from "~/game/models/role"

export interface CanCopy {
  copiedRole?: Role
  copy: (player: Player, game: GameInfo) => void
}

export class Copier extends Role implements CanCopy {
  static readonly info: RoleInfo = {
    name: "role",
    team: Team.Village,
    command: "rolelist",
  }

  copiedRole?: Role

  // NOTE: can fail with cycles (more than 1 active doppelganger)
  // Ultimately a non-issue since at most 1 doppelganger can be active at a time
  get tail(): Role {
    if (this.copiedRole === undefined)
      return this
    if (!isCopier(this.copiedRole))
      return this.copiedRole
    return this.copiedRole.tail
  }

  fullRole(ctx: Context) {
    return `${ctx.t(this.tail.name)}${ctx.t(this.emoji)}`
  }

  copy(player: Player, game: GameInfo): void {
    if (player.ctx === undefined) {
      Actions.Copy.fallback(game, player)
      return
    }
    Actions.Copy.setup(game, player)
  }

  doNight(player: Player, game: GameInfo): void {
    if (this.copiedRole === undefined) {
      super.doNight(player, game)
      return
    }
    this.tail.doNight(player, game)
  }

  checkWin(player: Player, game: GameInfo): void {
    if (this.copiedRole === undefined) {
      super.checkWin(player, game)
      return
    }
    this.tail.checkWin(player, game)
  }

  lynch(player: Player, game: GameInfo): boolean {
    if (this.copiedRole === undefined) {
      return super.lynch(player, game)
    }
    return this.tail.lynch(player, game)
  }
}

export function isCopier(role: Role): role is Copier {
  return (role as Copier).copy !== undefined
}
