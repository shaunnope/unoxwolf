import { getGameId } from "tests/common"
import type { User } from "@grammyjs/types"
import type { RawApiRequest } from "tests/common"
import type { Bot } from "~/bot"
import type { Game } from "~/game"
import type { MockChat } from "./chat"

export async function start(
  bot: Bot,
  chat: MockChat,
  user: User,
  games: Map<string, Game>,
  queue: RawApiRequest[],
) {
  await bot.handleUpdate(chat.mockCommand(user, "startgame"))
  const game = games.get(getGameId(queue[queue.length - 1]))
  if (game === undefined) {
    throw new Error("A game should exist after /startgame")
  }
  return game
}
