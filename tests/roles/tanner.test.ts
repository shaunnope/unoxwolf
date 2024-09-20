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
    id: -400,
    title: "Test Group",
  })

  let game: MockGame

  const roles: (typeof Role)[] = [
    Roles.Tanner,
    Roles.Tanner,

    Roles.Villager,
    Roles.Seer,
    Roles.Robber,
    Roles.Troublemaker,
    Roles.Mason,
    Roles.Drunk,
    Roles.Insomniac,
    Roles.Hunter,
    Roles.Doppelganger, // default team of DG is village

    Roles.Werewolf,
    Roles.Minion,
  ]
  const chats = MockChat.fromUsers(mockUsers(roles.length))

  beforeEach(async () => {
    game = await MockGame.init(bot, chat, chats, games, queue)
    game.assign(roles.map(R => new R()))

    queue.length = 0
  })

  afterEach(async () => {
    await jest.runAllTimersAsync()
    await game.end()
  })

  it("only win when dead", async () => {
    const votes = game.players.map(_ => 0)

    game.processVotes(game.collate(votes)).then(() => game.getWinners())
    await jest.runAllTimersAsync()

    expect(game.info.winInfo[Team.Tanner]).toBe(true)
    expect(game.info.winInfo[Team.Village]).toBe(false)
    expect(game.info.winInfo[Team.Werewolf]).toBe(false)
    game.players.forEach((player, idx) => {
      expect(player.won).toBe(idx === 0)
    })
  })

  it("cannot win when alive", async () => {
    const votes = game.players.map((_, idx) => (idx + 1) % game.players.length)

    game.processVotes(game.collate(votes)).then(() => game.getWinners())
    await jest.runAllTimersAsync()

    expect(game.info.winInfo[Team.Tanner]).toBe(false)
    expect(game.info.winInfo[Team.Village]).toBe(false)
    expect(game.info.winInfo[Team.Werewolf]).toBe(true)
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
