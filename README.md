# ONUWolf Telegram Bot
ONUWolf is a Telegram bot to moderate Unoxian Werewolf games. It is currently in development.

## Getting Started
Make a copy of the `example.env` file and rename it to `.env`. Fill in the values for the environment variables.
```bash
cp example.env .env
```

## Environment Variables

| Variable | Type |Default | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | String | - | Application environment (`development` or `production`) |
| `BOT_TOKEN` | String | - | Token, get it from [@BotFather](https://t.me/BotFather). |
| `BOT_WEBHOOK` | String | - | Webhook endpoint, used to configure webhook in `production` environment. |
| `LOG_LEVEL` | String | `info` | <i>Optional.</i> Application log level. See [Pino docs](https://github.com/pinojs/pino/blob/master/docs/api.md#level-string) for a complete list of available log levels. |
| `BOT_SERVER_HOST` | String | `0.0.0.0` | <i>Optional.</i> Server address. |
| `BOT_SERVER_PORT` | Number | `80` | <i>Optional.</i> Server port. |
| `BOT_ALLOWED_UPDATES` | Array of String | `[]` | <i>Optional.</i> A JSON-serialized list of the update types you want your bot to receive. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. |
| `BOT_ADMIN_USER_ID` | Number or Array of Number | `[]` | <i>Optional.</i> Administrator user ID. Commands such as `/setcommands` will only be available to a user with this ID. |


## Acknowledgements
The initial template for this project was adapted from [Telegram Bot Template](https://github.com/bot-base/telegram-bot-template)

The mechanics of the game are inspired by the [One Night Ultimate Series](https://beziergames.com/products/one-night-ultimate-werewolf) by Ted Alspach and Akihisa Okui.
