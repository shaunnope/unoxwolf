import type { Context } from '~/bot/context'
import { Team } from './enums'
import type { Role, Mark, Player } from './player'

export type GameSettings = {
  joinTimeout: number
  duskTimeout?: number
  nightTimeout: number
  dayTimeout?: number
  voteTimeout: number

  minPlayers: number
  maxPlayers: number
  extraRoles: number

  loneWolf?: true
  revealHistory?: true
  selfVote?: true

  secretVote?: true
  secretDrunk?: true

  roles: (typeof Role)[]
  marks: Mark[]
}

export type GameInfo = {
  id: string
  ctx: Context
  createdTime: Date
  endTime: Date | undefined

  players: Player[]
  state: 'lobby' | 'starting' | 'dusk' | 'night' | 'day' | 'end'
  winners: Team[]
  teams: Map<Team, Player[]>
  unassignedRoles: Role[]

  settings: GameSettings
}

export type GameFlags = {
  killTimer?: true
  timerRunning?: true
}

export type GameEvent = {
  type: 'none' | 'vote' | 'swap' | 'peek' | 'copy' | 'reveal'
  author: Player
  targets: Player[]
  priority: number
  fn: () => void
}
