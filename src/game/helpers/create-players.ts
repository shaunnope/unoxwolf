import _ from "lodash"
import { Player } from "~/game/models/player"

const PLAYERS = [
  "Alice",
  "Bianca",
  "Cavin",
  "Destin",
  "Eugene",
  "Franz",
  "Gerry",
  "Henry",
  "Irene",
  "Jonah",
  "Keane",
  "Louis",
  "Moses",
  "Nicole",
  "Oscar",
  "Peter",
  "Quinn",
  "Robin",
  "Shane",
  "Trent",
  "Ursula",
  "Victor",
  "Wendy",
  "Xavier",
  "Yvonne",
  "Zander",
]

export function createPlayers(count: number) {
  count = _.clamp(count, 1, 10)
  const names = _.sampleSize(PLAYERS, count)

  const players = new Array<Player>(count)
  for (let i = 0; i < count; i++) {
    players[i] = new Player(i, names[i])
  }
  return players
}
