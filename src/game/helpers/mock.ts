import { Player } from '~/game/models/player'
import * as Roles from '~/game/roles'

export const createPlayers = (count: number) => {
  const players = new Array<Player>(count)
  for (let i = 0; i < count; i++) {
    players[i] = new Player(i, `Player ${i}`, Roles.Villager)
  }
  return players
}
