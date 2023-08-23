import { GameEvent, Player } from './types'
import { Game } from '../game'

export const Vote = (player: Player, targets: Player[], game: Game) => {
  if (targets.length !== 1) throw new Error('Invalid targets')

  return {
    type: 'vote',
    author: player,
    targets,
    priority: 0,
    fn: () => {
      const votes = game.aggregator.get(targets[0].id) || []
      votes.push(player)
      game.aggregator.set(targets[0].id, votes)
    },
  } as GameEvent
}
