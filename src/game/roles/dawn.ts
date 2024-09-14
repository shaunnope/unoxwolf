// TODO: consider how to refactor methods to avoid this
import { Team } from "~/game/models/enums"
import type { GameInfo } from "~/game/models/game"
import type { Player } from "~/game/models/player"
import type { RoleInfo } from "~/game/models/role"

import { Seer } from "."

import { Keyboard } from "../helpers/keyboards"

export class Fool extends Seer {
  static readonly info: RoleInfo = {
    name: "fool",
    team: Team.Village,
    command: "roleFool",
    priority: 7,
    mask: "seer",
  }
  // TODO: the fool should be masked as the seer only if there is no seer in game
  // otherwise, mask as villager
  // TODO: the fool should act as the village idiot in onuw. Issue: no clear notion of left/right atm
}

export class ApprenticeSeer extends Seer {
  static readonly info: RoleInfo = {
    name: "apprentice_seer",
    team: Team.Village,
    command: "roleAppS",
    priority: 2,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      return
    }
    const kb = new Keyboard(game).addUnassigned("peek", 1).addPass(player)

    game.privateMsgs.set(player.id, kb.send(player)!)
  }
}
