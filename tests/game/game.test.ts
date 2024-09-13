import { setupTestEnv } from "tests/common"
import { container } from "tests/container"

import { MockChat } from "tests/runner/chat"
import { mockUser } from "tests/runner/user"
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
    // const result = outgoingRequests.pop();
    // if (result && "text" in result.payload) {
    //   expect(result.payload.text).toBe(1);
    // } else {
    //   throw new Error("No text in payload");
    // }
  }, 5000)
}
catch (error) {
  container.logger.error(error)
  process.exit(1)
}
