import type { GameInfo as Game, GameEvent } from "~/game/models/game"
import type { Player } from "~/game/models/player"
import { isCopier } from "~/game/roles/copier"

// TODO: remove priority from parameters. should be accessible from Player

export function Vote(player: Player, target: Player, game: Game) {
  player.votedFor = target

  return {
    type: "vote",
    icon: "🗳️",
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

export function Swap(
  player: Player,
  targets: Player[],
  game: Game,
  priority: number = 0,
  sendReply: boolean = true,
  author: Player | undefined = undefined,
) {
  if (targets.length !== 2)
    throw new Error("Invalid targets")
  // TODO: change these checks
  if (!game.playerMap.has(player.id))
    throw new Error("Player not in game")
  if (!game.playerMap.has(targets[0].id))
    throw new Error("Target 1 not in game")
  if (!game.playerMap.has(targets[1].id))
    throw new Error("Target 2 not in game")

  return {
    type: "swap",
    icon: "🔀",
    author: author ?? player,
    targets,
    priority,
    fn: () => {
      targets[0].swapRoles(targets[1])
      if (sendReply && player.ctx !== undefined) {
        const { ctx } = player
        const newRole
          = isCopier(targets[0].currentRole) && targets[0].currentRole.copiedRole !== undefined
            ? targets[0].currentRole.fullRole(ctx)
            : ctx.t(targets[0].currentRole.name)

        return ctx.reply(
          ctx.t(player.role.locale("swap"), {
            user1: targets[0].name,
            user2: targets[1].name,
            role: newRole,
          }),
        )
      }
    },
  } as GameEvent
}

function defaultPeek(player: Player, targets: Player[]) {
  return () => {
    if (player.ctx === undefined)
      return
    const { ctx } = player
    return ctx.reply(targets.map(t => ctx.t("misc.peek_role", { user: t.name, role: ctx.t(t.role.name) })).join("\n"))
  }
}

export function Peek(player: Player, targets: Player[], callbackFn?: () => void, priority: number = 2) {
  return {
    type: "peek",
    icon: "👀",
    author: player,
    targets,
    priority,
    fn:
      callbackFn !== undefined
        ? callbackFn
        : defaultPeek(player, targets),
  } as GameEvent
}

export function Reveal(player: Player, targets: Player[], callbackFn?: () => void, priority: number = 0) {
  return {
    type: "reveal",
    icon: "🪞",
    author: player,
    targets,
    priority,
    fn:
      callbackFn !== undefined
        ? callbackFn
        : defaultPeek(player, targets),
  } as GameEvent
}

export function Off(player: Player, target: Player, game: Game) {
  player.votedFor = target

  return {
    type: "off",
    icon: "🩸",
    author: player,
    targets: [target],
    priority: 0,
    fn: async () => {
      let msg = game.ctx.t(player.currentRole.locale("off"), {
        user1: player.name,
        user2: target.name,
      })
      if (!target.currentRole.unalive(target, game)) {
        msg += `\n${game.ctx.t(player.currentRole.locale("off_fail"), { user: target.name })}`
      }
      await game.ctx.reply(msg)
    },
  } as GameEvent
}

export function Copy(player: Player, target: Player, game: Game) {
  return {
    type: "copy",
    icon: "📝",
    author: player,
    targets: [target],
    priority: player.innateRole.priority,
    fn: () => {
      if (!isCopier(player.innateRole))
        return
      player.innateRole.copiedRole = target.role

      const teamMembers = game.teams.get(target.role.info.team)
      if (teamMembers === undefined) {
        game.teams.set(target.role.info.team, [player])
      } // can happen when target is an unassigned role
      else if (player.role.info.team !== target.role.info.team) {
        // TODO: team membership for copier not changed. might need to change this
        teamMembers.push(player)
      }

      if (player.ctx === undefined)
        return
      return player.ctx.reply(player.ctx.t(target.role.lore))
    },
  } as GameEvent
}

export function Rotate(player: Player, rotation: number, game: Game, priority: number = 0) {
  return {
    type: "rotate",
    icon: "🔄",
    author: player,
    targets: [] as Player[],
    priority,
    fn: () => {
      const targets = game.players.filter(p => p.id !== player.id && !p.isProtected)
      const r = ((-rotation % targets.length) + targets.length) % targets.length
      const shiftedRoles = targets.map(p => p.currentRole)
      shiftedRoles.push(...shiftedRoles.splice(0, r))
      targets.forEach((p, i) => {
        p.currentRole = shiftedRoles[i]
      })
    },
  } as GameEvent
}
