import type { Prisma } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import { logger, type Logger } from "~/logger"

import statsExtension from "./stats.extension"

import userExtension from "./user.extension"

function parseParameters(parameters: string): unknown[] {
  try {
    return JSON.parse(parameters) as unknown[]
  }
  catch {
    return []
  }
}

export function buildPrisma(logger: Logger) {
  const client = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "event",
        level: "error",
      },
      {
        emit: "event",
        level: "info",
      },
      {
        emit: "event",
        level: "warn",
      },
    ],
  })

  client.$on("query", (e: Prisma.QueryEvent) => {
    const parameters = parseParameters(
      e.params.replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.?\d* UTC/g, date => `"${date}"`),
    )
    const query = e.query.replace(/(\?|\$\d+)/g, (match, param, offset, string: string) => {
      const parameter = JSON.stringify(parameters.shift())
      const previousChar = string.charAt(offset - 1)

      return (previousChar === "," ? " " : "") + parameter
    })

    logger.trace({
      msg: "database query",
      query,
      duration: e.duration,
    })
  })

  client.$on("error", (e: Prisma.LogEvent) => {
    logger.error({
      msg: "database error",
      target: e.target,
      message: e.message,
    })
  })

  client.$on("info", (e: Prisma.LogEvent) => {
    logger.info({
      msg: "database info",
      target: e.target,
      message: e.message,
    })
  })

  client.$on("warn", (e: Prisma.LogEvent) => {
    logger.warn({
      msg: "database warning",
      target: e.target,
      message: e.message,
    })
  })

  const xclient = client.$extends(userExtension).$extends(statsExtension)
  return xclient as typeof client & typeof xclient // inject client methods
}

const prisma = buildPrisma(logger)

export type PrismaClientX = typeof prisma

export { prisma }
