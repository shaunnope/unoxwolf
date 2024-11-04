import type { InlineKeyboardMarkup } from "@grammyjs/types"
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
    id: -201,
    title: "Test Group",
  })

  let game: MockGame

  // can protect: self, other
  // cannot peek protected: self, other
  // cannot swap protected: self, other

  describe("protect behaviour is correct", () => {
    // is publicly announced
    // can be voted out

    const roles: (typeof Role)[] = [
      Roles.GuardianAngel,
      Roles.Villager,
      Roles.Villager,
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

    it("can protect self", async () => {
      await game.setupPhase(Phase.Dusk)
      expect(keyboards).toHaveLength(1)
      const kb = (keyboards[0].payload)
      if (!("reply_markup" in kb))
        fail("Invalid action keyboard")
      const options = (kb.reply_markup as InlineKeyboardMarkup).inline_keyboard
      expect(options).toHaveLength(2) // 2 rows: 3 players + pass
      expect(options[0]).toHaveLength(3)
      expect(options[1]).toHaveLength(1)

      await game.doActions(
        keyboards,
        [
          ["prot", "0"],
        ],
      )
      game.runPhase(Phase.Dusk)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()

      expectRequests(
        queue,
        [
          "Who would you like to protect?",
          "answerCallbackQuery",
          "You selected mock-0",
          "<em>Skipping forward...</em>",
          "deleteMessage",
          "mock-0 was protected by the Guardian Angel 👼",
          "Night falls...",
        ],
      )
    })

    it("can protect other", async () => {
      await game.setupPhase(Phase.Dusk)
      expect(keyboards).toHaveLength(1)
      const kb = (keyboards[0].payload)
      if (!("reply_markup" in kb))
        fail("Invalid action keyboard")
      const options = (kb.reply_markup as InlineKeyboardMarkup).inline_keyboard
      expect(options).toHaveLength(2) // 2 rows: 3 players + pass
      expect(options[0]).toHaveLength(3)
      expect(options[1]).toHaveLength(1)

      await game.doActions(
        keyboards,
        [
          ["prot", "1"],
        ],
      )
      game.runPhase(Phase.Dusk)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()

      expectRequests(
        queue,
        [
          "Who would you like to protect?",
          "answerCallbackQuery",
          "You selected mock-1",
          "<em>Skipping forward...</em>",
          "deleteMessage",
          "mock-1 was protected by the Guardian Angel 👼",
          "Night falls...",
        ],
      )
    })
  })

  describe.each([
    [Roles.Seer, 3], // 1 other, 1 unassigned, 1 pass
    [Roles.Robber, 2], // 1 other, 1 unassigned
    [Roles.Troublemaker, 2], // 1 other, 1 unassigned
  ] as [typeof Role, number][])("can protect other action: %s", (role, buttons) => {
    const roles: (typeof Role)[] = [
      role,
      Roles.Villager,
      Roles.Villager,
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

    it("cannot view protected other", async () => {
      game.players[1].isProtected = true
      await game.setupPhase(Phase.Night)
      expect(keyboards).toHaveLength(1)
      const kb = (keyboards[0].payload)
      if (!("reply_markup" in kb))
        fail("Invalid action keyboard")
      const options = (kb.reply_markup as InlineKeyboardMarkup).inline_keyboard
      const count = options.reduce((prev, row) => prev + row.length, 0)
      expect(count).toEqual(buttons)

      game.runPhase(Phase.Night)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()
    })
  })

  describe.each([
    [
      Roles.Insomniac,
      "As you drift off to sleep, you feel a sense of security, knowing that you will be safe from harm tonight.",
    ],
    [
      Roles.Robber,
      "Under the Guardian Angel's protective gaze, you decided that it'd be best not to rob roles tonight.",
    ],
  ] as [typeof Role, string][])("protected self = skip: %s", (role, skipMsg) => {
    const roles: (typeof Role)[] = [
      role,
      Roles.Villager,
      Roles.Villager,
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

    it("cannot view protected self", async () => {
      game.players[0].isProtected = true
      await game.setupPhase(Phase.Night)
      game.runPhase(Phase.Night)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()

      expectRequests(
        queue,
        [
          skipMsg,
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
