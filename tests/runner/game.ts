import { getGameId } from "tests/common"
import type { Message, User } from "@grammyjs/types"
import type { RawApiRequest } from "tests/common"
import type { Bot } from "~/bot"
import type { Game } from "~/game"
import type { Votes } from "~/game/game"
import type { Role } from "~/game/models/role"
import type { MockChat } from "./chat"

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
    return this.#bot.handleUpdate(this.#chat.mockCommand(this.#creator, "forcenext"))
  }

  assign(roles: Role[]) {
    if (this.#assigned)
      throw new Error("Roles already assigned")

    this.#assigned = true
    this.#game.assign(roles)

    return this
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
    if (this.#voted !== "setup")
      throw new Error("Not ready to vote")
    if (this.#playerChats.length !== targets.length)
      throw new Error("Vote targets should match no. of players")

    for (const [idx, chat] of this.#playerChats.entries()) {
      const tar = targets[idx]
      if (tar === undefined)
        continue
      const target = this.#playerChats[tar].user!
      const message = queue.shift()!.payload as Message
      message.from = this.#bot.botInfo
      message.chat = chat.chat
      await this.#bot
        .handleUpdate(chat.mockCallbackQuery(chat.user!, message, `vote${this.id}+${target.id}`))
    }
  }

  /**
   * Transform targets into votes
   * @param targets
   */
  collate(targets: number[]) {
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
    this.collectPlayers()
    for (const chat of users) {
      await this.#bot
        .handleUpdate(chat.mockCommand(chat.user!, "start", `join${this.id}`))
    }
    this.#playerChats.push(...users)
  }

  // --- Game wrappers ---

  collectPlayers() {
    if (this.#collected)
      return
    this.#collected = true
    return this.#game.collectPlayers()
  }

  assignRolesAndNotify() {
    if (this.#assigned)
      return
    this.#assigned = true
    return this.#game.assignRolesAndNotify()
  }

  async setupVotes() {
    if (this.#voted)
      return
    this.#voted = this.#voted || "setup"
    await this.#game.setupVotes()

    for (const [_, message] of this.#game.privateMsgs) {
      await message
    }
  }

  async collectVotes() {
    if (this.#voted === true)
      return
    if (this.#voted === undefined)
      await this.setupVotes()
    this.#voted = true

    return this.#game.collectVotes()
  }

  async end() {
    if (this.#ended)
      return
    return this.#game.end(true)
  }

  processVotes(votes: Votes[]) {
    return this.#game.processVotes(votes)
  }

  getWinners() {
    return this.#game.getWinners()
  }
}
