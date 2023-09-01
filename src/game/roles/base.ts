/* eslint-disable class-methods-use-this */ // TODO: consider how to refactor methods to avoid this
import _ from 'lodash'
import { GameInfo } from '~/game/models/game'
import { Team } from '~/game/models/enums'
import { Player } from '~/game/models/player'
import { Role, RoleInfo } from '~/game/models/role'

import * as Actions from '~/game/gameplay/actions'
import * as Events from '~/game/models/events'
import { createVoteKB, getOptions, sendActionPrompt } from '../helpers/keyboards'

import { Copier } from './copier'

export class Villager extends Role {
  static readonly info: RoleInfo = {
    name: 'villager',
    team: Team.Village,
    command: 'roleVG',
  }
}

export class Werewolf extends Role {
  static readonly info: RoleInfo = {
    name: 'werewolf',
    team: Team.Werewolf,
    command: 'roleWW',
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) return
    const teamMembers = game.teams
      .get(this.info.team)!
      .filter(other => other.id !== player.id && !other.role.info.isAide)
    let msg = ''
    if (teamMembers.length === 1) {
      msg = game.ctx.t('werewolf.lone')
      if (game.settings.loneWolf) {
        const role = _.sample(game.unassignedRoles)!.role.info.name
        msg += `\n${game.ctx.t('werewolf.lone2', { role: game.ctx.t(role) })}`
      }
    } else {
      msg = game.ctx.t('werewolf.reveal', {
        wolves: teamMembers.map(p => p.name).join(', '),
      })
    }
    player.ctx.reply(msg)
  }

  checkWin(player: Player, game: GameInfo): void {
    player.won = (game.deaths.get(Team.Werewolf)?.length || 0) === 0
  }
}

export class Seer extends Villager {
  static readonly info: RoleInfo = {
    name: 'seer',
    team: Team.Village,
    command: 'roleSeer',
    priority: 2,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      return
    }
    const options = getOptions(game.players, other => other.id !== player.id)
    const kb = createVoteKB(options, `peek${game.id}`)

    const extraOptions = [[game.ctx.t('misc.unassigned', { count: 2 }), `peek${game.id}+un`]]
    kb.text(extraOptions[0][0], extraOptions[0][1])

    game.privateMsgs.set(player.id, sendActionPrompt(player, kb)!)
  }
}

export class Robber extends Villager {
  static readonly info: RoleInfo = {
    name: 'robber',
    team: Team.Village,
    command: 'roleRobber',
    priority: 3,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      // TODO: fallback
      return
    }
    const options = getOptions(game.players, other => other.id !== player.id)
    const kb = createVoteKB(options, `swap${game.id}`)

    game.privateMsgs.set(player.id, sendActionPrompt(player, kb)!)
  }
}

export class Troublemaker extends Villager {
  static readonly info: RoleInfo = {
    name: 'troublemaker',
    team: Team.Village,
    command: 'roleTM',
    priority: 6,
  }

  async doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      return
    }

    const options = getOptions(game.players, other => other.id !== player.id)
    const kb = createVoteKB(options, `swap${game.id}`)
    // TODO: add pass option

    game.privateMsgs.set(player.id, sendActionPrompt(player, kb)!)
  }
}

export class Drunk extends Villager {
  static readonly info: RoleInfo = {
    name: 'drunk',
    team: Team.Village,
    command: 'roleDrunk',
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
    player.ctx.reply(player.ctx.t('drunk.action', { role: target.name }))
  }

  checkWin(player: Player, game: GameInfo): void {
    player.won = (game.teams.get(Team.Werewolf)?.length || 0) > 0
  }
}

export class Mason extends Villager {
  static readonly info: RoleInfo = {
    name: 'mason',
    team: Team.Village,
    command: 'roleMason',
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) return
    const teamMembers = game.teams
      .get(this.info.team)!
      .filter(other => other.id !== player.id && other.role instanceof Mason)
    let msg = ''
    if (teamMembers.length === 0) {
      msg = game.ctx.t('mason.lone')
    } else {
      msg = game.ctx.t('mason.reveal', {
        masons: teamMembers.map(p => p.name).join(', '),
      })
    }
    player.ctx.reply(msg)
  }
}

export class Insomniac extends Villager {
  static readonly info: RoleInfo = {
    name: 'insomniac',
    team: Team.Village,
    command: 'roleInsomniac',
    priority: 15,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) return

    Actions.Peek.fn(game, player.ctx, [player], {
      priority: this.priority,
      isAuto: true,
      eventCallback: () => {
        player.ctx!.reply(
          player.ctx!.t(`insomniac.${(player.currentRole === player.innateRole).toString()}`, {
            role: player.ctx!.t(player.currentRole.name),
          })
        )
      },
    })
  }
}

export class Minion extends Werewolf {
  static readonly info: RoleInfo = {
    name: 'minion',
    team: Team.Werewolf,
    command: 'roleMinion',
    isAide: true,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) return
    const teamMembers = game.teams
      .get(this.info.team)!
      .filter(other => other.id !== player.id && !other.role.info.isAide)
    let msg = ''
    if (teamMembers.length === 0) {
      msg = game.ctx.t('minion.lone')
    } else {
      msg = game.ctx.t('minion.reveal', {
        wolves: teamMembers.map(p => p.name).join(', '),
      })
    }
    player.ctx.reply(msg)
  }

  checkWin(player: Player, game: GameInfo): void {
    player.won =
      (game.teams.get(this.info.team)?.length || 0) === 0
        ? !player.isDead
        : (game.deaths.get(Team.Werewolf)?.length || 0) === 0
  }
}

export class Hunter extends Villager {
  static readonly info: RoleInfo = {
    name: 'hunter',
    team: Team.Village,
    command: 'roleHunter',
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
    name: 'tanner',
    team: Team.Tanner,
    command: 'roleTanner',
  }

  checkWin(player: Player) {
    player.won = player.isDead === true
  }
}

export class Doppelganger extends Copier {
  static readonly info: RoleInfo = {
    name: 'doppelganger',
    team: Team.Village,
    command: 'roleDG',
    priority: 1,
  }

  get priority() {
    if (this.copiedRole === undefined) return super.priority
    return this.tail.priority + 0.5
  }
}
