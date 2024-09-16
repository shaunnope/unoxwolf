import { setupTestEnv } from "tests/common"

import { container } from "tests/container"
import { MockChat } from "tests/runner/chat"
import { MockGame } from "tests/runner/game"
import { mockUsers } from "tests/runner/user"

import type { RawApiRequest } from "tests/common"
import { Team } from "~/game/models/enums"
import type { Role } from "~/game/models/role"
import * as Roles from "~/game/roles"

try {
  jest.useFakeTimers()
  const queue: RawApiRequest[] = []
  const bot = setupTestEnv(queue, container)
  const { games } = container

  const chat = new MockChat({
    type: "group",
    id: -101,
    title: "Test Group",
  })

  let game: MockGame
  let chats: MockChat[]
  let roles: (typeof Role)[]

  beforeEach(() => {
    queue.length = 0
  })

  afterEach(async () => {
    await jest.runAllTimersAsync()
    await game.end()
  })

  describe("win conditions", () => {
    beforeEach(async () => {
      roles = [
        Roles.Werewolf,
        Roles.Werewolf,
        Roles.Minion,
        Roles.Villager,
      ]
      chats = MockChat.fromUsers(mockUsers(roles.length))

      game = await MockGame.init(bot, chat, chats, games, queue)
      game.assign(roles.map(R => new R()))

      queue.length = 0
    })

    it("win when no death", async () => {
      const votes = game.players.map((_, idx) => (idx + 1) % game.players.length)

      game.processVotes(game.collate(votes)).then(() => game.getWinners())
      await jest.runAllTimersAsync()

      expect(game.info.winInfo[Team.Village]).toBe(false)
      expect(game.info.winInfo[Team.Werewolf]).toBe(true)
      game.players.forEach((player) => {
        expect(player.won).toBe(player.team === Team.Werewolf)
      })
    })

    it("win when minion death", async () => {
      const votes = game.players.map(_player => 2)

      game.processVotes(game.collate(votes)).then(() => game.getWinners())
      await jest.runAllTimersAsync()

      expect(game.info.winInfo[Team.Village]).toBe(false)
      expect(game.info.winInfo[Team.Werewolf]).toBe(true)
      game.players.forEach((player) => {
        expect(player.won).toBe(player.team === Team.Werewolf)
      })
    })

    it("lose when wolf death", async () => {
      const votes = game.players.map(_player => 0)

      game.processVotes(game.collate(votes)).then(() => game.getWinners())
      await jest.runAllTimersAsync()

      expect(game.info.winInfo[Team.Village]).toBe(true)
      expect(game.info.winInfo[Team.Werewolf]).toBe(false)
      game.players.forEach((player) => {
        expect(player.won).toBe(player.team !== Team.Werewolf)
      })
    })
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
