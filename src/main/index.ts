import { Bot } from 'grammy'

import { BotContext } from '../app/types'

const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Bot<BotContext>(token)


export { bot }
