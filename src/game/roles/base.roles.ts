/* eslint-disable class-methods-use-this */ // TODO: consider how to refactor methods to avoid this
import _ from 'lodash'
import { GameInfo } from '~/game/models/game'
import { Team } from '~/game/models/enums'
import { Role, RoleInfo, Player } from '~/game/models/player'

import * as Actions from '~/game/gameplay/actions'
import * as Events from '~/game/models/events'
import { createVoteKB, getOptions, sendActionPrompt } from '../helpers/keyboards'

import { Copier } from './auxilary.roles'

export class Villager extends Role {
  static readonly info: RoleInfo = {
    name: 'villager',
    team: Team.Village,
    descCommand: 'roleVG',
  }
}

export class Werewolf extends Role {
  static readonly info: RoleInfo = {
    name: 'werewolf',
    team: Team.Werewolf,
    descCommand: 'roleWW',
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) return
    const teamMembers = game.teams
      .get(this.info.team)
      ?.filter(other => other.id !== player.id && !other.role.info.isAide)
    if (teamMembers === undefined) return // NOTE: for coverage, this should never happen
    let msg = ''
    if (teamMembers.length === 1) {
      msg = game.ctx.t('werewolf.lone')
      if (game.settings.loneWolf) {
        const role = _.sample(game.unassignedRoles)?.role.info.name || 'null'
        msg += `\n${game.ctx.t('werewolf.lone2', { role: game.ctx.t(role) })}`
      }
    } else {
      msg = game.ctx.t('werewolf.reveal', {
        wolves: teamMembers.map(p => p.name).join(', '),
      })
    }
    player.ctx.reply(msg)
  }
}

export class Seer extends Villager {
  static readonly info: RoleInfo = {
    name: 'seer',
    team: Team.Village,
    descCommand: 'roleSeer',
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      return
    }
    const options = getOptions(game.players, other => other.id !== player.id)
    const kb = createVoteKB(options, `peek${game.id}`)

    const extraOptions = [[game.ctx.t('misc.unassigned', { count: 2 }), `peek${game.id}+un`]]
    kb.text(extraOptions[0][0], extraOptions[0][1])

    game.privateMsgs.set(player.id, sendActionPrompt(player, 'seer.action', kb)!)
  }
}

export class Robber extends Villager {
  static readonly info: RoleInfo = {
    name: 'robber',
    team: Team.Village,
    descCommand: 'roleRobber',
    priority: 3,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      // TODO: fallback
      return
    }
    const options = getOptions(game.players, other => other.id !== player.id)
    const kb = createVoteKB(options, `swap${game.id}`)
    // TODO: add pass option

    game.privateMsgs.set(player.id, sendActionPrompt(player, 'robber.action', kb)!)
  }
}

export class Troublemaker extends Villager {
  static readonly info: RoleInfo = {
    name: 'troublemaker',
    team: Team.Village,
    descCommand: 'roleTM',
    priority: 3,
  }

  async doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) {
      return
    }

    const options = getOptions(game.players, other => other.id !== player.id)
    const kb = createVoteKB(options, `swap${game.id}`)
    // TODO: add pass option

    game.privateMsgs.set(player.id, sendActionPrompt(player, 'troublemaker.action', kb)!)
  }
}

export class Drunk extends Villager {
  static readonly info: RoleInfo = {
    name: 'drunk',
    team: Team.Village,
    descCommand: 'roleDrunk',
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
}

export class Mason extends Villager {
  static readonly info: RoleInfo = {
    name: 'mason',
    team: Team.Village,
    descCommand: 'roleMason',
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) return
    const teamMembers = game.teams
      .get(this.info.team)
      ?.filter(other => other.id !== player.id && other.role instanceof Mason)
    if (teamMembers === undefined) return // NOTE: for coverage, this should never happen
    let msg = ''
    if (teamMembers.length === 1) {
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
    descCommand: 'roleInsomniac',
    priority: 15,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) return

    Actions.Reveal.fn(game, player.ctx, [player], {
      priority: this.priority,
      eventCallback: () => {
        player.ctx!.reply(player.ctx!.t(`insomniac.${(player.currentRole === player.role).toString()}`))
      },
    })
  }
}

export class Minion extends Werewolf {
  static readonly info: RoleInfo = {
    name: 'minion',
    team: Team.Werewolf,
    descCommand: 'roleMinion',
    isAide: true,
  }

  doNight(player: Player, game: GameInfo) {
    if (player.ctx === undefined) return
    const teamMembers = game.teams
      .get(this.info.team)
      ?.filter(other => other.id !== player.id && !other.role.info.isAide)
    if (teamMembers === undefined) return // NOTE: for coverage, this should never happen
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
}

export class Hunter extends Villager {
  static readonly info: RoleInfo = {
    name: 'hunter',
    team: Team.Village,
    descCommand: 'roleHunter',
  }

  lynch(player: Player, game: GameInfo): boolean {
    if (player.votedFor !== undefined) {
      game.events.push(Events.Off(player, player.votedFor, game))
    }
    return super.lynch(player, game)
  }
}

export class Tanner extends Villager {
  static readonly info: RoleInfo = {
    name: 'tanner',
    team: Team.Tanner,
    descCommand: 'roleTanner',
  }
}

export class Doppelganger extends Copier {
  static readonly info: RoleInfo = {
    name: 'doppelganger',
    team: Team.Copy,
    descCommand: 'roleDG',
  }
}
