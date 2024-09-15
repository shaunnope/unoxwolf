import _ from "lodash"
import { expectRequests, setupTestEnv } from "tests/common"

import { container } from "tests/container"

import { MockChat } from "tests/runner/chat"
import { MockGame } from "tests/runner/game"
import { mockUsers } from "tests/runner/user"
import type { RawApiRequest } from "tests/common"

import type { Role } from "~/game/models/role"
import * as Roles from "~/game/roles"

try {
  jest.useFakeTimers()
  const queue: RawApiRequest[] = []
  const bot = setupTestEnv(queue, container)
  const { games } = container

  const roles: (typeof Role)[] = [
    Roles.Werewolf,
    Roles.Villager,
    Roles.Villager,
    Roles.Villager,
    Roles.Villager,
    Roles.Villager,
  ]
  const n = roles.length

  const group = new MockChat({
    type: "group",
    id: -4,
    title: "Test Group",
  })
  const chats = MockChat.fromUsers(mockUsers(n))

  let game: MockGame

  beforeEach(async () => {
    game = (await MockGame.init(bot, group, chats, games, queue))
      .assign(roles.map(R => new R()))

    queue.length = 0
  })

  afterEach(async () => {
    jest.runAllTimersAsync()
    await game.end()
  })

  it("can collect votes", async () => {
    await game.setupVotes()
    expect(queue).toHaveLength(n + 1)
    queue.shift()

    await game.vote(queue, _.range(n).map(x => (x + 1) % n))
    game.collectVotes()

    await game.skip()
    await jest.runAllTimersAsync()

    expect(queue).toHaveLength(2 * n + 5)
    expectRequests(queue, [
      "answerCallbackQuery",
      "You selected mock-1",
      "answerCallbackQuery",
      "You selected mock-2",
      "answerCallbackQuery",
      "You selected mock-3",
      "answerCallbackQuery",
      "You selected mock-4",
      "answerCallbackQuery",
      "You selected mock-5",
      "answerCallbackQuery",
      "You selected mock-0",
      "<em>Skipping forward...</em>",
      "deleteMessage",
      "deleteMessage",
      "Voting has ended! Tallying votes...",
      "editMessageText",
    ])
  })

  describe("highest voted is lynched", () => {
    it("can lynch unanimous", async () => {

    })

    it("can lynch w/o unanimous", async () => {

    })
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
