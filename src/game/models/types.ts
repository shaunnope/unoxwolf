import type { Context } from '~/bot/context'
import type { Game } from '~/game'

export enum Team {
  Village = 'village',
  Werewolf = 'werewolf',
  Tanner = 'tanner',
  Vampire = 'vampire',
  Assassin = 'assassin',
  Alien = 'alien',
  Synth = 'synth',
  Symbiote = 'symbiote',
  Mortician = 'mortician',
}

export type Action = {
  fallback: (game: Game, player: Player) => void
  setup: (game: Game, player: Player) => void
  fn: (game: Game, playerContext: Context, targets?: Player[]) => void
}

export type GameEvent = {
  type: 'none' | 'vote' | 'swap' | 'peek' | 'copy'
  author: Player
  targets: Player[]
  priority: number
  fn: () => void
}

export type Role = {
  name: string
  team: Team
  descCommand: string
  description: string
  lore: string

  actions: Action[]
  doppleActions: Action[]
}

export type Mark = {
  name: string
}

export type Player = {
  id: number
  name: string
  role: Role
  mark: Mark
  actions: Action[]

  ctx?: Context
}

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

  roles: Role[]
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

  settings: GameSettings
}

export type GameFlags = {
  killTimer?: true
  timerRunning?: true
}

export type InlineKBMetaData = {
  text: string
  callback_data?: string
}
