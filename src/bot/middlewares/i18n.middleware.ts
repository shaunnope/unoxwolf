import { Middleware } from 'grammy'
import type { Context } from '../context'
import { i18n as i18nProvider } from '../i18n'

export const i18n = (): Middleware<Context> => i18nProvider
