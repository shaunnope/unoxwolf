import { BotError, Composer, Context, NextFunction, session } from "grammy";

import { db } from "../firebase/data/repository";
import { parseMessageG as parseMessage } from "../firebase/data/reshape";

const errHandler = (err: BotError) => {
    console.error("", err);
}

export const savedMessages = new Composer().errorBoundary(errHandler);

savedMessages.command('save', (ctx) => {

    if (ctx.message) {
        let message = ctx.message;

        const parsed = parseMessage(message);

        db.saveMessage(parsed);
        console.log(message);
        ctx.reply("Saved message");
    }  
    
})

savedMessages.command('load', async (ctx: Context) => {
    if (!ctx.from) return;
    let uid = ctx.from.id;
    let saved = await db.loadMessages(uid);
    if (saved === undefined || saved.length == 0) {
        ctx.reply("No saved messages.")
    } else {
        ctx.reply("Retrieving saved messages...")
        let message: string = "";
        for (let msg of saved) {
            message += msg + "\n"
        }
        message += `_${saved.length} of ${saved.length} messages_`;
        ctx.reply(message, { parse_mode: "MarkdownV2"});
    }
})