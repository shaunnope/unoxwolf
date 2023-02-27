import * as dotenv from 'dotenv'
dotenv.config() // set process.env

import bot from './src/bot';

console.info('Starting bot...')
bot.start();

function stop_bot() {
  console.info('Stopping bot...')
  bot.stop()
}

// Enable graceful stop
process.once('SIGINT', stop_bot)
process.once('SIGTERM', stop_bot)