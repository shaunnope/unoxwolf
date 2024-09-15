import { getGameId } from "tests/common"
import type { User } from "@grammyjs/types"
import type { RawApiRequest } from "tests/common"
import type { Bot } from "~/bot"
import type { Game } from "~/game"
import type { MockChat } from "./chat"

export class MockGame {
  #game: Game
  #bot: Bot
  #chat: MockChat

  #collected?: true
  #assigned?: true

  constructor(game: Game, bot: Bot, chat: MockChat) {
    this.#game = game
    this.#bot = bot
    this.#chat = chat
  }

  get id() {
    return this.#game.id
  }

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
    return new MockGame(game, bot, chat)
  }

  collectPlayers() {
    if (this.#collected)
      return
    this.#collected = true
    return this.#game.collectPlayers()
  }

  assign() {
    if (this.#assigned)
      return
    this.#assigned = true
    return this.#game.assignRolesAndNotify()
  }

  async addPlayers(users: MockChat[]) {
    this.collectPlayers()
    for (const chat of users) {
      await this.#bot
        .handleUpdate(chat.mockCommand(chat.user!, "start", `join${this.id}`))
    }
  }
}
