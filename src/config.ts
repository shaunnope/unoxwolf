import { API_CONSTANTS } from "grammy"
import z, { ZodError, ZodIssueCode } from "zod"
import "dotenv/config"

function parseJsonSafe(path: string) {
  return (value: unknown) => {
    try {
      return JSON.parse(String(value))
    }
    catch {
      throw new ZodError([
        {
          code: ZodIssueCode.custom,
          path: [path],
          fatal: true,
          message: "Invalid JSON",
        },
      ])
    }
  }
}

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).default("info"),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  BOT_SERVER_HOST: z.string().default("0.0.0.0"),
  BOT_SERVER_PORT: z.coerce.number().positive().default(80),
  BOT_ALLOWED_UPDATES: z
    .preprocess(arg => parseJsonSafe(arg as string), z.array(z.enum(API_CONSTANTS.ALL_UPDATE_TYPES)))
    .catch([]),
  BOT_TOKEN: z.string(),
  BOT_WEBHOOK: z.string().url(),
  BOT_OWNER_USER_ID: z.coerce.number().safe(),
  BOT_ADMIN_USER_ID: z
    .preprocess(arg => parseJsonSafe(arg as string), z.array(z.coerce.number().safe()).or(z.coerce.number().safe()))
    // .array(z.coerce.number().safe()).or(z.coerce.number().safe())
    .transform(v => (Array.isArray(v) ? v : [v]))
    .catch([]),
})

export function parseConfig(environment: NodeJS.ProcessEnv) {
  const config = configSchema.parse(environment)

  return {
    ...config,
    isDev: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test",
    isProd: process.env.NODE_ENV === "production",
  }
}

export type Config = ReturnType<typeof parseConfig>

export const config = parseConfig(process.env)
