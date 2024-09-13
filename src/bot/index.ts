import { autoChatAction } from "@grammyjs/auto-chat-action"
import { conversations } from "@grammyjs/conversations"
import { hydrate } from "@grammyjs/hydrate"
import { hydrateReply, parseMode } from "@grammyjs/parse-mode"
import { Bot as TelegramBot } from "grammy"
import type { BotConfig, StorageAdapter } from "grammy"
import type { Container } from "~/container"
import { gameFeature } from "~/game"
import { createContextConstructor } from "./context"
import { botAdminFeature, languageFeature, miscFeature, welcomeFeature } from "./features"
import { errorHandler, unhandledHandler } from "./handlers"
import { isMultipleLocales } from "./i18n"
import { i18n, metrics, session, setScope, updateLogger } from "./middlewares"
import type { Context } from "./context"

interface Dependencies {
  container: Container
  sessionStorage: StorageAdapter<unknown>
}

export function createBot(
  token: string,
  { container, sessionStorage }: Dependencies,
  botConfig?: Omit<BotConfig<Context>, "ContextConstructor">,
) {
  const { config } = container
  const bot = new TelegramBot(token, {
    ...botConfig,
    ContextConstructor: createContextConstructor(container),
  })

  // Middlewares

  bot.api.config.use(parseMode("HTML"))

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

  bot.use(miscFeature)

  if (isMultipleLocales) {
    bot.use(languageFeature)
  }

  bot.use(unhandledHandler)

  if (config.isDev) {
    bot.catch(errorHandler)
  }

  return bot
}

export type Bot = ReturnType<typeof createBot>
