import _ from "lodash"
import { expectRequests, setupTestEnv } from "tests/common"

import { container } from "tests/container"

import { MockChat } from "tests/runner/chat"
import { MockGame } from "tests/runner/game"
import { mockUsers } from "tests/runner/user"
import type { RawApiRequest } from "tests/common"

import type { Votes } from "~/game/game"
import type { Role } from "~/game/models/role"
import * as Roles from "~/game/roles"

try {
  jest.useFakeTimers()
  const queue: RawApiRequest[] = []
  const bot = setupTestEnv(queue, container)
  const { games } = container

  /**
   * Basic role setup. Villager + Tanner + Non-villager
   */
  const roles: (typeof Role)[] = [
    Roles.Werewolf,
    Roles.Tanner,
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
    await jest.runAllTimersAsync()
    await game.end()
  })

  it("can collect votes with fallback", async () => {
    await game.setupVotes()
    expect(queue).toHaveLength(n + 1)
    queue.shift()

    const targets: (number | undefined)[] = _.range(n).map(x => (x + 1) % n)
    targets[1] = undefined

    await game.vote(queue, targets)
    const votes = game.collectVotes()

    await game.skip()
    await jest.runAllTimersAsync()

    expectRequests(queue, [
      "sendMessage",
      "answerCallbackQuery",
      "You selected mock-1",
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
      "Time's up!",
      "Voting has ended! Tallying votes...",
      "editMessageText",
    ])

    const final_votes = await votes
    if (final_votes === undefined) {
      throw new Error("Should have votes")
    }

    expect(final_votes[1][0].votedFor).toBeDefined()
  })

  it("should not lynch when all counts one", async () => {
    const votes: Votes[] = game.players.map((player, idx) => [
      player,
      1,
      [game.players[(idx - 1) % game.players.length]],
    ])

    game.processVotes(votes)
    await jest.runAllTimersAsync()

    expectRequests(queue, [
      "No one received more than one vote!",
      "deleteMessage",
    ])
  })

  describe("highest voted is lynched", () => {
    it("can lynch unanimous", async () => {
      const votes = game.players.map((_, idx) => idx === 0 ? 1 : 0)

      game.processVotes(game.collate(votes))
      await jest.runAllTimersAsync()

      expectRequests(queue, [
        "At the end of the vote, mock-0 was executed!",
        "deleteMessage",
      ])
    })

    it("can lynch w/o unanimous", async () => {
      const votes = [1, 2, 1, 4, 5, 0]
      game.processVotes(game.collate(votes))
      await jest.runAllTimersAsync()

      expectRequests(queue, [
        "At the end of the vote, mock-1 was executed!",
        "deleteMessage",
      ])
    })

    it("can lynch multiple", async () => {
      const votes = [1, 2, 0, 2, 1, 0]
      game.processVotes(game.collate(votes))
      await jest.runAllTimersAsync()

      expectRequests(queue, [
        "At the end of the vote, mock-0, mock-1, mock-2 were executed!",
        "deleteMessage",
      ])
    })
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
