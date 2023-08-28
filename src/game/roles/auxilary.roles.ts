/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { Context } from '~/bot/context'
import { Role, Player, RoleInfo } from '../models/player'
import { GameInfo } from '../models/game'
import { Team } from '../models/enums'

import * as Actions from '../gameplay/actions'

export interface CanCopy {
  copiedRole?: Role
  copy(player: Player, game: GameInfo): void
}

export class Copier extends Role implements CanCopy {
  static readonly info: RoleInfo = {
    name: 'role',
    team: Team.Village,
    command: 'rolelist',
  }

  copiedRole?: Role

  get tail(): Role {
    if (this.copiedRole === undefined) return this
    if (!isCopier(this.copiedRole)) return this.copiedRole
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
    this.copiedRole.doNight(player, game)
  }

  checkWin(player: Player, game: GameInfo): void {
    this.tail.checkWin(player, game)
  }
}

export const isCopier = (role: Role): role is Copier => {
  return (role as Copier).copy !== undefined
}
