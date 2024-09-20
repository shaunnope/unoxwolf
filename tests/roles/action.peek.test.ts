import type { RawApiRequest } from "tests/common"

import { expectRequests, setupTestEnv } from "tests/common"
import { container } from "tests/container"
import { MockChat } from "tests/runner/chat"
import { MockGame } from "tests/runner/game"

import { mockUsers } from "tests/runner/user"
import { Phase } from "~/game/models/enums"
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
    id: -200,
    title: "Test Group",
  })

  let game: MockGame

  describe("lone revealers", () => {
    const roles: (typeof Role)[] = [
      Roles.Werewolf,
      Roles.Mason,
      Roles.Seer,
      Roles.Insomniac,
      Roles.ApprenticeSeer,
    ]
    const unassigned: (typeof Role)[] = [
      Roles.Robber,
      Roles.Troublemaker,
      Roles.Drunk,
    ]
    const n = roles.length
    const chats = MockChat.fromUsers(mockUsers(n))

    beforeEach(async () => {
      game = (await MockGame.init(bot, group, chats, games, queue))
        .assign(roles.concat(...unassigned).map(R => new R()))

      queue.length = 0
      keyboards.length = 0
    })

    afterEach(async () => {
      await jest.runAllTimersAsync()
      await game.end()
    })

    /**
     * Werewolf can see lone message
     * Mason can see lone message
     * Seer can view role.
     * Insomniac can see unchanged
     */
    it("can peek player", async () => {
      await game.setupPhase(Phase.Night)
      await game.doActions(
        keyboards,
        [
          undefined,
          undefined,
          ["peek", "1"],
          undefined,
          undefined,
        ],
      )
      game.runPhase(Phase.Night)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()

      expectRequests(
        queue,
        [
          "You are the only werewolf.",
          "You are the only mason.",
          "Whose role would you like to look at?",
          "Whose role would you like to look at?",
          "answerCallbackQuery",
          "You selected mock-1",
          "<em>Skipping forward...</em>",
          "deleteMessage",
          "Time's up!",
          "mock-1 is a Mason 👷",
          "You are still the Insomniac 😴",
          "The sun rises...",
        ],
      )
    })

    /**
     * Seer can view unassigned
     * App Seer can view unassigned
     * Insomniac can see changed
     * Mason cannot see change
     */
    it("can peek unassigned", async () => {
      await game.setupPhase(Phase.Night)
      game.players[3].currentRole = new Roles.Mason()
      await game.doActions(
        keyboards,
        [
          undefined,
          undefined,
          ["peek", "un"],
          undefined,
          ["peek", "un"],
        ],
      )
      game.runPhase(Phase.Night)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()

      expectRequests(
        queue,
        [
          "You are the only werewolf.",
          "You are the only mason.",
          "Whose role would you like to look at?",
          "Whose role would you like to look at?",
          "answerCallbackQuery",
          "You selected Unassigned (2)",
          "answerCallbackQuery",
          "You selected Unassigned (1)",
          "<em>Skipping forward...</em>",
          "deleteMessage",
          "sendMessage",
          "sendMessage",
          "You are now a Mason 👷",
          "The sun rises...",
        ],
      )
    })
  })

  describe("multiple revealers", () => {
    const roles: (typeof Role)[] = [
      Roles.Werewolf,
      Roles.Werewolf,
      Roles.Mason,
      Roles.Mason,
    ]
    const n = roles.length
    const chats = MockChat.fromUsers(mockUsers(n))

    beforeEach(async () => {
      game = (await MockGame.init(bot, group, chats, games, queue))
        .assign(roles.map(R => new R()))

      queue.length = 0
      keyboards.length = 0
    })

    afterEach(async () => {
      await jest.runAllTimersAsync()
      await game.end()
    })

    /**
     * Werewolves can see each other
     * Masons can see each other
     */
    it("can see team", async () => {
      await game.setupPhase(Phase.Night)
      game.runPhase(Phase.Night)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()

      expectRequests(
        queue,
        [
          "You are werewolves together with mock-1",
          "You are werewolves together with mock-0",
          "You are masons together with mock-3.",
          "You are masons together with mock-2.",
          "<em>Skipping forward...</em>",
          "deleteMessage",
          "The sun rises...",
        ],
      )
    })
  })

  describe("lone + aides", () => {
    const roles: (typeof Role)[] = [
      Roles.Werewolf,
      Roles.Minion,
      Roles.Minion,
    ]
    const n = roles.length
    const chats = MockChat.fromUsers(mockUsers(n))

    beforeEach(async () => {
      game = (await MockGame.init(bot, group, chats, games, queue))
        .assign(roles.map(R => new R()))

      queue.length = 0
      keyboards.length = 0
    })

    afterEach(async () => {
      await jest.runAllTimersAsync()
      await game.end()
    })

    /**
     * Werewolf cannot see minions
     * Minions cannot see each other
     */
    it("can see team", async () => {
      await game.setupPhase(Phase.Night)
      game.runPhase(Phase.Night)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()

      expectRequests(
        queue,
        [
          "You are the only werewolf.",
          "mock-0 is a werewolf!",
          "mock-0 is a werewolf!",
          "<em>Skipping forward...</em>",
          "deleteMessage",
          "The sun rises...",
        ],
      )
    })
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
