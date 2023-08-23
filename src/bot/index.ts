import { autoChatAction } from '@grammyjs/auto-chat-action'
import { hydrate } from '@grammyjs/hydrate'
import { hydrateReply, parseMode } from '@grammyjs/parse-mode'
import { conversations } from '@grammyjs/conversations'
import { Bot as TelegramBot, BotConfig, StorageAdapter } from 'grammy'
import type { Container } from '~/container'
import { gameFeature } from '~/game'
import { Context, createContextConstructor } from './context'
import { botAdminFeature, languageFeature, lgtbFeature, miscFeature, welcomeFeature } from './features'
import { errorHandler, unhandledHandler } from './handlers'
import { logHandle } from './helpers/logging'
import { isMultipleLocales } from './i18n'
import { i18n, metrics, session, setScope, updateLogger } from './middlewares'

type Dependencies = {
  container: Container
  sessionStorage: StorageAdapter<unknown>
}

export const createBot = (
  token: string,
  { container, sessionStorage }: Dependencies,
  botConfig?: Omit<BotConfig<Context>, 'ContextConstructor'>
) => {
  const { config } = container
  const bot = new TelegramBot(token, {
    ...botConfig,
    ContextConstructor: createContextConstructor(container),
  })

  // Middlewares

  bot.api.config.use(parseMode('HTML'))

  if (config.isDev) {
    bot.use(updateLogger())
  }

  bot.use(metrics())
  bot.use(autoChatAction())
  bot.use(hydrateReply)
  bot.use(hydrate())
  bot.use(session(sessionStorage))
  bot.use(setScope())
  bot.use(i18n())
  bot.use(conversations())

  // Handlers

  bot.use(gameFeature)

  bot.use(botAdminFeature)
  bot.use(welcomeFeature)

  bot.use(lgtbFeature)
  bot.use(miscFeature)

  if (isMultipleLocales) {
    bot.use(languageFeature)
  }

  bot.use(logHandle('unhandled'), unhandledHandler)

  if (config.isDev) {
    bot.catch(errorHandler)
  }

  return bot
}

export type Bot = ReturnType<typeof createBot>
