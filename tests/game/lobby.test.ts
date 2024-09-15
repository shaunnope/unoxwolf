import { expectRequests, setupTestEnv } from "tests/common"
import { container } from "tests/container"

import { MockChat } from "tests/runner/chat"
import * as MockGame from "tests/runner/game"
import { mockUsers } from "tests/runner/user"
import type { RawApiRequest } from "tests/common"

try {
  jest.useFakeTimers()
  const queue: RawApiRequest[] = []
  const bot = setupTestEnv(queue, container)
  const { games } = container

  const users = mockUsers(5)
  const chat = new MockChat({
    type: "group",
    id: -2,
    title: "Test Group",
  })
  const dms = MockChat.fromUsers(users)

  beforeEach(() => {
    queue.length = 0
  })

  it("can handle /startgame in group", async () => {
    // can start new game
    const game = await MockGame.start(bot, chat, users[0], games, queue)
    game.collectPlayers()

    // cannot start another game in same group
    await bot.handleUpdate(chat.mockCommand(users[1], "startgame"))
    // should not be processed because not run by game creator
    await bot.handleUpdate(chat.mockCommand(users[1], "forcenext"))
    // skip wait: game should end because not enough players
    await bot.handleUpdate(chat.mockCommand(users[0], "forcenext"))

    await jest.runAllTimersAsync()

    expectRequests(
      queue,
      [
        "mock-0 has started a new game!",
        "A game has already been started!",
        "<em>Skipping forward...</em>",
        "deleteMessage",
        "Not enough players to start the game!",
        "deleteMessage",
      ],
    )
  }, 5000)

  it("can handle joins and leaves", async () => {
    const game = await MockGame.start(bot, chat, users[0], games, queue)
    const canStart = game.collectPlayers()

    await bot.handleUpdate(dms[0].mockCommand(users[0], "start", `join${game.id}`))
    await bot.handleUpdate(dms[1].mockCommand(users[1], "start", `join${game.id}`))
    await bot.handleUpdate(dms[2].mockCommand(users[2], "start", `join${game.id}`))

    await bot.handleUpdate(chat.mockCommand(users[1], "leave"))
    await bot.handleUpdate(chat.mockCommand(users[0], "forcenext"))

    await jest.runAllTimersAsync()

    expect(await canStart).toBe(false)

    expectRequests(
      queue,
      [
        "mock-0 has started a new game!",
        "You joined the game in Test Group!",
        "You joined the game in Test Group!",
        "You joined the game in Test Group!",
        "mock-1 has left the game!",
        "<em>Skipping forward...</em>",
        "deleteMessage",
        "Not enough players to start the game!",
        "deleteMessage",
      ],
    )
  }, 5000)

  it("can start game with sufficient players", async () => {
    const game = await MockGame.start(bot, chat, users[0], games, queue)
    const canStart = game.collectPlayers()

    await bot.handleUpdate(dms[0].mockCommand(users[0], "start", `join${game.id}`))
    await bot.handleUpdate(dms[1].mockCommand(users[1], "start", `join${game.id}`))
    await bot.handleUpdate(dms[2].mockCommand(users[2], "start", `join${game.id}`))

    await bot.handleUpdate(chat.mockCommand(users[0], "forcenext"))

    await jest.runAllTimersAsync()

    expect(await canStart).toBe(true)
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
