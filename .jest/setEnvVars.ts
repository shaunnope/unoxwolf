process.env = {
  NODE_ENV: 'test',
  LOG_LEVEL: 'info',
  DATABASE_URL: 'postgresql://postgres:testing@localhost:5432/test?schema=public',
  REDIS_URL: 'redis://localhost:6379/0',
  BOT_SERVER_HOST: '0.0.0.0',
  BOT_SERVER_PORT: '80',
  BOT_ALLOWED_UPDATES: '[]',
  BOT_TOKEN: 'test',
  BOT_WEBHOOK: 'https://example.com/test',
  BOT_OWNER_USER_ID: '1',
  BOT_ADMIN_USER_ID: '[1]',
}
