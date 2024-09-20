import { Team } from "~/game/models/enums"
import type { GameInfo } from "~/game/models/game"

import * as G from "~/game/models/game.fn"

/**
 * Determine winning teams. Data is attached to game
 * Individual players in teams may have different win states
 * due to game mechanics
 *
 * @param game
 */
export function setWins(game: GameInfo) {
  const wins = new Array(Team.__LENGTH).fill(false)

  wins[Team.Tanner] = G.dead(game, Team.Tanner) > 0

  // TODO: change when other non-village teams are added
  wins[Team.Village] = G.count(game, Team.Werewolf) > 0
    ? G.dead(game, Team.Werewolf) > 0
    : (!wins[Team.Tanner] && G.dead(game, Team.Village) === 0)

  wins[Team.Werewolf] = !wins[Team.Tanner] && G.dead(game, Team.Werewolf) === 0

  game.winInfo = wins
}
