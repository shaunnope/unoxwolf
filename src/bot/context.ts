import { Update, UserFromGetMe } from '@grammyjs/types'
import { Prisma } from '@prisma/client'
import { Context as DefaultContext, SessionFlavor, type Api, type MiddlewareFn } from 'grammy'
import {
  type Conversation as DefaultConversation,
  type ConversationFlavor,
  createConversation as defaultCreateConversation,
  ConversationFn,
  ConversationConfig,
} from '@grammyjs/conversations'

import { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import { HydrateFlavor } from '@grammyjs/hydrate'
import { I18nFlavor } from '@grammyjs/i18n'
import { ParseModeFlavor } from '@grammyjs/parse-mode'
import { Logger } from '~/logger'
import type { Container } from '~/container'
import { PrismaClientX } from '~/prisma'

import { ActionChoice } from '~/game/gameplay/actions'
import type { Game } from '~/game'

// HACK: Override `ctx.has.command`
import { customChecker } from './helpers/hack.bot-command'
import { logConvoHandle } from './helpers/logging'

type ScopeUser = Omit<Prisma.$UserPayload<PrismaClientX['$extends']['extArgs']>['scalars'], 'updatedAt' | 'createdAt'>

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
  // group data
  games: { [key: string]: string } // map of topicId to gameId

  // user data
  game: string // gameId
  actions: ActionChoice[] // pending action choices
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

// FIXME: log wrapper doesn't appear to work
export const createConversation = <C extends DefaultContext>(
  builder: ConversationFn<C>,
  config: string | ConversationConfig = {}
): MiddlewareFn<C & ConversationFlavor> => {
  const { id = builder.name, maxMillisecondsToWait }: ConversationConfig =
    typeof config === 'string' ? { id: config } : config
  return defaultCreateConversation<C>(
    async (conversation: DefaultConversation<C>, ctx: C) => {
      logConvoHandle(id, ctx)
      await builder(conversation, ctx)
      logConvoHandle(id, ctx, true)
    },
    { id, maxMillisecondsToWait }
  )
}
