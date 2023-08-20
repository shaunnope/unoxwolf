import { i18n } from '../i18n'

export const DEFAULT_LANGUAGE_CODE = 'en'

if (!i18n.locales.includes(DEFAULT_LANGUAGE_CODE)) {
  throw new Error(`Localization for default language code (${DEFAULT_LANGUAGE_CODE}) is missing`)
}

const ALL_COMMANDS = new Map<string, { command: string; description: string }>(
  Object.entries({
    start: {
      command: 'start',
      description: 'commands.start',
    },
    help: {
      command: 'help',
      description: 'commands.help',
    },
    language: {
      command: 'language',
      description: 'commands.language',
    },
    stats: {
      command: 'stats',
      description: 'commands.stats',
    },
    setcommands: {
      command: 'setcommands',
      description: 'commands.setcommands',
    },
    admin: {
      command: 'admin',
      description: 'commands.admin',
    },
    rolelist: {
      command: 'rolelist',
      description: 'commands.rolelist',
    },
    startgame: {
      command: 'startgame',
      description: 'commands.startgame',
    },
    flee: {
      command: 'flee',
      description: 'commands.flee',
    },
    players: {
      command: 'players',
      description: 'commands.players',
    },
    ping: {
      command: 'ping',
      description: 'commands.ping',
    },
  })
)

const getCommand = (key: string, localeCode: string = DEFAULT_LANGUAGE_CODE) => {
  const command = ALL_COMMANDS.get(key)
  if (command === undefined) {
    return {
      command: key,
      description: i18n.t(localeCode, 'commands.unknown'),
    }
  }
  return {
    command: command.command,
    description: i18n.t(localeCode, command.description),
  }
}

export const getPrivateChatCommands = (options: { localeCode: string; includeLanguageCommand: boolean }) => {
  const commands = [getCommand('start', options.localeCode), getCommand('ping', options.localeCode)]

  if (options.includeLanguageCommand) {
    commands.push(getCommand('language', options.localeCode))
  }

  return commands
}

export const getPrivateChatAdminCommands = (options: { localeCode: string; includeLanguageCommand: boolean }) => {
  const commands = [getCommand('stats', options.localeCode), getCommand('setcommands', options.localeCode)]

  return commands
}

export const getGroupChatCommands = (options: { localeCode: string }) => {
  const commands = [
    getCommand('startgame', options.localeCode),
    getCommand('join', options.localeCode),
    getCommand('flee', options.localeCode),
    getCommand('players', options.localeCode),
    getCommand('ping', options.localeCode),
  ]
  return commands
}
