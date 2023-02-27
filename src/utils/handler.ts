import { BotError } from "grammy";

export const errHandler = (err: BotError) => {
    console.error("", err);
}