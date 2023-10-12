/* eslint-disable class-methods-use-this */ // TODO: consider how to refactor methods to avoid this
import _ from 'lodash'
import { GameInfo } from '~/game/models/game'
import { Team } from '~/game/models/enums'
import { Player } from '~/game/models/player'
import { Role, RoleInfo } from '~/game/models/role'

import * as Actions from '~/game/gameplay/actions'
import * as Events from '~/game/models/events'
import { createVoteKB, getOptions, sendActionPrompt } from '../helpers/keyboards'

import { Seer } from '.'

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
