import { Role, Player, RoleInfo } from '../models/player'
import { GameInfo } from '../models/game'
import { createVoteKB, getOptions, sendActionPrompt } from '../helpers/keyboards'
import { Team } from '../models/enums'

export interface CanCopy {
  copiedRole?: Role
  copy(player: Player, game: GameInfo): void
}

export class Copier extends Role implements CanCopy {
  static readonly info: RoleInfo = {
    name: 'role',
    team: Team.Copy,
    descCommand: 'rolelist',
  }

  copiedRole?: Role

  copy(player: Player, game: GameInfo): void {
    if (player.ctx === undefined) {
      // TODO: fallback
      return
    }
    const options = getOptions(game.players, other => other.id !== player.id)
    const kb = createVoteKB(options, `copy${game.id}`)
    // TODO: add pass option

    game.privateMsgs.set(player.id, sendActionPrompt(player, `role_message.${this.info.name}_action`, kb)!)
  }

  doNight(player: Player, game: GameInfo): void {
    if (this.copiedRole === undefined) {
      super.doNight(player, game)
      return
    }
    this.copiedRole.doNight(player, game)
  }
}

export const isCopier = (role: Role): role is Copier => {
  return (role as Copier).copy !== undefined
}
