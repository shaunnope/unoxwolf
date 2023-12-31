import { createHash } from 'crypto'
import { InlineKeyboard } from 'grammy'

import type { Message } from '@grammyjs/types'

import { Other } from '@grammyjs/hydrate'
import { Team } from '~/game/models/enums'
import { Player } from '~/game/models/player'
import type { GameSettings, GameInfo, GameEvent, GameFlags } from '~/game/models/game'

import * as Roles from '~/game/roles'

import { Context } from '~/bot/context'
import { getForumTopicId } from '~/bot/helpers/forum'
import { sleep } from '~/game/helpers/timer'
import * as Actions from '~/game/gameplay/actions'
import { config } from '~/config'
import { deleteGame, getChatTitle } from './helpers/game.context'
import { generateRoles } from './roles/builder'
import { isCopier } from './roles/copier'

const defaultSettings: GameSettings = {
  joinTimeout: 180,
  copyTimeout: 120,
  duskTimeout: 120,
  nightTimeout: 120,
  voteTimeout: 600,

  minPlayers: 3,
  maxPlayers: 11,
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
    Roles.Minion,
    Roles.Doppelganger,
  ],
  marks: [],
}

const timeLeftReminders = [10, 30, 60]

export class Game implements GameInfo {
  readonly id: string

  readonly createdTime: Date

  readonly createdBy: number

  endTime: Date | undefined = undefined

  ctx: Context

  private newPlayers: Map<number, Player> = new Map()

  playerMap: Map<number, Player> = new Map()

  teams: Map<Team, Player[]> = new Map()

  unassignedRoles: Player[] = []

  deaths: Map<Team, Player[]> = new Map()

  winners: Map<Team, Player[]> = new Map()

  state: 'lobby' | 'started' | 'ended'

  readonly settings: GameSettings

  private readonly tickRate: number = config.isDev ? 1000 : 1000

  flags: GameFlags = {}

  serviceMsgs: (Message.TextMessage & Message)[] = []

  callToAction: InlineKeyboard | undefined = undefined

  privateMsgs: Map<number, Promise<Message.TextMessage & Message>> = new Map()

  events: GameEvent[] = []

  timeline: GameEvent[] = []

  aggregator: Map<number, Player[]> = new Map()

  constructor(ctx: Context, settings: GameSettings = defaultSettings) {
    this.ctx = ctx
    this.id = createHash('sha256').update(`${this.chatId.toString()}-${Date.now()}`).digest('hex').slice(0, 20)
    this.createdBy = ctx.from?.id || 0
    this.createdTime = new Date()

    this.state = 'lobby'
    this.settings = settings

    this.run()
  }

  get chatId(): number {
    return this.ctx.chat?.id || 0
  }

  get topicId(): number | undefined {
    return getForumTopicId(this.ctx)
  }

  get players(): Player[] {
    return Array.from(this.playerMap.values())
  }

  /**
   * Add a player to the game
   * @param ctx a `Context` from the player's private chat
   */
  addPlayer(ctx: Context) {
    const sender = ctx.from
    if (!sender) return
    if (this.playerMap.has(sender.id)) return
    const player = new Player(sender.id, sender.first_name, undefined, ctx)
    this.newPlayers.set(sender.id, player)
    this.playerMap.set(sender.id, player)

    ctx.session.game = this.id
    ctx.session.actions = []
    ctx.reply(ctx.t('join.success', { chat: getChatTitle(this.ctx) }))
  }

  addPlayers(players: Player[]) {
    players.forEach(p => {
      this.newPlayers.set(p.id, p)
      this.playerMap.set(p.id, p)
    })
  }

  removePlayer(ctx: Context) {
    const sender = ctx.from
    if (!sender) return
    if (!this.playerMap.has(sender.id)) return
    this.newPlayers.delete(sender.id)
    this.playerMap.delete(sender.id)
  }

  /**
   * The main game loop
   */
  async run() {
    if (!(await this.collectPlayers())) return

    await this.reply(this.ctx.t('game_init.starting'))

    await this.reply(
      `${this.ctx.t('join.count', {
        count: this.players.length,
      })}\n${this.players.map(p => p.name).join('\n')}`
    )

    const hasCopy = await this.assignRolesAndNotify()
    if (hasCopy) {
      await this.copyPhase()
    }
    await sleep(2 * this.tickRate)

    await this.nightPhase()

    await this.collectVotes()

    await this.getWinners()

    await this.announceTimeline()

    await sleep(10 * this.tickRate)

    this.end()
  }

  /**
   * Wait for players to join the game.
   * @returns true if enough players joined, false if not
   */
  async collectPlayers() {
    this.callToAction = new InlineKeyboard().url(
      this.ctx.t('join'),
      `https://t.me/${this.ctx.me.username}?start=join${this.id}`
    )

    this.serviceMsgs = [
      await this.reply(
        this.ctx.t('game_init', {
          user: this.ctx.from?.first_name || this.ctx.t('misc.unknown_user'),
        }),
        {
          reply_markup: this.callToAction,
        }
      ),
    ]

    let count = this.playerMap.size
    let ts = 0
    this.setupTimer()
    for (let i = 0; i < this.settings.joinTimeout; i++) {
      if (this.flags.killTimer || this.players.length >= this.settings.maxPlayers) {
        delete this.flags.timerRunning
        break
      }

      if (count !== this.playerMap.size) {
        // extend timer if number of players changed
        i = Math.min(i, Math.max(120, i - 30))
        count = this.playerMap.size
      }

      if (ts % 30 === 0 && this.newPlayers.size > 0) {
        const joinedPlayers = Array.from(this.newPlayers.values())
          .map(p => p.name)
          .join(', ')
        // TODO: add user links
        this.reply(this.ctx.t('join.recent_list', { users: joinedPlayers }))
        this.newPlayers.clear()
      }

      await this.countdownPrompt(ts, this.settings.joinTimeout, this.callToAction)

      ts++
      await sleep(this.tickRate)
    }
    this.state = 'started'

    // delete all countdown messages
    this.cleanupMsgs()

    await sleep(2 * this.tickRate) // wait for last players to join

    // check if enough players
    if (this.playerMap.size < this.settings.minPlayers) {
      await this.reply(
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
   * Run copy phase.
   *
   */
  async copyPhase() {
    this.privateMsgs = new Map()

    this.events = []

    this.players.forEach(p => {
      if (isCopier(p.innateRole)) {
        p.innateRole.copy(p, this)
      }
    })

    this.setupTimer()
    for (let i = 0; i < this.settings.copyTimeout; i++) {
      if (this.flags.killTimer || this.canExit(i)) {
        delete this.flags.timerRunning
        break
      }

      await this.countdownPrompt(i, this.settings.copyTimeout)

      await sleep(this.tickRate)
    }
    this.cleanupMsgs()
    await this.cleanupPMs(Actions.Copy.fallback)
    this.events.sort((a, b) => a.priority - b.priority)
    this.updateTimeline()
    this.reply(this.ctx.t('copy.end'))

    await sleep(10 * this.tickRate)
  }

  /**
   * Run night phase.
   *
   */
  async nightPhase() {
    this.privateMsgs = new Map()
    this.serviceMsgs = []
    await this.reply(this.ctx.t('night.start'))

    this.events = []

    this.players.forEach(p => p.role.doNight(p, this))

    this.setupTimer()
    for (let i = 0; i < this.settings.nightTimeout; i++) {
      if (this.flags.killTimer || this.canExit(i)) {
        delete this.flags.timerRunning
        break
      }

      await this.countdownPrompt(i, this.settings.nightTimeout)

      await sleep(this.tickRate)
    }
    this.cleanupMsgs()
    await this.cleanupPMs(() => {})
    await this.reply(this.ctx.t('night.end'))
    this.events.sort((a, b) => a.priority - b.priority).forEach(e => e.fn())
    this.updateTimeline()

    await sleep(10 * this.tickRate)
  }

  /**
   * Wait for players to vote, then tally the votes and announce the results
   */
  async collectVotes() {
    this.privateMsgs = new Map()
    this.serviceMsgs = [await this.reply(this.ctx.t('vote.start'))]

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

    this.setupTimer()
    for (let i = 0; i < this.settings.voteTimeout; i++) {
      if (this.flags.killTimer || this.canExit(i)) {
        delete this.flags.timerRunning
        break
      }

      await this.countdownPrompt(i, this.settings.voteTimeout)

      await sleep(this.tickRate)
    }
    this.cleanupMsgs()
    await this.cleanupPMs()

    const voteResultsMsg = await this.reply(`${this.ctx.t('vote.end')} ${this.ctx.t('vote.tally')}`)

    this.events.sort((a, b) => a.priority - b.priority).forEach(e => e.fn())

    const numVotes: [Player, number, Player[]][] = Array(this.aggregator.size).fill(undefined)
    let voteResults = `${this.ctx.t('vote.end')}\n\n`

    this.teams = new Map() // now track the number of non-aide team members

    let i = -1
    Array.from(this.aggregator.entries()).forEach(([playerId, voters]) => {
      const player = this.playerMap.get(playerId)
      if (player === undefined) return

      numVotes[++i] = [player, voters.length, voters]
      // if (config.isDev) {
      //   if (player.id === config.BOT_OWNER_USER_ID) {
      //     numVotes[i] = [player, 20, voters]
      //     player.currentRole = new Roles.Hunter()
      //     numVotes[0][0].currentRole = new Roles.Hunter()
      //   }
      // }

      // collate non-aide players in main teams
      if (
        !player.currentRole.info.isAide &&
        [Team.Village, Team.Werewolf, Team.Vampire, Team.Alien].includes(player.currentRole.info.team)
      ) {
        const teamMembers = this.teams.get(player.currentRole.info.team)
        if (teamMembers === undefined) this.teams.set(player.currentRole.info.team, [player])
        else teamMembers.push(player)
      }

      voteResults += `<strong>${player.name}:</strong>  (${numVotes[i][1]})\n`

      voteResults += voters.length > 0 ? `${voters.map(p => p.name).join(', ')}\n\n` : '\n'
    })

    await this.ctx.api.editMessageText(this.chatId, voteResultsMsg.message_id, voteResults)

    if (!numVotes.some(([, n]) => n > 1)) {
      this.reply(this.ctx.t('vote.draw'))
      return
    }

    this.events = []
    numVotes.sort((a, b) => b[1] - a[1])
    let goal =
      Array.from(this.teams.entries()).filter(([team, members]) => {
        return team === Team.Village || members.some(p => !p.currentRole.info.isAide)
      }).length < 3
        ? 1
        : 2

    const out: Player[] = []
    for (const [idx, [player, n]] of numVotes.entries()) {
      if (player.currentRole.lynch(player, this)) {
        out.push(player)
        if (--goal <= 0 && n > numVotes[idx + 1][1]) break
      }
    }

    await this.reply(
      this.ctx.t('vote.results', {
        users: out.map(p => p.name).join(', '),
        num: out.length,
      })
    )

    await sleep(2 * this.tickRate)

    while (this.events.length > 0) {
      const event = this.events.shift()!
      await event.fn()
      this.timeline.push(event)
    }
  }

  /**
   * Determine the winners of the game
   */
  async getWinners() {
    this.players.forEach(p => p.currentRole.checkWin(p, this))

    const results = this.players
      .map(p => {
        const roleName =
          isCopier(p.currentRole) && p.currentRole.copiedRole !== undefined
            ? p.currentRole.fullRole(this.ctx)
            : this.ctx.t(p.currentRole.name)
        return `${p.name}: ${p.won ? this.ctx.t('game.won') : this.ctx.t('game.lost')} ${
          p.isDead ? this.ctx.t('game.dead') : this.ctx.t('game.alive')
        }  -  ${roleName}`
      })
      .join('\n')

    const unassigned = this.unassignedRoles
      .map(r => {
        return isCopier(r.currentRole) && r.currentRole.copiedRole !== undefined
          ? r.currentRole.fullRole(this.ctx)
          : this.ctx.t(r.currentRole.name)
      })
      .join(', ')

    const msg =
      `<strong>${this.ctx.t('game.end')}</strong>\n\n${results}\n\n` +
      `${this.ctx.t('vote.unassigned', {
        roles: unassigned,
      })}`

    await this.reply(msg)
  }

  /**
   * Assign roles to players and send them their role description
   * @returns true if copy phase should be run, false if not
   */
  async assignRolesAndNotify() {
    this.teams = new Map()
    const deck = generateRoles(this.players.length, this.settings.roles, this.settings.extraRoles)

    this.players.forEach((p, i) => {
      p.setup(deck[i])

      // if (config.isDev && p.id === config.BOT_OWNER_USER_ID) {
      //   const role = new Roles.Doppelganger()
      //   p.setup(role)
      //   deck[i] = role
      // }

      // collate players by team
      const teamMembers = this.teams.get(p.role.info.team)
      if (teamMembers === undefined) this.teams.set(p.role.info.team, [p])
      else teamMembers.push(p)

      if (p.ctx === undefined) return
      this.ctx.api.sendMessage(p.id, this.ctx.t(p.role.lore))
    })
    this.unassignedRoles = deck
      .slice(this.players.length)
      .map((r, idx) => new Player(idx, this.ctx.t('misc.unassigned_role', { idx: idx + 1 }), r, undefined))

    await this.reply(
      `${this.ctx.t('game.roles')}\n${deck
        .map(r => this.ctx.t(r.name))
        .sort()
        .join('\n')}`
    )

    return deck.some(r => isCopier(r))
  }

  /**
   * Announce the timeline of events that happened during the night
   */
  async announceTimeline() {
    const eventBlock = this.timeline
      .map(e => {
        return `${e.icon} ${this.ctx.t(`events.${e.type}`)} -  ${e.author.name}:  [ ${e.targets
          .map(t => t.name)
          .join(', ')} ]`
      })
      .join('\n')

    await this.reply(`${this.ctx.t('events')}\n\n${eventBlock}`)
  }

  /**
   * End the game, updating the database with the results
   */
  async end() {
    this.state = 'ended'

    for (const p of this.players) {
      await p.ctx?.prisma.stats.logGame(p, this)
    }

    deleteGame(this)
  }

  /**
   * Delete all service messages
   */
  cleanupMsgs() {
    this.serviceMsgs.forEach(msg => this.ctx.api.deleteMessage(this.chatId, msg.message_id))
    this.serviceMsgs = []
  }

  async cleanupPMs(fallback = Actions.Vote.fallback) {
    for (const [playerId, promise] of this.privateMsgs.entries()) {
      const player = this.playerMap.get(playerId)!

      await player.ctx?.conversation.exit()

      promise.then(msg => {
        this.ctx.api.editMessageText(playerId, msg.message_id, this.ctx.t('game.times_up'))
        fallback(this, player)
      })
    }
  }

  async countdownPrompt(
    ts: number,
    duration: number = this.settings.joinTimeout,
    kb: InlineKeyboard | undefined = undefined
  ) {
    if (timeLeftReminders.map(x => duration - x).includes(ts)) {
      const left = duration - ts
      this.serviceMsgs.push(
        await this.reply(this.ctx.t('game.seconds_left', { time: left }), {
          reply_markup: kb,
        })
      )
    }
  }

  async reply(msg: string, other?: Other<'sendMessage', 'chat_id' | 'text'>) {
    return this.ctx.reply(msg, { ...other, reply_to_message_id: this.topicId })
  }

  setupTimer() {
    this.flags.timerRunning = true
    delete this.flags.killTimer
  }

  updateTimeline() {
    this.timeline.push(...this.events)
  }

  canExit(ts: number) {
    return this.privateMsgs.size === 0 && ts > 10
  }
}
