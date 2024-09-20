import type { Message, User } from "@grammyjs/types"
import type { RawApiRequest } from "tests/common"
import type { MockChat } from "./chat"
import { getGameId } from "tests/common"
import type { Bot } from "~/bot"
import type { Game } from "~/game"
import type { Votes } from "~/game/game"
import { createPlayers } from "~/game/helpers/create-players"
import { deleteGame } from "~/game/helpers/game.context"
import type { Phase } from "~/game/models/enums"
import type { Role } from "~/game/models/role"

export class MockGame {
  #game: Game
  #bot: Bot
  #chat: MockChat
  #creator: User
  #playerChats: MockChat[]

  #collected?: true
  #assigned?: true
  #voted?: "setup" | true
  #ended?: true

  constructor(game: Game, bot: Bot, chat: MockChat, user: User) {
    this.#game = game
    this.#bot = bot
    this.#chat = chat
    this.#creator = user
    this.#playerChats = []
  }

  get id() {
    return this.#game.id
  }

  get players() {
    return this.#game.players
  }

  get info() {
    return this.#game
  }

  /**
   * Start a new MockGame
   */
  static async start(
    bot: Bot,
    chat: MockChat,
    user: User,
    games: Map<string, Game>,
    queue: RawApiRequest[],
  ) {
    await bot.handleUpdate(chat.mockCommand(user, "startgame"))
    const game = games.get(getGameId(queue[queue.length - 1]))
    if (game === undefined) {
      throw new Error("A game should exist after /startgame")
    }
    return new MockGame(game, bot, chat, user)
  }

  /**
   * Initialize a MockGame
   */
  static async init(
    bot: Bot,
    chat: MockChat,
    users: MockChat[],
    games: Map<string, Game>,
    queue: RawApiRequest[],
  ) {
    const game = await MockGame.start(bot, chat, users[0].user!, games, queue)
    await game.addPlayers(users)
    await game.skip()
    queue.length = 0

    return game
  }

  skip() {
    this.#check()
    return this.#bot.handleUpdate(this.#chat.mockCommand(this.#creator, "forcenext"))
  }

  assign(roles: Role[]) {
    this.#check()
    if (this.#assigned)
      throw new Error("Roles already assigned")

    this.#assigned = true
    this.#game.assign(roles)

    return this
  }

  async doAction(index: number, message: Message, action: string, target?: string) {
    this.#check()
    const chat = this.#playerChats[index]
    message.from = this.#bot.botInfo
    message.chat = chat.chat

    const data = target === undefined ? `${action}${this.id}` : `${action}${this.id}+${target}`

    await this.#bot
      .handleUpdate(chat.mockCallbackQuery(chat.user!, message, data))
  }

  /**
   * Perform actions
   * @param keyboards A queue of requests containing actionable inline keyboards
   * @param actions
   */
  async doActions(keyboards: RawApiRequest[], actions: MaybeAction[]) {
    this.#check()
    for (const kb of keyboards) {
      const payload = kb.payload
      if (!("reply_markup" in payload && "chat_id" in payload))
        throw new Error("Action queue should have inline keyboard")
      const idx = payload.chat_id as number
      const action = actions[idx]
      if (action === undefined)
        continue

      await this.doAction(idx, payload as Message, ...action)
    }
    keyboards.length = 0
  }

  /**
   * Mock voting stage
   * @param queue should contain the vote keyboards
   * @param targets indices of vote targets
   */
  async vote(
    queue: RawApiRequest[],
    targets: (number | undefined)[],
  ) {
    this.#check()
    if (this.#voted !== "setup")
      throw new Error("Not ready to vote")
    if (this.#playerChats.length !== targets.length)
      throw new Error("Vote targets should match no. of players")

    for (const idx of this.#playerChats.keys()) {
      const tar = targets[idx]
      if (tar === undefined)
        continue
      const target = this.#playerChats[tar].user!
      const message = queue.shift()!.payload as Message

      await this.doAction(idx, message, "vote", target.id.toString())
    }
  }

  /**
   * Transform targets into votes
   * @param targets
   */
  collate(targets: number[]) {
    this.#check()
    if (this.#playerChats.length !== targets.length)
      throw new Error("Vote targets should match no. of players")

    const votes: Votes[] = this.#game.players.map(player => [
      player,
      0,
      [],
    ])
    this.#game.players.forEach((player, idx) => {
      const target = targets[idx]
      const vote = votes[target]
      vote[1]++
      vote[2].push(player)
    })

    return votes
  }

  async addPlayers(users: MockChat[]) {
    this.#check()
    this.collectPlayers()
    for (const chat of users) {
      await this.#bot
        .handleUpdate(chat.mockCommand(chat.user!, "start", `join${this.id}`))
    }
    this.#playerChats.push(...users)
  }

  async addFakePlayers(roles: (typeof Role)[]) {
    this.#game.addPlayers(
      createPlayers(roles.length, this.players.length).map((player, idx) => {
        player.setup(new roles[idx]())
        return player
      }),
    )
  }

  #check() {
    if (this.#ended)
      throw new Error("Game already ended")
  }

  // --- Game wrappers ---

  collectPlayers() {
    this.#check()
    if (this.#collected)
      return
    this.#collected = true
    return this.#game.collectPlayers()
  }

  assignRolesAndNotify() {
    this.#check()
    if (this.#assigned)
      return
    this.#assigned = true
    return this.#game.assignRolesAndNotify()
  }

  async setupVotes() {
    this.#check()
    if (this.#voted)
      return
    this.#voted = this.#voted || "setup"
    await this.#game.setupVotes()

    for (const [_, message] of this.#game.privateMsgs) {
      await message
    }
  }

  async collectVotes() {
    this.#check()
    if (this.#voted === true)
      return
    if (this.#voted === undefined)
      await this.setupVotes()
    this.#voted = true

    return this.#game.collectVotes()
  }

  async unload() {
    await this.#game.unload()
  }

  async end() {
    this.#check()
    this.#ended = true
    deleteGame(this.#game)
    await this.#game.unload()
  }

  processVotes(votes: Votes[]) {
    this.#check()
    return this.#game.processVotes(votes)
  }

  getWinners() {
    this.#check()
    return this.#game.getWinners()
  }

  setupPhase(phase: Phase) {
    this.#check()
    return this.#game.setupPhase(phase)
  }

  runPhase(phase: Phase) {
    this.#check()
    return this.#game.runPhase(phase)
  }
}

type _Target = string | undefined
type Action = [string, _Target]
type MaybeAction = Action | undefined
