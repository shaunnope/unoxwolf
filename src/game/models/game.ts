import type { Message } from "@grammyjs/types"
import type { InlineKeyboard } from "grammy"

import type { Affliction } from "./affliction"
import type { Team } from "./enums"
import type { Player } from "./player"
import type { Role } from "./role"
import type { Context } from "~/bot/context"

export interface GameSettings {
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

export interface GameInfo {
  id: string
  ctx: Context
  createdBy: number
  createdTime: Date
  endTime: Date | undefined
  chatId: number
  topicId: number | undefined

  players: Player[]
  playerMap: Map<number, Player>
  state: "lobby" | "started" | "ended"
  teams: Map<Team, Player[]>
  unassignedRoles: Player[]

  winInfo: WinInfo
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

export interface GameFlags {
  killTimer?: true
  timerRunning?: true
  copyDone?: true
}

export interface GameEvent {
  type: "none" | "vote" | "swap" | "peek" | "copy" | "reveal" | "off" | "rotate"
  icon: string
  author: Player
  targets: Player[]
  priority: number
  fn: () => Promise<any>
}

export type WinInfo = boolean[]
