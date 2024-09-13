import { setupTestEnv } from "tests/common"
import { container } from "tests/container"

import { MockChat } from "tests/runner/chat"
import { mockUser, mockUsers } from "tests/runner/user"
import type { RawApiRequest } from "tests/common"

try {
  const outgoingRequests: RawApiRequest[] = []
  const bot = setupTestEnv(outgoingRequests, container)
  const { logger } = container

  beforeEach(() => {
    outgoingRequests.length = 0
  })

  it("can handle /start in private", async () => {
    logger.trace("test start command")

    const user = mockUser(1234)
    const chat = MockChat.fromUser(user)

    await bot.handleUpdate(chat.mockCommand(user, "start"))

    expect(outgoingRequests).toHaveLength(1)
  }, 5000)

  it("can handle /startgame in group", async () => {
    logger.trace("test startgame")

    const users = mockUsers(5)
    const chat = new MockChat({
      type: "group",
      id: -2,
      title: "Test Group",
    })

    await bot.handleUpdate(chat.mockCommand(users[0], "startgame"))
    await bot.handleUpdate(chat.mockCommand(users[0], "forcenext"))

    logger.debug({
      msg: "recorded requests",
      outgoingRequests,
    })

    expect(outgoingRequests).toHaveLength(2)
    const expected = [
      "mock-0 has started a new game!",
      "<em>Skipping forward...</em>",
    ]

    while (outgoingRequests.length > 0) {
      const result = outgoingRequests.pop()

      if (result && "text" in result.payload) {
        expect(result.payload.text).toBe(expected.pop())
      }
      else {
        throw new Error("No text in payload")
      }
    }
  }, 5000)
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
