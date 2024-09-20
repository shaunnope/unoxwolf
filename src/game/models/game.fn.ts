import type { Team } from "./enums"
import type { GameInfo } from "./game"
import type { Player } from "./player"

/**
 * Get number of dead team members in game
 * @param game
 * @param team
 */
export function dead(game: GameInfo, team: Team) {
  return game.deaths.get(team)?.length || 0
}

/**
 * Get number of team members in game
 * @param game
 * @param team
 */
export function count(game: GameInfo, team: Team) {
  return game.teams.get(team)?.length || 0
}

/**
 * Get all other team members of player in game
 * @param game
 * @param player
 * @param team
 */
export function members(game: GameInfo, player: Player, team: Team, also: (other: Player) => boolean) {
  return game.teams
    .get(team)!
    .filter(other => other.id !== player.id && also(other))
}

/**
 * Get array of all other players in game
 * @param game
 * @param player
 */
export function others(game: GameInfo, player: Player) {
  return game.players.filter(other => other.id !== player.id)
}
