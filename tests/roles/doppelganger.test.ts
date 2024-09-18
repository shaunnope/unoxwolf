import { setupTestEnv } from "tests/common"

import { container } from "tests/container"
import { MockChat } from "tests/runner/chat"
import { MockGame } from "tests/runner/game"
import { mockUsers } from "tests/runner/user"

import type { RawApiRequest } from "tests/common"
import { Copy } from "~/game/gameplay/actions"
import { Team } from "~/game/models/enums"
import type { Role } from "~/game/models/role"
import * as Roles from "~/game/roles"

try {
  jest.useFakeTimers()
  const queue: RawApiRequest[] = []
  const keyboards: RawApiRequest[] = []
  const bot = setupTestEnv(queue, container, (bot) => {
    bot.api.config.use((prev, method, payload, signal) => {
      if ("reply_markup" in payload) {
        keyboards.push({ method, payload, signal })
      }
      return prev(method, payload, signal)
    })
  })
  const { games } = container

  const group = new MockChat({
    type: "group",
    id: -300,
    title: "Test Group",
  })

  let game: MockGame

  afterEach(async () => {
    await jest.runAllTimersAsync()
    await game.end()
  })

  describe.each([
    Roles.Villager,
    Roles.Seer,
    Roles.Robber,
    Roles.Troublemaker,
    Roles.Mason,
    Roles.Drunk,
    Roles.Insomniac,
    Roles.Hunter,
    Roles.Doppelganger,
  ] as (typeof Role)[])("village: %s", (role) => {
    const roles = [
      Roles.Doppelganger,
      role,
    ]
    const n = roles.length
    const chats = MockChat.fromUsers(mockUsers(n))

    beforeEach(async () => {
      game = (await MockGame.init(bot, group, chats, games, queue))
        .assign(roles.map(R => new R()))
      Copy.fallback(game.info, game.players[0])

      queue.length = 0
      keyboards.length = 0
    })

    it("death = lose", async () => {
      const votes = game.players.map(_player => 0)
      game.processVotes(game.collate(votes)).then(() => game.getWinners())
      await jest.runAllTimersAsync()
      expect(game.info.winInfo[Team.Village]).toBe(false)
      game.players.forEach((player) => {
        expect(player.won).toBe(false)
      })
    })

    it("alive = win", async () => {
      const votes = game.players.map((_, idx) => (idx + 1) % game.players.length)
      game.processVotes(game.collate(votes)).then(() => game.getWinners())
      await jest.runAllTimersAsync()
      expect(game.info.winInfo[Team.Village]).toBe(true)
      game.players.forEach((player) => {
        expect(player.won).toBe(true)
      })
    })
  })

  describe.each([
    Roles.Werewolf,
    Roles.Minion,
  ] as (typeof Role)[])("wolf: %s", (role) => {
    const roles = [
      Roles.Doppelganger,
      role,
      Roles.Werewolf,
    ]
    const n = roles.length
    const chats = MockChat.fromUsers(mockUsers(n))

    const deathWin = role === Roles.Minion

    beforeEach(async () => {
      game = (await MockGame.init(bot, group, chats, games, queue))
        .assign(roles.map(R => new R()))
      Copy.fallback(game.info, game.players[0])

      queue.length = 0
      keyboards.length = 0
    })

    it(`death = ${deathWin ? "win" : "lose"}`, async () => {
      const votes = game.players.map(_player => 0)
      game.processVotes(game.collate(votes)).then(() => game.getWinners())
      await jest.runAllTimersAsync()

      expect(game.info.winInfo[Team.Werewolf]).toBe(deathWin)
      game.players.forEach((player) => {
        expect(player.won).toBe(deathWin)
      })
    })

    it(`alive = win`, async () => {
      const votes = game.players.map((_, idx) => (idx + 1) % game.players.length)
      game.processVotes(game.collate(votes)).then(() => game.getWinners())
      await jest.runAllTimersAsync()

      expect(game.info.winInfo[Team.Werewolf]).toBe(true)
      game.players.forEach((player) => {
        expect(player.won).toBe(true)
      })
    })
  })

  describe("actions", () => {
    const roles: (typeof Role)[] = [
      Roles.Doppelganger,
      Roles.Villager,
      Roles.Werewolf,
    ]
    const unassigned: (typeof Role)[] = [
      Roles.Villager,
    ]
    const n = roles.length
    const chats = MockChat.fromUsers(mockUsers(n))

    beforeEach(async () => {
      game = (await MockGame.init(bot, group, chats, games, queue))
        .assign(roles.concat(...unassigned).map(R => new R()))

      queue.length = 0
      keyboards.length = 0
    })

    it("can peek player", async () => {
      // await game.setupPhase(Phase.Night)
      // await game.doActions(
      //   keyboards,
      //   [
      //     undefined,
      //     undefined,
      //     ["peek", "1"],
      //     undefined,
      //     undefined,
      //   ],
      // )
      // game.runPhase(Phase.Night)
      // await game.skip()
      // await jest.runAllTimersAsync()
      // await game.unload()

      // expectRequests(
      //   queue,
      //   [
      //     "You are the only werewolf.",
      //     "You are the only mason.",
      //     "Whose role would you like to look at?",
      //     "Whose role would you like to look at?",
      //     "answerCallbackQuery",
      //     "You selected mock-1",
      //     "<em>Skipping forward...</em>",
      //     "deleteMessage",
      //     "Time's up!",
      //     "mock-1 is a Mason 👷",
      //     "You are still the Insomniac 😴",
      //     "The sun rises...",
      //   ],
      // )
    })
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
