// TODO: consider how to refactor methods to avoid this
import { Team } from '~/game/models/enums'
import type { GameInfo } from '~/game/models/game'
import type { Player } from '~/game/models/player'
import type { RoleInfo } from '~/game/models/role'

import { Seer } from '.'

import { createVoteKB, getOptions, sendActionPrompt } from '../helpers/keyboards'

export class Fool extends Seer {
  static readonly info: RoleInfo = {
    name: 'fool',
    team: Team.Village,
    command: 'roleFool',
    priority: 7,
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
