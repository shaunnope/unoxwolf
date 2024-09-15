import { setupTestEnv } from "tests/common"
import { container } from "tests/container"

import { MockChat } from "tests/runner/chat"
import { MockGame } from "tests/runner/game"
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
    id: -3,
    title: "Test Group",
  })
  const dms = MockChat.fromUsers(users)

  beforeEach(() => {
    queue.length = 0
  })

  it("can assign roles", async () => {
    const game = await MockGame.start(bot, chat, users[0], games, queue)
    await game.addPlayers(dms)
    await bot.handleUpdate(chat.mockCommand(users[0], "forcenext"))
    queue.length = 0

    await game.assign()
    await jest.runAllTimersAsync()

    expect(queue).toHaveLength(users.length + 2)
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
