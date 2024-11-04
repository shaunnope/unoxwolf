unhandled = Try /start
    .command = Unrecognized command. {unhandled}
    .text = Unrecognized input. {unhandled}

commands =
    .unknown = Unknown command
    .start = Start the bot
    .language = Change language
    .admin = Make user an administrator
    .stats = Get game stats
    .setcommands = Set bot commands
    .help = Show help
    .startgame = Start a game
    .join = Join a game
    .leave = Leave a game
    .rolelist = List all available roles
    .phases = List game phases and role order
    .players = List all players
    .ping = Check bot reply time
    .forcenext = Force start next phase

language =
    .select = Select your language
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

ping_command =
    .ping = <strong>Time to receive ping:</strong> {$ts} ms
    .pong = <strong>Time to send pong:</strong> {$ts} ms
