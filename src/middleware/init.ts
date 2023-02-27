import { BotError, Composer, Context, NextFunction, session } from "grammy";
import { errHandler } from "../utils/handler";

export const init = new Composer().errorBoundary(errHandler);

// init.use(session);

// logger
init.use((ctx, next) => {
    const start = Date.now()
    return next().then(() => {
      const ms = Date.now() - start
      console.log('response time %sms', ms)
    })
})

init.command("start", (ctx) => {
    ctx.reply("Hi there! I am Horace, here to provide you with personalised scheduling and reminders via Telegram since 2022. Tap on /help to learn more about my various features.\n\nTry me now!")
  
})

init.command("help", (ctx) => {
    ctx.reply("Send me a sticker")
})

init.command("settings", (ctx) => {
    ctx.reply("Displaying Settings");
})

init.command("info", (ctx) => {
    if (ctx.message) {
        ctx.reply(ctx.message.text.split(" ").toLocaleString())
    } else {
        ctx.reply("No message sent");
    }
    
})
