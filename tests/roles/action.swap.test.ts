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
    id: -500,
    title: "Test Group",
  })

  let game: MockGame

  // TODO: convo tests (TM)
  describe("can swap", () => {
    const roles: (typeof Role)[] = [
      Roles.Villager,
      Roles.Drunk,
      Roles.Robber,
    ]

    const unassigned = [
      Roles.Mason,
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
     * Drunk can swap unassigned
     * Robber can swap self
     */
    it("night", async () => {
      await game.setupPhase(Phase.Night)
      await game.doActions(
        keyboards,
        [
          undefined,
          undefined,
          ["swap", "0"],
        ],
      )
      game.runPhase(Phase.Night)
      await game.skip()
      await jest.runAllTimersAsync()
      await game.unload()

      expectRequests(
        queue,
        [
          "In your drunken stupor, you swapped your role with Role 1",
          "Whose role would you like to rob?",
          "answerCallbackQuery",
          "You selected mock-0",
          "<em>Skipping forward...</em>",
          "deleteMessage",
          "You stole mock-0's role. You are now a Villager 👱",
          "The sun rises...",
        ],
      )

      expect(game.players[0].current).toBeInstanceOf(Roles.Robber)
      expect(game.players[1].current).toBeInstanceOf(Roles.Mason)
      expect(game.players[2].current).toBeInstanceOf(Roles.Villager)
    })
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
