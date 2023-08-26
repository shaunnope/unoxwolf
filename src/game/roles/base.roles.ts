/* eslint-disable class-methods-use-this */ // TODO: consider how to refactor methods to avoid this
import _ from 'lodash'
import { GameInfo } from '~/game/models/game'
import { Team } from '~/game/models/enums'
import { Role, RoleInfo, Player } from '~/game/models/player'

import * as Actions from '~/game/gameplay/actions'
import * as Events from '~/game/models/events'
import { createVoteKB, getOptions, sendActionPrompt } from '../helpers/keyboards'

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
    const teamMembers = game.teams.get(this.info.team)
    if (teamMembers === undefined) return // NOTE: for coverage, this should never happen
    let msg = ''
    if (teamMembers.length === 1) {
      msg = game.ctx.t('role_message.werewolf_lone')
      if (game.settings.loneWolf) {
        const role = _.sample(game.unassignedRoles)?.role.info.name || 'null'
        msg += `\n${game.ctx.t('role_message.werewolf_lone2', { role: game.ctx.t(role) })}`
      }
    } else {
      msg = game.ctx.t('role_message.werewolf_reveal', {
        wolves: teamMembers
          .filter(other => other.id !== player.id)
          .map(p => p.name)
          .join(', '),
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

    game.privateMsgs.set(player.id, sendActionPrompt(player, 'role_message.seer_action', kb)!)
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
      return
    }
    const options = getOptions(game.players, other => other.id !== player.id)
    const kb = createVoteKB(options, `swap${game.id}`)
    // TODO: add pass option

    game.privateMsgs.set(player.id, sendActionPrompt(player, 'role_message.robber_action', kb)!)
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

    game.privateMsgs.set(player.id, sendActionPrompt(player, 'role_message.troublemaker_action', kb)!)
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
    player.ctx.reply(player.ctx.t('role_message.drunk_action', { role: target.name }))
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
      msg = game.ctx.t('role_message.mason_lone')
    } else {
      msg = game.ctx.t('role_message.mason_reveal', {
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
        player.ctx!.reply(player.ctx!.t(`role_message.insomniac_${(player.currentRole === player.role).toString()}`))
      },
    })
  }
}

// export class Insomniac extends Villager {
//   static roleName = 'insomniac'
//   static descCommand = 'roleInsomniac'
// }

// export class Mason extends Villager {
//   static roleName = 'mason'
//   static descCommand = 'roleMason'
// }

// export class Minion extends Werewolf {
//   static roleName = 'minion'
//   static descCommand = 'roleMinion'
//   static isAide = true
// }

// export class Tanner extends Role {
//   static roleName = 'tanner'
//   static team = Team.Tanner
//   static descCommand = 'roleTanner'
// }

// export class Hunter extends Villager {
//   static roleName = 'hunter'
//   static descCommand = 'roleHunter'
// }

// export class Doppelganger extends Role {
//   static roleName = 'doppelganger'
//   static descCommand = 'roleDG'
// }
