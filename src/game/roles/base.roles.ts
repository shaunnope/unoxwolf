import _ from 'lodash'
import { GameInfo } from '~/game/models/game'
import { Team } from '~/game/models/enums'
import { Role, RoleInfo, Player } from '~/game/models/player'

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
        const role = _.sample(game.unassignedRoles)?.info.name || 'null'
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

// export class Seer extends Villager {
//   static roleName = 'seer'
//   static descCommand = 'roleSeer'
// }

// export class Robber extends Villager {
//   static roleName = 'robber'
//   static descCommand = 'roleRobber'
// }

// export class Troublemaker extends Villager {
//   static roleName = 'troublemaker'
//   static descCommand = 'roleTM'
// }

// export class Drunk extends Villager {
//   static roleName = 'drunk'
//   static descCommand = 'roleDrunk'
// }

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
