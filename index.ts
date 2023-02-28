import * as dotenv from 'dotenv'
dotenv.config() // set process.env

import { log } from './src/utils/logger';

import bot from './src/bot';

log.info('Starting bot...')
bot.start();

function stop_bot() {
  log.info('Stopping bot...')
  bot.stop()
}

// Enable graceful stop
process.once('SIGINT', stop_bot)
process.once('SIGTERM', stop_bot)