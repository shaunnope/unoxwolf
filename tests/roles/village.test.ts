import type { RawApiRequest } from "tests/common"

import { setupTestEnv } from "tests/common"
import { container } from "tests/container"
import { MockChat } from "tests/runner/chat"
import { MockGame } from "tests/runner/game"

import { mockUsers } from "tests/runner/user"
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
    id: -100,
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
    describe("no wolves", () => {
      beforeEach(async () => {
        roles = [
          Roles.Villager,
          Roles.Seer,
          Roles.Robber,
          Roles.Troublemaker,
          Roles.Mason,
          Roles.Drunk,
          Roles.Insomniac,
          Roles.Hunter,
          Roles.Doppelganger, // default team of DG is village
        ]
        chats = MockChat.fromUsers(mockUsers(roles.length))

        game = await MockGame.init(bot, chat, chats, games, queue)
        game.assign(roles.map(R => new R()))

        queue.length = 0
      })

      it("win when no deaths", async () => {
        const votes = game.players.map((_, idx) => (idx + 1) % game.players.length)

        game.processVotes(game.collate(votes)).then(() => game.getWinners())
        await jest.runAllTimersAsync()

        expect(game.info.winInfo[Team.Village]).toBe(true)
        game.players.forEach((player) => {
          expect(player.won).toBe(true)
        })
      })

      it("lose when some death", async () => {
        // const target = _.random(game.players.length)
        const votes = game.players.map(_player => 0)

        game.processVotes(game.collate(votes)).then(() => game.getWinners())
        await jest.runAllTimersAsync()

        expect(game.info.winInfo[Team.Village]).toBe(false)
        game.players.forEach((player) => {
          expect(player.won).toBe(false)
        })
      })
    })

    describe("some wolf", () => {
      beforeEach(async () => {
        roles = [
          Roles.Werewolf,
          Roles.Villager,
          Roles.Seer,
          Roles.Robber,
          Roles.Troublemaker,
          Roles.Mason,
          Roles.Drunk,
          Roles.Insomniac,
          Roles.Hunter,
          Roles.Doppelganger, // default team of DG is village
        ]
        chats = MockChat.fromUsers(mockUsers(roles.length))

        game = await MockGame.init(bot, chat, chats, games, queue)
        game.assign(roles.map(R => new R()))

        queue.length = 0
      })

      it("lose when wolf live", async () => {
        const votes = game.players.map((_, idx) => (idx + 1) % game.players.length)

        game.processVotes(game.collate(votes)).then(() => game.getWinners())
        await jest.runAllTimersAsync()

        expect(game.info.winInfo[Team.Village]).toBe(false)
        expect(game.info.winInfo[Team.Werewolf]).toBe(true)
        game.players.forEach((player) => {
          expect(player.won).toBe(player.team !== Team.Village)
        })
      })

      it("win when wolf death", async () => {
        const votes = game.players.map(_player => 0)

        game.processVotes(game.collate(votes)).then(() => game.getWinners())
        await jest.runAllTimersAsync()

        expect(game.info.winInfo[Team.Village]).toBe(true)
        expect(game.info.winInfo[Team.Werewolf]).toBe(false)
        game.players.forEach((player) => {
          expect(player.won).toBe(player.team === Team.Village)
        })
      })
    })
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
