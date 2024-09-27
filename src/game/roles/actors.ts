import * as Actions from "~/game/gameplay/actions"
import type { GameInfo } from "~/game/models/game"

import * as G from "~/game/models/game.fn"
import type { Player } from "~/game/models/player"
import type { Abilities } from "~/game/models/role"
import { Role } from "~/game/models/role"

export abstract class Revealer extends Role {
  static readonly can: Abilities = {
    reveal: true,
  }

  processLone(game: GameInfo) {
    return game.ctx.t(this.locale("lone"))
  }

  processReveal(game: GameInfo, members: Player[]) {
    return game.ctx.t(this.locale("reveal"), {
      others: members.map(p => p.name).join(", "),
      num: members.length,
    })
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined)
      return
    const teamMembers = G.members(game, player, this.info.team, this.filter)
    const msg = teamMembers.length === 0 ? this.processLone(game) : this.processReveal(game, teamMembers)

    player.ctx.reply(msg)
  }

  abstract filter(other: Player): boolean
}

export abstract class Swapper extends Role {
  static readonly can: Abilities = {
    swap: true,
  }

  doNight(player: Player, game: GameInfo) {
    Actions.Swap.setup(game, player)
  }
}
