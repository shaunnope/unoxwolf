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

welcome =
    👋🏻 Hi there, I am Unox! Add me to a group to moderate games of Unoxian Werewolf.
    Try me now! 🐺

    {welcome.commands}

    .commands = <strong>COMMANDS</strong>


    .prompt_start_bot =
        Hi {$user}! Before you can join a game, you need to start the bot.
    .group =
        👋🏻 Hi there, I am Unox!
        Run /startgame to start a game of Unoxian Werewolf!🐺

help =
    Trouble is brewing in the village of Unoxia. Word has spread that cryptids lurk amongst the villagers, causing much distress. The villagers must band together to root out the imposters and lynch them before it is too late.

    <strong>Gameplay</strong>
    At the start of the game, each player is secretly assigned a role and a predetermined number of roles are left unassigned (<em>default: 3</em>).

    The game progresses in phases, during which players with certain roles may perform actions. Some actions result in changes to the role assignment. Hence, when day breaks, players may not be who they think they are.

    Within each phase, role actions are performed in a specific order. The phases and order of actions are as follows:

    .copy = <strong>Copy Phase</strong>
    .night = <strong>Night Phase</strong>
    .passive =
        <strong>Passive Roles</strong>
        The following roles do not perform actions that need to be resolved in a specific order.


join = Join
    .prompt = Click here to join the game!
    .success = You joined the game in { $chat }!
    .already_in_game = You have already joined the game in { $chat }!
    .in_another_game = You are already in another game in { $chat }!
    .not_found = Could not find the game to join
    .failure = You cannot join the game now!
    .count = <strong>Number of players:</strong> {$count}
    .recent_list = { $users } joined the game in the last 30 seconds.
    .flee = {$user} has left the game!

leave =
    .success = {$user} has left the game!
    .failure = You cannot leave the game now!


game_init = {$user} has started a new game!
    .minutes_left = { $time ->
        [one] {$time} minute left to join
        *[other] {$time} minutes left to join
    }
    .seconds_left = { $time ->
        [one] {$time} second left to join
        *[other] {$time} seconds left to join
    }
    .not_enough_players = Not enough players to start the game!
    .starting = Starting game...

game =
    .not_started = No game has been started yet!
    .already_started = A game has already been started!
    .end = Game over!
    .roles = <strong>Available Roles:</strong>
    .timer_skipped = <em>Skipping forward...</em>
    .seconds_left = { $time ->
        [one] {$time} second left
        *[other] {$time} seconds left
    }
    .times_up = Time's up!
    .won = 🏆
    .lost = 🫂
    .dead = 💀
    .alive = 😃

events = <strong>Order of Events:</strong>
    .vote = Vote
    .copy = Copy
    .peek = Peek
    .swap = Swap
    .off = Off
    .rotate = Shift
    .reveal = Reveal

copy =
    .start = {""}
    .end = As the sun set, rumors of identity theft spread through the village.

night =
    .start = Night falls...
    .end = The sun rises...

vote = Who do you want to vote for?
    .start = Voting has started!
    .end = Voting has ended!
    .cast = You selected {$user}
    .repeat = You have already voted!
    .tally = Tallying votes...
    .unassigned =
        <strong>Unassigned roles:</strong>
        {$roles}
    .draw = No one received more than one vote!
    .results = At the end of the vote, {$users} { $num ->
                    [one] was
                    *[other] were
                } executed!

game_error =
    .err_assign_roles = Error while assigning roles. Please start a new game.
    .invalid_option = Invalid option
    .invalid_vote = Invalid target: {$user}.
    .not_in_game = You are not in the game in {$chat}!
    .wrong_qn = This question is not for you!

misc =
    .unassigned_role = Role {$idx}
    .unassigned = Unassigned ({$count})
    .peek_role = { $user } is a { $role }
    .self_swap_roles = You swapped roles with { $user }
    .self_role_same = You are still a {$role}
    .self_role_changed = You are now a {$role}
    .self_team_changed = You are now on the {$team} team
    .unknown_user = Someone
    .no_user = No one
    .undefined = Undefined
    .pass = Pass
    .passed = You chose to do nothing.

team =
    .village = Village
    .werewolf = Werewolf
    .tanner = Tanner
    .vampire = Vampire
    .assassin = Assassin
    .alien = Alien
    .synth = Synthetic Alien
    .blob = Symbiote
    .mortician = Mortician

stats =
    <strong>No. of Groups</strong>:  { $count }

    <strong>Won : Lost</strong>
    <em>Total</em>  -  { $won } : { $lost }

    <em> {team.village}</em>  -  { $villageWin } : { $villageLose }

    <em> {team.werewolf}</em>  -  { $werewolfWin } : { $werewolfLose }

    <em> {team.tanner}</em>  -  { $tannerWin } : { $tannerLose }

role = Role
    .name = {role} {role.emoji}
    .emoji = 🎲
    .desc =
        A generic role. This role has no special abilities.
    .lore =
        You are a {role.name}
        You have no special abilities.
## BASE ROLES
villager = Villager
    .name = {villager} {villager.emoji}
    .emoji = 👱
    .desc =
        The Villager leads a simple life. Vote out the non-villagers in the morning.

        <em>Villagers are on the {team.village} team.</em>
    .lore =
        You are a {villager.name}
        Rest well tonight and don't let the werewolves bite!

werewolf = Werewolf
    .name = {werewolf} {werewolf.emoji}
    .emoji = 🐺
    .desc =
        At night, the Werewolves reveal themselves to each other.

        <strong>Lone Wolf Mode:</strong> If no other Werewolves are in play, the lone Werewolf may look at an unassigned role.

        <em>Werewolves are on the {team.werewolf} team.</em>
    .lore =
        You are a {werewolf.name}!
        Arise at night to meet your fellow lycantrophic brethren.
    .reveal = You are werewolves together with { $others }
    .lone = You are the only werewolf.
    .lone2 = { misc.peek_role }

seer = Seer
    .name = {seer} {seer.emoji}
    .emoji = 👳
    .desc =
        At night, the Seer may look at one other player's role or two of the unassigned roles.

        <em>The Seer is on the {team.village} team.</em>
    .lore =
        You are the {seer.name}
        At night, you may look at one other player's role or two of the unassigned roles.
    .action = Whose role would you like to look at?
    .reveal = { misc.peek_role }
    .reveal2 = The forces of the universe reveal the following unassigned roles:


robber = Robber
    .name = {robber} {robber.emoji}
    .emoji = 😈
    .desc =
        At night, the Robber may rob another player's role, swapping it with their own. The Robber then looks at their new role.

        <em>The Robber is on the {team.village} team.</em>
    .lore =
        You are the {robber.name}
        Tonight, you may rob another player's role, exchanging it with your own.
    .action = Whose role would you like to rob?
    .swap = You stole { $user2 }'s role. { misc.self_role_changed }

troublemaker = Troublemaker
    .name = {troublemaker} {troublemaker.emoji}
    .emoji = 🙅
    .desc =
        At night, the Troublemaker may switch the roles of two other players without looking at those roles.

        <em>The Troublemaker is on the {team.village} team.</em>
    .lore =
        You are the {troublemaker.name}
        Tonight, you may switch the roles of two other players without looking at those roles.
    .action = Whose roles would you like to switch?
    .action2 = Who would you like to switch { $user1 }'s role with?
    .swap = You swapped the roles of { $user1 } and { $user2 }.

tanner = Tanner
    .name = {tanner} {tanner.emoji}
    .emoji = 👺
    .desc =
        The Tanner wins only if they are killed.

        <em>The Tanner is on the {team.tanner} team.</em>
    .lore =
        You are the {tanner.name}
        Sick of your job, you hope that whatever chaos lurks in the village puts an end to your lowly life.

drunk = Drunk
    .name = {drunk} {drunk.emoji}
    .emoji = 🍺
    .desc =
        At night, the Drunk exchanges their role with an unassigned role without knowing what that role is.

        <em>The Drunk is on the {team.village} team.</em>
    .lore =
        You are the {drunk.name}
        Of course, you're not usually drunk. You just had a few too many drinks tonight. Hopefully you'll sober up by morning.
    .action = In your drunken stupor, you swapped your role with { $role }
    .secret = {villager.lore}

insomniac = Insomniac
    .name = {insomniac} {insomniac.emoji}
    .emoji = 😴
    .desc =
        Before the end of the night, the Insomniac wakes up and checks if their role has changed.

        <em>The Insomniac is on the {team.village} team.</em>
    .lore =
        You are the {insomniac.name}
        With news of werewolves hiding in your midst, it would be a miracle if you were able to sleep soundly tonight.
    .true = You are still the {insomniac.name}
    .false = {misc.self_role_changed}

hunter = Hunter
    .name = {hunter} {hunter.emoji}
    .emoji = 🔫
    .desc =
        If the Hunter dies, the player they vote for also dies.

        <em>The Hunter is on the {team.village} team.</em>
    .lore =
        You are the {hunter.name}
        If you are killed tonight, the player you vote for will also die.
    .off = With their dying breath, { $user1 } drew their gun and shot { $user2 }.
    .off_fail = Alas, { $user } was already dead.

mason = Mason
    .name = {mason} {mason.emoji}
    .emoji = 👷
    .desc =
        At night, the Masons reveal themselves to each other.

        <em>The Masons are on the {team.village} team.</em>
    .lore =
        You are a {mason.name}
        At night, you will meet up with your fellow masons.
    .lone = You are the only mason.
    .reveal = You are masons together with { $others }.

minion = Minion
    .name = {minion} {minion.emoji}
    .emoji = 👹
    .desc =
        At night, the Minion learns who the Werewolves are.

        <em>The Minion is on the {team.werewolf} team. If there are no active Werewolves, the Minion wins if they survive.</em>
    .lore =
        You are the {minion.name}
        At night, you may meet your revered werewolves.
    .reveal = { $others } { $num ->
                    [one] is a werewolf
                    *[other] are werewolves
                }!
    .lone = There are no werewolves tonight.

doppelganger = Doppelgänger
    .name = {doppelganger} {doppelganger.emoji}
    .emoji = 🎭
    .desc =
        At dusk, the Doppelgänger assumes another player's role. Any actions that the Doppelgänger performs will be performed after the target's actions.

        <em>The Doppelgänger is on the team of the role they assume.</em>
    .lore =
        You are the {doppelganger.name}
        At dusk, you will assume another player's role.
    .action = Whose role would you like to copy?

## DAYBREAK ROLES
apprentice_seer = Apprentice Seer
    .name = {apprentice_seer} {apprentice_seer.emoji}
    .emoji = 🙇
    .desc =
        At night, the Apprentice Seer may look at one of the unassigned roles.

        <em>The Apprentice Seer is on the {team.village} team.</em>
    .lore =
        You are the {apprentice_seer.name}
        While the powers of the {seer} vastly surpasses yours, you know a thing or two about divination.
        At night, you may use your abilities to look at one of the unassigned roles.
    .action = {seer.action}
    .reveal = A { $role } is unassigned tonight
    .reveal_seer = { $user } is the {seer.name}

## TODO: reconsider how to add extra behaviour to the fool
fool = Fool
    .name = {fool} {fool.emoji}
    .emoji = 🃏
    .desc =
        The Fool is delulu. While they may believe that they share powers with the {seer}, their foresight is random at best.

        <em>The Fool is on the {team.village} team.</em>
    .extra =
        Also, if they choose to view a role, they will end up messing up everyone's roles instead.

        If they attempt to view a player role, all movable player roles but their own will be shifted one position to the left.
        If they attempt to view an unassigned role, all movable player roles but their own will be shifted one position to the right.
    .lore = {seer.lore}
    .action = {seer.action}
    .reveal = {seer.reveal}
