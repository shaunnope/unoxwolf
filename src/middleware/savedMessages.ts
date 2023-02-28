import { Composer, Context } from "grammy";

import { errHandler } from "../utils/handler";

import { db } from "../firebase/data/repository";
import { parseMessageG as parseMessage } from "../firebase/data/reshape";

export const savedMessages = new Composer().errorBoundary(errHandler);

savedMessages.command('save', (ctx) => {

    if (ctx.message) {
        const message = ctx.message;

        const parsed = parseMessage(message);

        db.saveMessage(parsed);
        console.log(message);
        ctx.reply("Saved message");
    }  
    
})

savedMessages.command('load', async (ctx: Context) => {
    if (!ctx.from) return;
    const uid = ctx.from.id;
    const saved = await db.loadMessages(uid);
    if (saved === undefined || saved.length == 0) {
        ctx.reply("No saved messages.")
    } else {
        ctx.reply("Retrieving saved messages...")
        let message = "";
        for (const msg of saved) {
            message += msg + "\n"
        }
        message += `_${saved.length} of ${saved.length} messages_`;
        ctx.reply(message, { parse_mode: "MarkdownV2"});
    }
})