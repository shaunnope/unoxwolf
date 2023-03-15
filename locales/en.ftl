start_command =
    .description = Start the bot
language_command =
    .description = Change language
admin_command =
    .description = Make user an administrator
stats_command =
    .description = Stats
setcommands_command =
    .description = Set bot commands

welcome = 👋🏻 Hi there! I am Horace, here to provide you with personalised scheduling and reminders via Telegram. Tap on /help to learn more about my various features.

    Try me now!
language =
    .select = Please, select your language
    .changed = Language successfully changed!
admin =
    .user-not-found = User not found

    .select-user = Please, select a user to change role
    .select-user-btn = Select user
    .your-role-changed = You're {$role ->
        *[USER] a regular user
        [ADMIN] an administrator
    } now.
    .user-role-changed = User with ID {$id} is now {$role ->
        *[USER] a regular user
        [ADMIN] an administrator
    }.

    .commands-updated = Commands updated.

gmgm =
    .no-set-name = No sticker set name

unhandled = Unrecognized command. Try /start
