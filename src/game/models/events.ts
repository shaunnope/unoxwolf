import { GameEvent } from '~/game/models/game'
import { Player } from '~/game/models/player'
import { Game } from '~/game'

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

export const Swap = (player: Player, targets: Player[], game: Game, priority: number = 0) => {
  if (targets.length !== 2) throw new Error('Invalid targets')
  // TODO: change these checks
  if (!game.playerMap.has(player.id)) throw new Error('Player not in game')
  if (!game.playerMap.has(targets[0].id)) throw new Error('Target 1 not in game')
  if (!game.playerMap.has(targets[1].id)) throw new Error('Target 2 not in game')

  return {
    type: 'swap',
    author: player,
    targets,
    priority,
    fn: () => {
      targets[0].swapRoles(targets[1])
      player.ctx?.reply(
        player.ctx.t(`role_message.${player.role.info.name}_swap`, {
          user1: targets[0].name,
          user2: targets[1].name,
          role: player.ctx.t(targets[0].currentRole.name),
        })
      )
    },
  } as GameEvent
}

export const Reveal = (player: Player, targets: Player[], game: Game) => {
  if (targets.length !== 1) throw new Error('Invalid targets')

  return {
    type: 'reveal',
    author: player,
    targets,
    priority: 0,
    fn: () => {
      const votes = game.aggregator.get(targets[0].id)
      if (votes === undefined) game.aggregator.set(targets[0].id, [player])
      else votes.push(player)
    },
  } as GameEvent
}
