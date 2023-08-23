import { Player, Role, Mark } from '~/game/models/types'
import * as Roles from '~/game/roles'

export const createPlayer = (id: number, name: string, role: Role, mark: Mark) => {
  return {
    id,
    name,
    role,
    mark,
    actions: [],
  } as Player
}

export const createPlayers = (count: number) => {
  const players = []
  for (let i = 0; i < count; i++) {
    players.push(createPlayer(i, `Player ${i}`, Roles.Villager, { name: '' }))
  }
  return players
}
