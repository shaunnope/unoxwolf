import pino from "pino"
import { config } from "~/config"

export function buildLogger(isDev: boolean = false) {
  return pino({
    level: config.LOG_LEVEL,
    transport: {
      targets: [
        ...(config.isDev || isDev
          ? [
              {
                target: "pino-pretty",
                level: config.LOG_LEVEL,
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
                level: config.LOG_LEVEL,
                options: {},
              },
            ]),
      ],
    },
  })
}

export const logger = buildLogger()

export type Logger = typeof logger
