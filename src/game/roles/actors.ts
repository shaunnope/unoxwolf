import { Keyboard } from "~/game/helpers/keyboards"
import type { GameInfo } from "~/game/models/game"

import * as G from "~/game/models/game.fn"
import type { Player } from "~/game/models/player"
import { Role } from "~/game/models/role"

export abstract class Revealer extends Role {
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
  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      // TODO: fallback
      return
    }
    const kb = new Keyboard(game)
      .addPlayers(other => other.id !== player.id, "swap")
      .addPass(player)

    game.privateMsgs.set(player.id, kb.send(player)!)
  }
}
