import { createHash } from 'crypto'
import { InlineKeyboard } from 'grammy'

import type { Message } from '@grammyjs/types'

import { Player, Team, GameSettings, GameInfo, GameEvent, GameFlags } from '~/game/models/types'
import * as Roles from '~/game/roles'

import { Context } from '~/bot/context'
import { getForumTopicId } from '~/bot/helpers/forum'
import { sleep } from '~/game/helpers/timer'
import * as Actions from '~/game/roles/base.actions'
import { deleteGame, getChatTitle } from './helpers/game.context'

const defaultSettings: GameSettings = {
  joinTimeout: 180,
  nightTimeout: 30,
  voteTimeout: 300,

  minPlayers: 3,
  maxPlayers: 10,
  extraRoles: 3,

  roles: [
    Roles.Villager,
    Roles.Werewolf,
    Roles.Seer,
    Roles.Robber,
    Roles.Troublemaker,
    Roles.Mason,
    Roles.Drunk,
    Roles.Insomniac,
    Roles.Hunter,
    Roles.Tanner,
    Roles.Doppelganger,
  ],
  marks: [],
}

export class Game implements GameInfo {
  id: string

  createdTime: Date

  endTime: Date | undefined = undefined

  ctx: Context

  private _new_players: Map<number, Player>

  _players: Map<number, Player>

  state: 'lobby' | 'starting' | 'dusk' | 'night' | 'day' | 'end'

  winners: Team[]

  settings: GameSettings

  tickRate: number = 1000

  flags: GameFlags = {}

  serviceMsgs: Promise<Message.TextMessage & Message>[] = []

  callToAction: InlineKeyboard | undefined = undefined

  privateMsgs: Map<number, Promise<Message.TextMessage & Message>> = new Map()

  events: GameEvent[] = []

  aggregator: Map<number, Player[]> = new Map() // TODO: specify type

  timer: NodeJS.Timeout | null = null

  constructor(ctx: Context, settings: GameSettings = defaultSettings) {
    this.ctx = ctx
    this.id = createHash('sha256').update(`${this.chatId.toString()}-${Date.now()}`).digest('hex').slice(0, 20)
    this.createdTime = new Date()

    this._new_players = new Map()
    this._players = new Map()
    this.state = 'lobby'
    this.winners = []
    this.settings = settings
    this.tickRate = ctx.container.config.isDev ? 200 : this.tickRate

    this.run()
  }

  get chatId(): number {
    return this.ctx.chat?.id || 0
  }

  get topicId(): number | undefined {
    return getForumTopicId(this.ctx)
  }

  get players(): Player[] {
    return Array.from(this._players.values())
  }

  /**
   * Add a player to the game
   * @param ctx a `Context` from the player's private chat
   */
  addPlayer(ctx: Context) {
    const sender = ctx.from
    if (!sender) return
    if (this._players.has(sender.id)) return
    const player: Player = {
      id: sender.id,
      name: sender.first_name,
      role: Roles.Villager,
      mark: { name: '' },
      actions: [],
      ctx,
    }
    this._new_players.set(sender.id, player)
    this._players.set(sender.id, player)

    ctx.reply(ctx.t('game_init.join_success', { chat: getChatTitle(this.ctx) }))
  }

  addPlayers(players: Player[]) {
    players.forEach(p => {
      this._new_players.set(p.id, p)
      this._players.set(p.id, p)
    })
  }

  removePlayer(ctx: Context) {
    const sender = ctx.from
    if (!sender) return
    if (!this._players.has(sender.id)) return
    this._new_players.delete(sender.id)
    this._players.delete(sender.id)
  }

  /**
   * The main game loop
   */
  async run() {
    if (!(await this.collectPlayers())) return

    await this.ctx.reply(this.ctx.t('game_init.starting'))

    await this.ctx.reply(
      `${this.ctx.t('game_init.player_count', {
        count: this.players.length,
      })}\n${this.players.map(p => p.name).join('\n')}`
    )

    await this.assignRolesAndNotify()

    await this.collectVotes()

    await sleep(10 * this.tickRate)

    this.end()
  }

  /**
   * Wait for players to join the game.
   * @returns true if enough players joined, false if not
   */
  async collectPlayers() {
    this.callToAction = new InlineKeyboard().url(
      this.ctx.t('game_init.join'),
      `https://t.me/${this.ctx.me.username}?start=join${this.id}`
    )

    this.serviceMsgs = [
      this.ctx.reply(
        this.ctx.t('game_init', {
          user: this.ctx.from?.first_name || this.ctx.t('game_init.unknown_user'),
        }),
        {
          reply_markup: this.callToAction,
        }
      ),
    ]
    this.flags.timerRunning = true
    delete this.flags.killTimer

    let count = this._players.size
    let ts = 0
    for (let i = 0; i < this.settings.joinTimeout; i++) {
      if (this.flags.killTimer) {
        delete this.flags.timerRunning
        break
      }

      if (count !== this._players.size) {
        i = Math.min(i, Math.max(120, i - 30))
        count = this._players.size
      }

      if (ts % 30 === 0 && this._new_players.size > 0) {
        const joinedPlayers = Array.from(this._new_players.values())
          .map(p => p.name)
          .join(', ')
        // TODO: add user links
        this.ctx.reply(this.ctx.t('game_init.joined_game', { users: joinedPlayers }))
        this._new_players.clear()
      }

      if ([10, 30, 60].map(x => this.settings.joinTimeout - x).includes(i)) {
        const left = this.settings.joinTimeout - i
        if (left > 60) {
          this.serviceMsgs.push(
            this.ctx.reply(
              this.ctx.t('game_init.minutes_left', {
                time: Math.floor(left / 60),
              }),
              {
                reply_markup: this.callToAction,
              }
            )
          )
        } else {
          this.serviceMsgs.push(
            this.ctx.reply(this.ctx.t('game_init.seconds_left', { time: left }), {
              reply_markup: this.callToAction,
            })
          )
        }
      }

      ts++
      await sleep(this.tickRate)
    }
    this.state = 'starting'

    // delete all countdown messages
    this.cleanupMsgs()

    await sleep(2 * this.tickRate) // wait for last players to join

    // check if enough players
    if (this._players.size < this.settings.minPlayers) {
      await this.ctx.reply(
        this.ctx.t('game_init.not_enough_players', {
          count: this.settings.minPlayers,
        })
      )
      this.end()
      return false
    }

    return true
  }

  /**
   * Wait for players to vote, then tally the votes and announce the results
   */
  async collectVotes() {
    this.privateMsgs = new Map()
    this.serviceMsgs = [this.ctx.reply(this.ctx.t('game.voting_started'))]

    this.events = []
    this.aggregator = new Map()

    this.players.forEach(p => {
      this.aggregator.set(p.id, [])
      if (p.ctx === undefined) {
        Actions.Vote.fallback(this, p)
        return
      }
      Actions.Vote.setup(this, p)
    })

    for (let i = 0; i < this.settings.voteTimeout; i++) {
      if (this.flags.killTimer || this.privateMsgs.size === 0) {
        delete this.flags.timerRunning
        break
      }

      // TODO: announce time left

      await sleep(this.tickRate)
    }

    Array.from(this.privateMsgs.entries()).forEach(([playerId, promise]) => {
      const player = this._players.get(playerId)
      if (player === undefined) return // NOTE: for coverage, this should never happen
      promise.then(msg => {
        this.ctx.api.editMessageText(playerId, msg.message_id, this.ctx.t('game.times_up'))
        Actions.Vote.fallback(this, player)
      })
    })

    this.players.forEach(p => {
      if (p.ctx === undefined) return
      this.privateMsgs.get(p.id)?.then(msg => {
        this.ctx.api.editMessageText(p.id, msg.message_id, this.ctx.t('game.times_up'))
      })
    })
    const voteResultsMsg = this.ctx.reply(`${this.ctx.t('game.voting_end')} ${this.ctx.t('game.voting_tally')}`)

    this.events.sort((a, b) => a.priority - b.priority).forEach(e => e.fn())

    const numVotes: [Player, number][] = Array(this.aggregator.size).fill(undefined)
    let voteResults = `${this.ctx.t('game.voting_end')}\n\n`

    let i = 0
    Array.from(this.aggregator.entries()).forEach(([playerId, voters]) => {
      const player = this._players.get(playerId)
      if (player === undefined) return
      numVotes[i++] = [player, voters.length]

      voteResults += `<strong>${player.name}:</strong>  (${voters.length})  -  ${this.ctx.t(player.role.name)}\n${voters
        .map(p => p.name)
        .join(', ')}\n\n`
    })

    voteResultsMsg.then(msg => this.ctx.api.editMessageText(this.chatId, msg.message_id, voteResults))
  }

  /**
   * Assign roles to players and send them their role description
   */
  async assignRolesAndNotify() {
    const deck = Array(this.players.length + this.settings.extraRoles).fill(Roles.Villager)

    this.players.forEach((p, i) => {
      p.role = deck[i]
      if (p.ctx === undefined) return
      this.ctx.api.sendMessage(p.id, this.ctx.t(p.role.lore))
    })
  }

  async end() {
    this.state = 'end'
    deleteGame(this.ctx)
    this.ctx.reply(this.ctx.t('game.end'))
  }

  cleanupMsgs() {
    this.serviceMsgs.forEach(p => p.then(msg => this.ctx.api.deleteMessage(this.chatId, msg.message_id)))
    this.serviceMsgs = []
  }
}