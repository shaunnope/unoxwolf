import type { AutoChatActionFlavor } from "@grammyjs/auto-chat-action"
import type { HydrateFlavor } from "@grammyjs/hydrate"
import type { I18nFlavor } from "@grammyjs/i18n"
import type { ParseModeFlavor } from "@grammyjs/parse-mode"
import type { Update, UserFromGetMe } from "@grammyjs/types"
import type { Prisma } from "@prisma/client"
import {
  type ConversationConfig,
  type ConversationFlavor,
  type ConversationFn,
  type Conversation as DefaultConversation,
  createConversation as defaultCreateConversation,
} from "@grammyjs/conversations"
import { type Api, Context as DefaultContext, type MiddlewareFn, type SessionFlavor } from "grammy"

import { logConvoHandle } from "~/bot/helpers/logging"
import type { Container } from "~/container"

import type { Game } from "~/game"
import type { ActionChoice } from "~/game/gameplay/actions"

import type { Logger } from "~/logger"
import type { PrismaClientX } from "~/prisma"

type ScopeUser = Omit<Prisma.$UserPayload<PrismaClientX["$extends"]["extArgs"]>["scalars"], "updatedAt" | "createdAt">

export interface ContextScope {
  user?: ScopeUser
}

interface ExtendedContextFlavor {
  prisma: PrismaClientX
  logger: Logger
  scope: ContextScope

  games: Map<string, Game>
}

export type ContextScopeWith<P extends keyof ContextScope> = Record<"scope", Record<P, NonNullable<ContextScope[P]>>>

export interface SessionData {
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
export function createConversation<C extends DefaultContext>(
  builder: ConversationFn<C>,
  config: string | ConversationConfig = {},
): MiddlewareFn<C & ConversationFlavor> {
  const { id = builder.name, maxMillisecondsToWait }: ConversationConfig
    = typeof config === "string" ? { id: config } : config
  return defaultCreateConversation<C>(
    async (conversation: DefaultConversation<C>, ctx: C) => {
      logConvoHandle(id, ctx)
      await builder(conversation, ctx)
      logConvoHandle(id, ctx, true)
    },
    { id, maxMillisecondsToWait },
  )
}
