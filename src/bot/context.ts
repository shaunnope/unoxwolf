import { Update, UserFromGetMe } from '@grammyjs/types'
import { UserPayload } from '@prisma/client'
import { Context as DefaultContext, SessionFlavor, type Api } from 'grammy'
import { type Conversation as DefaultConversation, type ConversationFlavor } from '@grammyjs/conversations'

import { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import { HydrateFlavor } from '@grammyjs/hydrate'
import { I18nFlavor } from '@grammyjs/i18n'
import { ParseModeFlavor } from '@grammyjs/parse-mode'
import { Logger } from '~/logger'
import type { Container } from '~/container'
import { PrismaClientX } from '~/prisma'

import type { Game } from '~/game'

// HACK: Override `ctx.has.command`
import { customChecker } from './helpers/hack.bot-command'

type ScopeUser = Omit<UserPayload<PrismaClientX['$extends']['extArgs']>['scalars'], 'updatedAt' | 'createdAt'>

export interface ContextScope {
  user?: ScopeUser
}

type ExtendedContextFlavor = {
  prisma: PrismaClientX
  logger: Logger
  scope: ContextScope

  games: Map<string, Game>
}

export type ContextScopeWith<P extends keyof ContextScope> = Record<'scope', Record<P, NonNullable<ContextScope[P]>>>

export type SessionData = {
  // field?: string;
  games: { [key: string]: string } // map of topicId to gameId
}

export type Context = ParseModeFlavor<
  HydrateFlavor<
    DefaultContext &
      ExtendedContextFlavor &
      SessionFlavor<SessionData> &
      I18nFlavor &
      AutoChatActionFlavor &
      ConversationFlavor
  >
>

export type Conversation = DefaultConversation<Context>

export function createContextConstructor(container: Container) {
  return class extends DefaultContext implements ExtendedContextFlavor {
    prisma: PrismaClientX

    logger: Logger

    games: Map<string, Game>

    scope: ContextScope

    static has = customChecker // HACK: Override `ctx.has.command`

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me)

      this.prisma = container.prisma
      this.logger = container.logger.child({
        update_id: this.update.update_id,
      })
      this.games = container.games

      this.scope = {}
    }
  } as unknown as new (update: Update, api: Api, me: UserFromGetMe) => Context
}
