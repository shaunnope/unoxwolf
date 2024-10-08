import type { Other } from "@grammyjs/hydrate"
import type { Message } from "@grammyjs/types"

import type { Role } from "./models/role"

import { createHash } from "node:crypto"
import { InlineKeyboard } from "grammy"
import type { Context } from "~/bot/context"
import { getForumTopicId } from "~/bot/helpers/forum"

import { config } from "~/config"

import * as Actions from "~/game/gameplay/actions"
import { sleep } from "~/game/helpers/timer"
import { Phase, Team } from "~/game/models/enums"
import type { GameEvent, GameFlags, GameInfo, GameSettings, WinInfo } from "~/game/models/game"
import { Player } from "~/game/models/player"
import * as Roles from "~/game/roles"
import { deleteGame, getChatTitle } from "./helpers/game.context"
import { generateRoles } from "./roles/builder"
import { isCopier } from "./roles/copier"
import { setWins } from "./roles/win"

export type Votes = [Player, number, Player[]]

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
  // metadata
  readonly id: string
  readonly createdTime: Date
  readonly createdBy: number
  endTime: Date | undefined = undefined
  ctx: Context

  // player data
  private newPlayers: Map<number, Player> = new Map()
  playerMap: Map<number, Player> = new Map()
  teams: Map<Team, Player[]> = new Map()
  unassignedRoles: Player[] = []
  roles?: Role[]

  // endgame data
  winInfo: WinInfo = new Array(Team.__LENGTH).fill(false)
  deaths: Map<Team, Player[]> = new Map()
  winners: Map<Team, Player[]> = new Map()

  // game conditions
  state: "lobby" | "started" | "ended"
  readonly settings: GameSettings
  private readonly tickRate: number = config.isTest ? 10 : 1000
  flags: GameFlags = {}

  /** Messages to be deleted at the end of each state */
  serviceMsgs: (Message.TextMessage & Message)[] = []

  /** Messages to be deleted at the end of the game */
  traceMsgs: (Message.TextMessage & Message)[] = []

  callToAction: InlineKeyboard | undefined = undefined

  privateMsgs: Map<number, Promise<Message.TextMessage & Message>> = new Map()

  events: GameEvent[] = []

  timeline: GameEvent[] = []

  aggregator: Map<number, Player[]> = new Map()

  /** Store off all emitted promises during gameplay. For testing */
  private bin: Promise<any>[] = []

  constructor(ctx: Context, settings: GameSettings = defaultSettings) {
    this.ctx = ctx
    this.id = createHash("sha256").update(`${this.chatId.toString()}-${Date.now()}`).digest("hex").slice(0, 20)
    this.createdBy = ctx.from?.id || 0
    this.createdTime = new Date()

    this.state = "lobby"
    this.settings = settings

    this.init()
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
    if (!sender)
      return
    if (this.playerMap.has(sender.id))
      return
    const player = new Player(sender.id, sender.first_name, undefined, ctx)
    this.newPlayers.set(sender.id, player)
    this.playerMap.set(sender.id, player)

    ctx.session.game = this.id
    ctx.session.actions = []
    this.bin.push(ctx.reply(ctx.t("join.success", { chat: getChatTitle(this.ctx) })))
  }

  addPlayers(players: Player[]) {
    players.forEach((p) => {
      this.newPlayers.set(p.id, p)
      this.playerMap.set(p.id, p)
    })
  }

  removePlayer(ctx: Context) {
    const sender = ctx.from
    if (!sender)
      return
    if (!this.playerMap.has(sender.id))
      return
    this.newPlayers.delete(sender.id)
    this.playerMap.delete(sender.id)
  }

  /**
   * The main game loop
   */
  async run() {
    if (!(await this.collectPlayers()))
      return

    await this.reply(this.ctx.t("game_init.starting"), undefined, "trace")

    await this.reply(
      `${this.ctx.t("join.count", {
        count: this.players.length,
      })}\n${this.players.map(p => p.name).join("\n")}`,
      undefined,
      "trace",
    )

    const hasCopy = await this.assignRolesAndNotify()
    if (hasCopy) {
      await this.copyPhase()
    }
    await sleep(2 * this.tickRate)

    await this.nightPhase()
    await sleep(5 * this.tickRate)

    await this.votePhase()
    await sleep(2 * this.tickRate)

    await this.getWinners()

    await this.announceTimeline()

    await sleep(10 * this.tickRate)

    this.end()
  }

  /**
   * Initialize game. Send first join message.
   */
  async init() {
    this.callToAction = new InlineKeyboard().url(
      this.ctx.t("join"),
      `https://t.me/${this.ctx.me.username}?start=join${this.id}`,
    )

    await this.reply(
      this.ctx.t("game_init", {
        user: this.ctx.from?.first_name || this.ctx.t("misc.unknown_user"),
      }),
      {
        reply_markup: this.callToAction,
      },
      "service",
    )
  }

  /**
   * Wait for players to join the game.
   * @returns true if enough players joined, false if not
   */
  async collectPlayers() {
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
          .join(", ")
        // TODO: add user links
        this.reply(this.ctx.t("join.recent_list", { users: joinedPlayers }), undefined, "service")
        this.newPlayers.clear()
      }

      await this.countdownPrompt(ts, this.settings.joinTimeout, this.callToAction)

      ts++
      await sleep(this.tickRate)
    }
    this.state = "started"

    // delete all countdown messages
    this.cleanupMsgs(this.serviceMsgs)

    await sleep(2 * this.tickRate) // wait for last players to join

    // check if enough players
    if (this.playerMap.size < this.settings.minPlayers) {
      await this.reply(
        this.ctx.t("game_init.not_enough_players", {
          count: this.settings.minPlayers,
        }),
        undefined,
        "trace",
      )
      this.end(true)
      return false
    }

    return true
  }

  /**
   * Run copy phase.
   *
   */
  async copyPhase() {
    await this.setupPhase(Phase.Copy)

    await this.runPhase(Phase.Copy)
  }

  /**
   * Run night phase.
   *
   */
  async nightPhase() {
    await this.reply(this.ctx.t("night.start"), undefined, "trace")
    await this.setupPhase(Phase.Night)

    await this.runPhase(Phase.Night)
  }

  async setupPhase(phase: Phase) {
    let callback: (player: Player) => void
    switch (phase) {
      case Phase.Copy:
        callback = (p) => {
          if (isCopier(p.innateRole)) {
            p.innateRole.copy(p, this)
          }
        }
        break
      case Phase.Night:
        callback = p => p.role.doNight(p, this)
        break
      default:
        return
    }

    this.privateMsgs = new Map()
    this.events = []

    this.players.forEach(callback)
  }

  /**
   * Run phase timer and teardown
   * @param phase
   */
  async runPhase(phase: Phase) {
    switch (phase) {
      case Phase.Copy:
        await this.phaseTimer("copy", this.settings.copyTimeout)
        break
      case Phase.Night:
        await this.phaseTimer("night", this.settings.nightTimeout)
        break
      default:
    }
  }

  async phaseTimer(phase: string, timeout: number) {
    this.setupTimer()
    for (let i = 0; i < timeout; i++) {
      if (this.flags.killTimer || this.canExit(i)) {
        delete this.flags.timerRunning
        break
      }

      await this.countdownPrompt(i, timeout)

      await sleep(this.tickRate)
    }
    this.cleanupMsgs(this.serviceMsgs)
    await this.cleanupPMs(() => {})
    this.events.sort((a, b) => a.priority - b.priority).forEach(e => this.bin.push(e.fn()))
    this.updateTimeline()
    await this.reply(this.ctx.t(`${phase}.end`), undefined, "trace")
  }

  /**
   * Run voting phase
   */
  async votePhase() {
    await this.setupVotes()
    const votes = await this.collectVotes()
    await this.processVotes(votes)
  }

  /**
   * Setup for votes
   */
  async setupVotes() {
    this.privateMsgs = new Map()
    await this.reply(this.ctx.t("vote.start"), undefined, "service")

    this.events = []
    this.aggregator = new Map()

    this.players.forEach((p) => {
      this.aggregator.set(p.id, [])
      if (p.ctx === undefined) {
        Actions.Vote.fallback(this, p)
        return
      }
      Actions.Vote.setup(this, p)
    })
  }

  /**
   * Wait for players to vote, then tally the votes and announce the results
   */
  async collectVotes() {
    this.setupTimer()
    for (let i = 0; i < this.settings.voteTimeout; i++) {
      if (this.flags.killTimer || this.canExit(i)) {
        delete this.flags.timerRunning
        break
      }

      await this.countdownPrompt(i, this.settings.voteTimeout)

      await sleep(this.tickRate)
    }
    this.cleanupMsgs(this.serviceMsgs)
    await this.cleanupPMs()

    const voteResultsMsg = await this.reply(`${this.ctx.t("vote.end")} ${this.ctx.t("vote.tally")}`)

    this.events.sort((a, b) => a.priority - b.priority).forEach(e => this.bin.push(e.fn()))

    const votes: Votes[] = new Array(this.aggregator.size).fill(undefined)
    let voteResults = `${this.ctx.t("vote.end")}\n\n`

    this.teams = new Map() // now track the number of non-aide team members

    let i = -1
    Array.from(this.aggregator.entries()).forEach(([playerId, voters]) => {
      const player = this.playerMap.get(playerId)!

      votes[++i] = [player, voters.length, voters]
      if (false && config.isDev) {
        if (player.id === config.BOT_OWNER_USER_ID) {
          votes[i] = [player, 20, voters]
          player.currentRole = new Roles.Hunter()
          votes[0][0].currentRole = new Roles.Hunter()
        }
      }

      // collate non-aide players in main teams
      if (
        !player.current.info.isAide
        && [Team.Village, Team.Werewolf, Team.Vampire, Team.Alien].includes(player.current.info.team)
      ) {
        const teamMembers = this.teams.get(player.current.info.team)
        if (teamMembers === undefined)
          this.teams.set(player.current.info.team, [player])
        else teamMembers.push(player)
      }

      voteResults += `<strong>${player.name}:</strong>  (${votes[i][1]})\n`

      voteResults += voters.length > 0 ? `${voters.map(p => p.name).join(", ")}\n\n` : "\n"
    })

    await this.ctx.api.editMessageText(this.chatId, voteResultsMsg.message_id, voteResults)

    return votes
  }

  /**
   * Tally votes, process vote actions, and announce the vote counts
   */
  async processVotes(votes: Votes[]) {
    if (!votes.some(([, n]) => n > 1)) {
      this.reply(this.ctx.t("vote.draw"))
      return
    }

    this.events = []
    votes.sort((a, b) => b[1] - a[1])

    /**
     * Number of players to lynch. Depends on presence of epic battles
     *
     * ### Epic battle
     * Occurs when at least 3 distinct teams (excluding Tanner) are in play at the end of the game.
     */
    let goal
      = Array.from(this.teams.entries()).filter(([team, members]) => {
        return team !== Team.Tanner && (
          team === Team.Village || members.some(p => !p.current.info.isAide)
        )
      }).length < 3
        ? 1
        : 2

    const out: Player[] = []
    for (const [idx, [player, n]] of votes.entries()) {
      if (player.current.lynch(player, this)) {
        out.push(player)
        if (--goal <= 0 && n > votes[idx + 1][1])
          break
      }
    }

    await this.reply(
      this.ctx.t("vote.results", {
        users: out.map(p => p.name).join(", "),
        num: out.length,
      }),
    )

    while (this.events.length > 0) {
      const event = this.events.shift()!
      await event.fn()
      this.timeline.push(event)
    }
  }

  /**
   * Determine and display the outcome of the game
   */
  async getWinners() {
    setWins(this)

    this.players.forEach(p => p.current.checkWin(p, this))

    const results = this.players
      .map((p) => {
        const roleName
          = p.currentRole.fullRole(this.ctx)
        return `${p.name}: ${p.won ? this.ctx.t("game.won") : this.ctx.t("game.lost")} ${
          p.isDead ? this.ctx.t("game.dead") : this.ctx.t("game.alive")
        }  -  ${roleName}`
      })
      .join("\n")

    const unassigned = this.unassignedRoles
      .map((r) => {
        return r.currentRole.fullRole(this.ctx)
      })
      .join(", ")

    const msg
      = `<strong>${this.ctx.t("game.end")}</strong>\n\n${results}\n\n`
      + `${this.ctx.t("vote.unassigned", {
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
    this.assign(deck)

    await this.reply(
      `${this.ctx.t("game.roles")}\n${deck
        .map(r => this.ctx.t(r.mask))
        .sort()
        .join("\n")}`,
      undefined,
      "trace",
    )

    return deck.some(r => isCopier(r))
  }

  assign(deck: Role[]) {
    this.roles = deck
    this.players.forEach((p, i) => {
      p.setup(deck[i])

      if (false && config.isDev && p.id === config.BOT_OWNER_USER_ID) {
        const role = new Roles.ApprenticeSeer()
        p.setup(role)
        deck[i] = role
      }

      // collate players by team
      const teamMembers = this.teams.get(p.role.info.team)
      if (teamMembers === undefined)
        this.teams.set(p.role.info.team, [p])
      else teamMembers.push(p)

      if (p.ctx === undefined)
        return
      this.ctx.api.sendMessage(p.id, this.ctx.t(p.role.lore))
    })
    this.unassignedRoles = deck
      .slice(this.players.length)
      .map((r, idx) => new Player(idx, this.ctx.t("misc.unassigned_role", { idx: idx + 1 }), r, undefined))
  }

  /**
   * Announce the timeline of events that happened during the night
   */
  async announceTimeline() {
    const eventBlock = this.timeline
      .map((e) => {
        return `${e.icon} ${this.ctx.t(`events.${e.type}`)} -  ${e.author.name}:  [ ${e.targets
          .map(t => t.name)
          .join(", ")} ]`
      })
      .join("\n")

    await this.reply(`${this.ctx.t("events")}\n\n${eventBlock}`)
  }

  /**
   * End the game, updating the database with the results
   */
  async end(aborted?: true) {
    this.state = "ended"

    if (!aborted) {
      for (const p of this.players) {
        await p.ctx?.prisma.stats.logGame(p, this)
      }
    }

    this.cleanupMsgs(this.traceMsgs)
    deleteGame(this)
  }

  async unload() {
    await Promise.all(this.bin)
  }

  /**
   * Delete all service messages
   */
  cleanupMsgs(messages: (Message.TextMessage & Message)[]) {
    messages.forEach(msg => this.bin.push(this.ctx.api.deleteMessage(this.chatId, msg.message_id)))
    messages.length = 0
  }

  async cleanupPMs(fallback = Actions.Vote.fallback) {
    for (const [playerId, promise] of this.privateMsgs.entries()) {
      const player = this.playerMap.get(playerId)!

      await player.ctx?.conversation.exit()

      promise.then((msg) => {
        this.ctx.api.editMessageText(playerId, msg.message_id, this.ctx.t("game.times_up"))
        fallback(this, player)
      })
    }
  }

  async countdownPrompt(
    ts: number,
    duration: number = this.settings.joinTimeout,
    kb: InlineKeyboard | undefined = undefined,
  ) {
    if (timeLeftReminders.map(x => duration - x).includes(ts)) {
      const left = duration - ts
      await this.reply(this.ctx.t("game.seconds_left", { time: left }), {
        reply_markup: kb,
      }, "service")
    }
  }

  async reply(msg: string, other?: Other<"sendMessage", "chat_id" | "text">, type?: "trace" | "service") {
    const rep = this.ctx.reply(msg, { ...other, reply_to_message_id: this.topicId })
    if (type === "trace")
      this.traceMsgs.push(await rep)
    else if (type === "service")
      this.serviceMsgs.push(await rep)
    return rep
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
