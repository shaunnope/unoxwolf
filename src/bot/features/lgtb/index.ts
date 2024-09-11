import { Composer } from "grammy"
import type { Context } from "~/bot/context"
import { logHandle } from "~/bot/helpers/logging"

import stickers from "./lgtb.json"

const composer = new Composer<Context>()

const feature = composer.chatType("private")

feature.on(":sticker", async (ctx) => {
  const sticker = {
    file_id: ctx.msg.sticker.file_id,
    file_unique_id: ctx.msg.sticker.file_unique_id,
    width: ctx.msg.sticker.width,
    height: ctx.msg.sticker.height,
    is_animated: ctx.msg.sticker.is_animated,
    thumb: ctx.msg.sticker.thumbnail,
    emoji: ctx.msg.sticker.emoji,
    set_name: ctx.msg.sticker.set_name,
    mask_position: ctx.msg.sticker.mask_position,
    file_size: ctx.msg.sticker.file_size,
  }
  ctx.reply(JSON.stringify(sticker) || ctx.t("gmgm.no-set-name"))
})

composer.command(["gmgm_lgtb", "lgtb", "gmgm"], logHandle("command-gmgm"), (ctx) => {
  const sticker = stickers[Math.floor(Math.random() * stickers.length)]
  ctx.api.sendSticker(ctx.msg.chat.id, sticker.file_id, {
    reply_to_message_id: ctx.msg.message_id,
  })
})

composer.inlineQuery(["gmgm_lgtb", "lgtb", "gmgm"], logHandle("inline-gmgm"), async (ctx) => {
  const sticker = stickers[Math.floor(Math.random() * stickers.length)]
  await ctx.answerInlineQuery(
    [
      {
        type: "sticker",
        id: sticker.file_unique_id,
        sticker_file_id: sticker.file_id,
      },
    ],
    {
      cache_time: 0,
    },
  )
})

export { composer as lgtbFeature }
