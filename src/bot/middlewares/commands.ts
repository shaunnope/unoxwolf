import { Middleware } from 'grammy'
import { Context } from '~/bot/context'
import { getPrivateChatCommandEntries } from '~/bot/helpers/bot-commands'

export const getWelcomeMessage = (): Middleware<Context> => (ctx: Context) => {
  ctx.reply(`${ctx.t('welcome')}\n${getPrivateChatCommandEntries(ctx.from?.language_code || 'en')}`)
}
