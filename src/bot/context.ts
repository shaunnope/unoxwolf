import { Update, UserFromGetMe } from "@grammyjs/types";
import { UserPayload } from "@prisma/client";
import { Context as DefaultContext, SessionFlavor, type Api, type CommandContext } from "grammy";
import type { Container } from "~/container";
import { Logger } from "~/logger";

import { AutoChatActionFlavor } from "@grammyjs/auto-chat-action";
import { HydrateFlavor } from "@grammyjs/hydrate";
import { I18nFlavor } from "@grammyjs/i18n";
import { ParseModeFlavor } from "@grammyjs/parse-mode";
import { PrismaClientX } from "~/prisma";

type ScopeUser = Omit<
  UserPayload<PrismaClientX["$extends"]["extArgs"]>["scalars"],
  "updatedAt" | "createdAt"
>;

export interface ContextScope {
  user?: ScopeUser;
}

type ExtendedContextFlavor = {
  container: Container;
  prisma: PrismaClientX;
  logger: Logger;
  scope: ContextScope;
};

export type ContextScopeWith<P extends keyof ContextScope> = Record<
  "scope",
  Record<P, NonNullable<ContextScope[P]>>
>;

type SessionData = {
  // field?: string;
};

export type Context = ParseModeFlavor<
  HydrateFlavor<
    DefaultContext &
      ExtendedContextFlavor &
      SessionFlavor<SessionData> &
      I18nFlavor &
      AutoChatActionFlavor
  >
>;

// HACK: Override the implementation of `ctx.has.command` for case-insensitive handling of bot commands
type MaybeArray<T> = T | T[]
type StringWithSuggestions<S extends string> = (string & Record<never, never>) | S;

function toArray(e: any) {
  return Array.isArray(e) ? e : [e];
}

const customChecker = DefaultContext.has;
customChecker.command = function<S extends string>(command: MaybeArray<StringWithSuggestions<S | "start" | "help" | "settings">>): <C extends DefaultContext>(ctx: C) => ctx is CommandContext<C> {
  const hasEntities = customChecker.filterQuery(":entities:bot_command");
  const atCommands = new Set();
  const noAtCommands = new Set();
  toArray(command).forEach((cmd) => {
      if (cmd.startsWith("/")) {
          throw new Error(`Do not include '/' when registering command handlers (use '${cmd.substring(1)}' not '${cmd}')`);
      }
      const set = cmd.indexOf("@") === -1 ? noAtCommands : atCommands;
      set.add(cmd);
  });
  return (ctx) => {
      var _a, _b;
      if (!hasEntities(ctx))
          return false;
      const msg = (_a = ctx.message) !== null && _a !== void 0 ? _a : ctx.channelPost;
      if (!msg) return false;
      const txt = (_b = msg.text) !== null && _b !== void 0 ? _b : msg.caption;
      if (!txt) return false;
      return msg.entities.some((e) => {
          if (e.type !== "bot_command")
              return false;
          if (e.offset !== 0)
              return false;
          const cmd = txt.substring(1, e.length);
          if (noAtCommands.has(cmd) || atCommands.has(cmd)) {
              ctx.match = txt.substring(cmd.length + 1).trimStart();
              return true;
          }
          const index = cmd.indexOf("@");
          if (index === -1)
              return false;
          const atTarget = cmd.substring(index + 1);
          if (atTarget.toLowerCase() !== ctx.me.username.toLowerCase())
              return false;
          const atCommand = cmd.substring(0, index);
          if (noAtCommands.has(atCommand)) {
              ctx.match = txt.substring(cmd.length + 1).trimStart();
              return true;
          }
          return false;
      });
  };
};
// END HACK

export function createContextConstructor(container: Container) {
  return class extends DefaultContext implements ExtendedContextFlavor {
    container: Container;
    prisma: PrismaClientX;
    logger: Logger;
    scope: ContextScope;

    static has = customChecker; // HACK: Override `ctx.has.command`

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me);

      this.container = container;
      this.prisma = container.prisma;
      this.logger = container.logger.child({
        update_id: this.update.update_id,
      });
      this.scope = {};
    }
  } as unknown as new (update: Update, api: Api, me: UserFromGetMe) => Context;
}