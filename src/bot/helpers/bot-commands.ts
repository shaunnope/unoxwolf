import type { BotCommand } from "@grammyjs/types"
import { i18n } from "~/bot/i18n"

export const DEFAULT_LANGUAGE_CODE = "en"

if (!i18n.locales.includes(DEFAULT_LANGUAGE_CODE)) {
  throw new Error(`Localization for default language code (${DEFAULT_LANGUAGE_CODE}) is missing`)
}

const ALL_COMMANDS = new Map<string, BotCommand>(
  Object.entries({
    start: {
      command: "start",
      description: "commands.start",
    },
    help: {
      command: "help",
      description: "commands.help",
    },
    language: {
      command: "language",
      description: "commands.language",
    },
    stats: {
      command: "stats",
      description: "commands.stats",
    },
    setcommands: {
      command: "setcommands",
      description: "commands.setcommands",
    },
    admin: {
      command: "admin",
      description: "commands.admin",
    },
    rolelist: {
      command: "rolelist",
      description: "commands.rolelist",
    },
    phases: {
      command: "phases",
      description: "commands.phases",
    },
    startgame: {
      command: "startgame",
      description: "commands.startgame",
    },
    leave: {
      command: "leave",
      description: "commands.leave",
    },
    players: {
      command: "players",
      description: "commands.players",
    },
    ping: {
      command: "ping",
      description: "commands.ping",
    },
    forcenext: {
      command: "forcenext",
      description: "commands.forcenext",
    },
  }),
)

function getCommand(key: string, localeCode: string = DEFAULT_LANGUAGE_CODE): BotCommand {
  const command = ALL_COMMANDS.get(key)
  if (command === undefined) {
    return {
      command: key,
      description: i18n.t(localeCode, "commands.unknown"),
    }
  }
  return {
    command: command.command,
    description: i18n.t(localeCode, command.description),
  }
}

function getGlobalChatCommands(localeCode: string): BotCommand[] {
  return [
    getCommand("start", localeCode),
    getCommand("help", localeCode),
    getCommand("rolelist", localeCode),
    getCommand("ping", localeCode),
  ]
}

export function getPrivateChatCommands(localeCode: string): BotCommand[] {
  return [...getGlobalChatCommands(localeCode), getCommand("rolelist", localeCode), getCommand("phases", localeCode)]
}

export function getPrivateChatAdminCommands(localeCode: string): BotCommand[] {
  return [...getPrivateChatCommands(localeCode), getCommand("setcommands", localeCode)]
}

export function getGroupChatCommands(localeCode: string): BotCommand[] {
  return [
    getCommand("startgame", localeCode),
    getCommand("leave", localeCode),
    getCommand("players", localeCode),
    getCommand("forcenext", localeCode),
  ]
}

export function getLanguageCommand(localeCode: string): BotCommand {
  return getCommand("language", localeCode)
}

export function getCommandEntries(...commands: BotCommand[]) {
  return commands.map(c => `/${c.command} - ${c.description}`).join("\n")
}

export function getPrivateChatCommandEntries(localeCode: string = DEFAULT_LANGUAGE_CODE) {
  return getCommandEntries(...getPrivateChatCommands(localeCode))
}
