import { BotError } from "grammy";

import { log } from "./logger";

export const errHandler = (err: BotError) => {
    log.error("", err);
}