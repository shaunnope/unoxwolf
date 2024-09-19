import _ from "lodash"
import * as Actions from "~/game/gameplay/actions"
import { Keyboard } from "~/game/helpers/keyboards"
import { Team } from "~/game/models/enums"
import * as Events from "~/game/models/events"
import type { GameInfo } from "~/game/models/game"

import * as G from "~/game/models/game.fn"
import type { Player } from "~/game/models/player"
import type { RoleInfo } from "~/game/models/role"
import { Role } from "~/game/models/role"
import * as Actors from "~/game/roles/actors"

import { Copier } from "./copier"

export class Villager extends Role {
  static readonly info: RoleInfo = {
    name: "villager",
    team: Team.Village,
    command: "roleVG",
  }
}

export class Mason extends Actors.Revealer {
  static readonly info: RoleInfo = {
    name: "mason",
    team: Team.Village,
    command: "roleMason",
  }

  filter(other: Player) {
    return other.role instanceof Mason
  }
}

export class Werewolf extends Actors.Revealer {
  static readonly info: RoleInfo = {
    name: "werewolf",
    team: Team.Werewolf,
    command: "roleWW",
  }

  processLone(game: GameInfo) {
    let msg = game.ctx.t(this.locale("lone"))
    if (game.settings.loneWolf) {
      const role = _.sample(game.unassignedRoles)!.role.info.name
      msg += `\n${game.ctx.t("werewolf.lone2", { role: game.ctx.t(role) })}`
    }

    return msg
  }

  filter(other: Player) {
    return !other.role.info.isAide
  }

  checkWin(player: Player, game: GameInfo): void {
    player.won = G.dead(game, Team.Tanner) === 0 && G.dead(game, Team.Werewolf) === 0
  }
}

export class Seer extends Villager {
  static readonly info: RoleInfo = {
    name: "seer",
    team: Team.Village,
    command: "roleSeer",
    priority: 2,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      return
    }
    const kb = new Keyboard(game)
      .addPlayers(other => other.id !== player.id, "peek")
      .addUnassigned("peek")
      .addPass(player)

    game.privateMsgs.set(player.id, kb.send(player)!)
  }
}

export class Robber extends Actors.Swapper {
  static readonly info: RoleInfo = {
    name: "robber",
    team: Team.Village,
    command: "roleRobber",
    priority: 3,
  }
}

export class Troublemaker extends Actors.Swapper {
  static readonly info: RoleInfo = {
    name: "troublemaker",
    team: Team.Village,
    command: "roleTM",
    priority: 6,
  }
}

// Drunk does not extend Swapper class since swap behaviour is auto
export class Drunk extends Villager {
  static readonly info: RoleInfo = {
    name: "drunk",
    team: Team.Village,
    command: "roleDrunk",
    priority: 12,
  }

  async doNight(player: Player, game: GameInfo) {
    const target = game.unassignedRoles[Math.floor(Math.random() * game.unassignedRoles.length)]
    if (player.ctx === undefined) {
      game.events.push(Events.Swap(player, [player, target], game, this.priority, false))
      return
    }
    Actions.Swap.fn(game, player.ctx, [player, target], {
      priority: this.priority,
      swapSelf: true,
      isAuto: true,
    })
    player.ctx.reply(player.ctx.t("drunk.action", { role: target.name }))
  }
}

export class Insomniac extends Villager {
  static readonly info: RoleInfo = {
    name: "insomniac",
    team: Team.Village,
    command: "roleInsomniac",
    priority: 15,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined)
      return

    Actions.Peek.fn(game, player.ctx, [player], {
      priority: this.priority,
      isAuto: true,
      eventCallback: () => {
        player.ctx!.reply(
          player.ctx!.t(`insomniac.${(player.currentRole === player.innateRole).toString()}`, {
            role: player.ctx!.t(player.currentRole.name),
          }),
        )
      },
    })
  }
}

export class Minion extends Werewolf {
  static readonly info: RoleInfo = {
    ...super.info,
    name: "minion",
    command: "roleMinion",
    isAide: true,
  }

  processLone(game: GameInfo): string {
    return game.ctx.t(this.locale("lone"))
  }

  checkWin(player: Player, game: GameInfo): void {
    player.won
      = G.count(game, Team.Werewolf) === 0
        ? !player.isDead
        : game.winInfo[Team.Werewolf]
  }
}

export class Hunter extends Villager {
  static readonly info: RoleInfo = {
    name: "hunter",
    team: Team.Village,
    command: "roleHunter",
  }

  unalive(player: Player, game: GameInfo) {
    if (!player.isDead && player.votedFor !== undefined) {
      game.events.push(Events.Off(player, player.votedFor, game))
    }

    return super.unalive(player, game)
  }
}

export class Tanner extends Villager {
  static readonly info: RoleInfo = {
    name: "tanner",
    team: Team.Tanner,
    command: "roleTanner",
  }

  checkWin(player: Player) {
    player.won = player.isDead === true
  }
}

export class Doppelganger extends Copier {
  static readonly info: RoleInfo = {
    name: "doppelganger",
    team: Team.Village,
    command: "roleDG",
    priority: 1,
  }

  get priority() {
    if (this.copiedRole === undefined)
      return super.priority
    return this.tail.priority + 0.5
  }
}
