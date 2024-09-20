import type { RawApiRequest } from "tests/common"
import { setupTestEnv } from "tests/common"

import { container } from "tests/container"
import { MockChat } from "tests/runner/chat"
import { MockGame } from "tests/runner/game"
import { mockUsers } from "tests/runner/user"

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
    const game = await MockGame.init(bot, chat, dms, games, queue)

    await game.assignRolesAndNotify()
    await jest.runAllTimersAsync()

    expect(queue).toHaveLength(users.length + 2)
  })
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
