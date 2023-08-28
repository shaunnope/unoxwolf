import { GameEvent, GameInfo as Game } from '~/game/models/game'
import { Player } from '~/game/models/player'
import { isCopier } from '../roles/auxilary.roles'

export const Vote = (player: Player, target: Player, game: Game) => {
  player.votedFor = target

  return {
    type: 'vote',
    author: player,
    targets: [target],
    priority: 0,
    fn: () => {
      const votes = game.aggregator.get(target.id) || []
      votes.push(player)
      game.aggregator.set(target.id, votes)
    },
  } as GameEvent
}

export const Swap = (
  player: Player,
  targets: Player[],
  game: Game,
  priority: number = 0,
  sendReply: boolean = true
) => {
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
      if (sendReply) {
        player.ctx?.reply(
          player.ctx.t(`${player.role.info.name}.swap`, {
            user1: targets[0].name,
            user2: targets[1].name,
            role: player.ctx.t(targets[0].currentRole.name),
          })
        )
      }
    },
  } as GameEvent
}

export const Reveal = (player: Player, targets: Player[], callbackFn?: () => void, priority: number = 0) => {
  return {
    type: 'reveal',
    author: player,
    targets,
    priority,
    fn:
      callbackFn !== undefined
        ? callbackFn
        : () => {
            if (player.ctx === undefined) return
            const ctx = player.ctx!
            ctx.reply(targets.map(t => ctx.t('misc.peek_role', { user: t.name, role: ctx.t(t.role.name) })).join('\n'))
          },
  } as GameEvent
}

export const Off = (player: Player, target: Player, game: Game) => {
  player.votedFor = target

  return {
    type: 'off',
    author: player,
    targets: [target],
    priority: 0,
    fn: () => {
      target.currentRole.unalive(target, game)
      game.ctx.reply(
        game.ctx.t(`${player.currentRole.info.name}.off`, {
          user1: player.name,
          user2: target.name,
        })
      )
    },
  } as GameEvent
}

export const Copy = (player: Player, target: Player, game: Game) => {
  return {
    type: 'copy',
    author: player,
    targets: [target],
    priority: 0,
    fn: () => {
      if (!isCopier(player.role)) return
      player.role.copiedRole = target.role

      const teamMembers = game.teams.get(target.role.info.team)
      if (teamMembers === undefined) game.teams.set(target.role.info.team, [player])
      else teamMembers.push(player)

      if (player.ctx === undefined) return
      player.ctx.reply(player.ctx.t(target.role.lore))
    },
  } as GameEvent
}
