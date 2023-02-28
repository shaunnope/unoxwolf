import { log } from '../utils/logger';
import { Context, NextFunction } from "grammy";

export const mw_logger = async (ctx: Context, next: NextFunction) => {
    const start = Date.now();
    return next().then(() => {
        const ms = Date.now() - start
        log.debug(`${ctx.msg?.from || 'user'}: response time ${ms}ms`);
      })
}