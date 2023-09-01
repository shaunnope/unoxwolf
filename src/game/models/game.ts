import type { InlineKeyboard } from 'grammy'
import type { Message } from '@grammyjs/types'

import type { Context } from '~/bot/context'
import { Team } from './enums'
import type { Player } from './player'
import type { Role } from './role'
import type { Affliction } from './affliction'

export type GameSettings = {
  joinTimeout: number
  copyTimeout: number
  duskTimeout: number
  nightTimeout: number
  voteTimeout: number

  minPlayers: number
  maxPlayers: number
  extraRoles: number

  loneWolf?: true
  revealHistory?: true
  selfVote?: true
  noPass?: true

  secretVote?: true
  secretDrunk?: true

  roles: (typeof Role)[]
  marks: Affliction[]
}

export type GameInfo = {
  id: string
  ctx: Context
  createdBy: number
  createdTime: Date
  endTime: Date | undefined
  chatId: number
  topicId: number | undefined

  players: Player[]
  playerMap: Map<number, Player>
  state: 'lobby' | 'started' | 'ended'
  teams: Map<Team, Player[]>
  unassignedRoles: Player[]

  deaths: Map<Team, Player[]>
  winners: Map<Team, Player[]>

  settings: GameSettings

  flags: GameFlags
  serviceMsgs: (Message.TextMessage & Message)[]
  callToAction: InlineKeyboard | undefined
  privateMsgs: Map<number, Promise<Message.TextMessage & Message>>
  events: GameEvent[]
  aggregator: Map<number, Player[]>
}

export type GameFlags = {
  killTimer?: true
  timerRunning?: true
  copyDone?: true
}

export type GameEvent = {
  type: 'none' | 'vote' | 'swap' | 'peek' | 'copy' | 'reveal' | 'off' | 'rotate'
  author: Player
  targets: Player[]
  priority: number
  fn: () => Promise<void>
}
