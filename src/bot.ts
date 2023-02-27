import { Bot } from "grammy";
import { init } from "./middleware/init";
import { savedMessages } from "./middleware/savedMessages";
import { lgtb } from "./middleware/lgtb";

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Bot(token);

bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
    { command: "settings", description: "Open settings" },
])

bot.use(init);
bot.use(lgtb);
bot.use(savedMessages);

export default bot;
