import { BotError, CommandContext, Composer, Context, NextFunction, session } from "grammy";
import { errHandler } from "../utils/handler";

import lgtb_stickers from "./lgtb.json";
// const lgtb_stickers = require("./lgtb.json");

export const lgtb = new Composer().errorBoundary(errHandler);

// init.use(session);

// logger
lgtb.use((ctx, next) => {
    const start = Date.now()
    return next().then(() => {
      const ms = Date.now() - start
      console.log('response time %sms', ms)
    })
})

lgtb.on(":sticker", async (ctx) => {
    const sticker = {
        file_id: ctx.msg.sticker.file_id,
        file_unique_id: ctx.msg.sticker.file_unique_id,
        width: ctx.msg.sticker.width,
        height: ctx.msg.sticker.height,
        is_animated: ctx.msg.sticker.is_animated,
        thumb: ctx.msg.sticker.thumb,
        emoji: ctx.msg.sticker.emoji,
        set_name: ctx.msg.sticker.set_name,
        mask_position: ctx.msg.sticker.mask_position,
        file_size: ctx.msg.sticker.file_size
    }
    ctx.reply( JSON.stringify(sticker) || "No sticker set name")

})

async function bread(ctx: CommandContext<Context>) {
    let sticker = lgtb_stickers[Math.floor(Math.random() * lgtb_stickers.length)]
    ctx.api.sendSticker(ctx.msg.chat.id, sticker.file_id, {reply_to_message_id: ctx.msg.message_id})
}

lgtb.command("gmgm_lgtb", bread)
lgtb.command("lgtb", bread)
lgtb.command("gmgm", bread)
