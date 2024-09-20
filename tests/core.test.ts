import type { RawApiRequest } from "tests/common"
import { setupTestEnv } from "tests/common"

import { container } from "tests/container"
import { MockChat } from "tests/runner/chat"
import { mockUser } from "tests/runner/user"

try {
  const outgoingRequests: RawApiRequest[] = []
  const bot = setupTestEnv(outgoingRequests, container)

  beforeEach(() => {
    outgoingRequests.length = 0
  })

  it("can handle /start in private", async () => {
    const user = mockUser(1234)
    const chat = MockChat.fromUser(user)

    await bot.handleUpdate(chat.mockCommand(user, "start"))

    expect(outgoingRequests).toHaveLength(1)
  }, 5000)
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
