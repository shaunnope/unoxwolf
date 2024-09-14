// TODO: consider how to refactor methods to avoid this
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

import { Copier } from "./copier"

function villageWin(player: Player, game: GameInfo): void {
  // TODO: change when other non-village teams are added
  player.won
    = G.count(game, Team.Werewolf) > 0
      ? G.dead(game, Team.Werewolf) > 0
      : G.dead(game, Team.Tanner) === 0
}

export class Villager extends Role {
  static readonly info: RoleInfo = {
    name: "villager",
    team: Team.Village,
    command: "roleVG",
  }

  checkWin(player: Player, game: GameInfo): void {
    villageWin(player, game)
  }
}

export class Mason extends Villager {
  static readonly info: RoleInfo = {
    ...super.info,
    name: "mason",
    command: "roleMason",
  }

  processLone(game: GameInfo) {
    return game.ctx.t(this.locale("lone"))
  }

  processReveal(game: GameInfo, members: Player[]) {
    return game.ctx.t(this.locale("reveal"), {
      others: members.map(p => p.name).join(", "),
    })
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined)
      return
    const teamMembers = G.members(game, player, this.info.team)
    const msg = teamMembers.length === 0 ? this.processLone(game) : this.processReveal(game, teamMembers)

    player.ctx.reply(msg)
  }
}

export class Werewolf extends Mason {
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

export class Robber extends Villager {
  static readonly info: RoleInfo = {
    ...super.info,
    name: "robber",
    command: "roleRobber",
    priority: 3,
  }

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

export class Troublemaker extends Robber {
  static readonly info: RoleInfo = {
    ...super.info,
    name: "troublemaker",
    command: "roleTM",
    priority: 6,
  }
}

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
      = G.dead(game, Team.Tanner) === 0 && (
        G.count(game, Team.Werewolf) === 0
          ? !player.isDead
          : G.dead(game, Team.Werewolf) === 0
      )
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

  defaultWin(player: Player, game: GameInfo): void {
    villageWin(player, game)
  }
}
