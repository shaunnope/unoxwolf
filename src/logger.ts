import pino from "pino"
import { config } from "~/config"

type LogLevel = typeof config.LOG_LEVEL

export function buildLogger(level: LogLevel | undefined = undefined) {
  const log_level = level === undefined ? config.LOG_LEVEL : level
  return pino({
    level: log_level,
    transport: {
      targets: [
        ...(config.isDev
          ? [
              {
                target: "pino-pretty",
                level: log_level,
                options: {
                  ignore: "pid,hostname",
                  colorize: true,
                  translateTime: true,
                },
              },
            ]
          : [
              {
                target: "pino/file",
                level: log_level,
                options: {},
              },
            ]),
      ],
    },
  })
}

export const logger = buildLogger()

export type Logger = typeof logger
