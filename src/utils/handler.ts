import type { BotError } from "grammy"

import { log } from "./logger"

export function errHandler(err: BotError) {
  log.error("", err)
}
