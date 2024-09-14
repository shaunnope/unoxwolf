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
    .lone2 = One of the unassigned roles is a { $role }

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
        Of course, you're not usually drunk. You just had a few too many drinks tonight.
        At night, you will stumble upon your actual role among the unassigned roles.
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

        <em>The Minion is on the {team.werewolf} team. If there are no Werewolves in play, the Minion wins if they are not killed.</em>
    .lore =
        You are the {minion.name}
        At night, you may meet your revered werewolves.
    .reveal = The werewolves are { $others }.
    .lone = There are no werewolves tonight. If none show up in the morning, survive the vote and you will win.

doppelganger = Doppelgänger
    .name = {doppelganger} {doppelganger.emoji}
    .emoji = 🎭
    .desc =
        At dusk, the Doppelgänger assumes another player's role. Any actions that the Doppelgänger performs will occur after the original player's actions.

        <em>The Doppelgänger is on the team of the role they copy.</em>
    .lore =
        You are the {doppelganger.name}
        At dusk, you will assume another player's role.
    .action = Whose role would you like to copy?

## DAYBREAK ROLES
sentinel = Sentinel
    .name = {sentinel} {sentinel.emoji}
    .emoji = 🚨
    .desc =
        At night, the Sentinel may choose to protect another player's role from being robbed, switched, or looked at by other players.

        <em>The Sentinel is on the {team.village} team.</em>
    .lore =
        You are the {sentinel.name}
        Tonight, you may protect another player's role from being robbed, switched, or looked at by other players.
    .action = Who would you like to protect?
    .poke = As you drift off to sleep, you feel a sense of security, knowing that you will be safe from harm tonight.
    .reveal = { $user } was protected by the {sentinel.name}.

apprentice_seer = Apprentice Seer
    .name = {apprentice_seer} {apprentice_seer.emoji}
    .emoji = 🙇
    .desc =
        At night, the Apprentice Seer may look at one of the unassigned roles.

        <em>The Apprentice Seer is on the {team.village} team.</em>
    .lore =
        You are the {apprentice_seer.name}
        While the powers of the {seer.name} vastly surpasses yours, you know a thing or two about divination.
        At night, you may use your abilities to look at one of the unassigned roles.
    .action = {seer.action}
    .reveal = A { $role } is unassigned tonight
    .reveal_seer = { $user } is the {seer.name}

wildchild = Wild Child
    .name = {wildchild} {wildchild.emoji}
    .emoji = 👶
    .desc =
        At night, the Wild Child may view the roles of two other players, one at a time. If they view a role that is not on the {team.village} team, they must stop looking and join the team of the role they viewed.

        <em>The Wild Child is on the {team.village} team, unless they view a role that is not on the {team.village} team, then they join that team.</em>
    .lore =
        You are the {wildchild.name}
        Morbidly curious, yet highly impressionable, you yearn to learn the about your fellow villagers, even if it means risking your humanity.
        Tonight, you may spy on two other players, one at a time, and learn their roles.
    .action = Who would you like to spy on?
    .reveal = {misc.peek_role}
    .reveal2 = {misc.peek_role}! { misc.self_team_changed }

revealer = Revealer
    .name = {revealer} {revealer.emoji}
    .emoji = 📖
    .desc =
        At the end of the night, the Revealer may choose to reveal the role of one player. If the revealed role is not on the {team.village} team, the role is not revealed.

        <em>The Revealer is on the {team.village} team.</em>
    .lore =
        You are the {revealer.name}
        At the end of the night, you may choose to reveal the role of one player. If the player you choose is not on the {team.village} team, their role is not revealed.
    .action = Whose role would you like to reveal?
    .reveal = {misc.peek_role}
    .fail = You cautiously back away. {misc.peek_role}! Their role will not be revealed in the morning.

curator = Curator
    .name = {curator} {curator.emoji}
    .emoji = 📜
    .desc =
        A collector of ancient wares, the Curator may give any player an unrevealed artifact. They may not give an artifact to a protected player.

        <em>The Curator is on the {team.village} team.</em>
    .lore =
        You are the {curator.name}
        A collector of ancient wares, you may give any player an unrevealed artifact at the end of the night. You may not give an artifact to a protected player.
    .action = Who would you like to give an artifact to?
    .result = You gave { $user } an artifact.
    .poke = As the sun peeks through your window, you glimpse a mysterious figure leaving your house. Looking around, you notice a small artifact on your bedside table. It is a { $artifact }. { misc.self_role_changed }

witch = Witch
    .name = {witch} {witch.emoji}
    .emoji = 🧙
    .desc =
        At night, the Witch may look at one of the unassigned roles. If they do, they must exchange that role with any player's role, including their own. They may not look at the role they are exchanging.

        <em>The Witch is on the {team.village} team.</em>
    .lore =
        You are the {witch.name}
        As a skillful cartomancer, you harness the energy to transform the fates of others. Tonight, you may perform a card reading on a player, including yourself, to learn one of the unassigned roles, changing their role in the process.
    .action = Who would you like to perform a reading on?
    .reveal = { misc.peek_role }

## TODO: reconsider how to add extra behaviour to the fool
fool = Fool
    .name = {fool} {fool.emoji}
    .emoji = 🃏
    .desc =
        The Fool is delulu. While they may believe that they share powers with the {seer.name}, their foresight is random at best.

        <em>The Fool is on the {team.village} team.</em>
    .extra =
        Also, if they choose to view a role, they will end up messing up everyone's roles instead.

        If they attempt to view a player role, all movable player roles but their own will be shifted one position to the left.
        If they attempt to view an unassigned role, all movable player roles but their own will be shifted one position to the right.
    .lore = {seer.lore}
    .action = {seer.action}
    .reveal = {seer.reveal}

bodyguard = Bodyguard
    .name = {bodyguard} {bodyguard.emoji}
    .emoji = 🛡
    .desc =
        The player the Bodyguard votes for cannot be killed. If that player received the most votes, the player with the next most votes is killed.

        <em> The Bodyguard is on the {team.village} team.</em>
    .lore =
        You are the {bodyguard.name}
        Tomorrow, you will protect the player you vote for. If that player received the most votes, the player with the next most votes is killed instead.

alpha_wolf = Alpha Wolf
    .name = {alpha_wolf} {alpha_wolf.emoji}
    .emoji = ⚡️🐺
    .desc =
        After waking up with the other werewolves, the Alpha Wolf will convert a non-werewolf into a werewolf, without learning the player's original role.

        <em> The Alpha Wolf is on the {team.werewolf} team.</em>
    .lore =
        You are the {alpha_wolf.name}
        Tonight, you may convert a non-werewolf into a werewolf.
    .action = Who would you like to convert?
    .result = { $user } was turned into a werewolf!

mystic_wolf = Mystic Wolf
    .name = {mystic_wolf} {mystic_wolf.emoji}
    .emoji = 🔮🐺
    .desc =
        After waking up with the other werewolves, the Mystic Wolf may learn the role of one other player.

        <em> The Mystic Wolf is on the {team.werewolf} team.</em>
    .lore =
        You are the {mystic_wolf.name}
        Tonight, you may learn the role of one non-werewolf player.
    .action = {seer.action}
    .result = {seer.result}

dream_wolf = Dream Wolf
    .name = {dream_wolf} {dream_wolf.emoji}
    .emoji = 💤🐺
    .desc =
        The Dream Wolf does not wake up at night, but their presence is still revealed to the Werewolves and Minions.

        <em> The Dream Wolf is on the {team.werewolf} team.</em>
    .lore =
        You are the {dream_wolf.name}
        Inflicted with a rare variant of narcolepsy, you have never been able to stay awake at night. At least the other members of your pack know who you are.

## VAMPIRE ROLES
copycat = Copycat
    .name = {copycat} {copycat.emoji}
    .emoji = 🐱
    .desc =
        At dusk, the Copycat assumes the role of one of the unassigned roles.

        <em> The Copycat is on the team of the role they assume.</em>
    .lore = You are the {copycat.name}, but not for long!
    .result = Rummaging through the unassigned roles, you pick out { $card }. { misc.self_role_changed }

vampire = Vampire
    .name = {vampire} {vampire.emoji}
    .emoji = 🧛
    .desc =
        At dusk, all Vampires reveal themselves to each other and convert one other player into a Vampire.

        <em> Vampires are on the {team.vampire} team.</em>
    .lore =
        You are a {vampire.name}!
        Arise at dusk to meet your fellow bloodsucking compadres and convert one other player into a vampire.
    .reveal = Your fellow vampires are { $vampires }.
    .none = There are no other vampires tonight.
    .action = {role_message.alpha_wolf_action}
    .result = After much deliberation, { $user } was turned into a vampire!

vampire_master = Master
    .name = {vampire_master} {vampire_master.emoji}
    .emoji = 👑🧛
    .desc =
        The Master wakes up with the other Vampires. If a player on the {team.vampire} team votes for the Master, the Master is protected and the player with the next most votes is killed instead.

        <em> The Vampire Master is on the {team.vampire} team.</em>
    .lore =
        You are the {vampire_master.name}
        If a player on the {team.vampire} team votes for you, you are protected and the player with the next most votes is killed instead.

vampire_count = Count
    .name = {vampire_count} {vampire_count.emoji}
    .emoji = 😱🧛🏻‍♂️
    .desc =
        The Count wakes up with the other Vampires. Subsequently, they will instill fear in a non-Vampire player, preventing them from performing their night action.

        <em> The Count is on the {team.vampire} team.</em>
    .lore =
        You are the {vampire_count.name}
        After convening with the other Vampires, you will instill fear in a non-Vampire player, preventing them from performing their night action.
    .action = Who would you like to instill fear in?
    .result = { $user } will be too afraid to perform their night action.
    .poke = You feel a sense of dread as you drift off to sleep. Striken with fear, you will not be leaving the safety of your covers tonight.

renfield = Renfield
    .name = {renfield} {renfield.emoji}
    .emoji = 🦇
    .desc =
        Renfield wakes up after the Vampires and learns who they are. Subsequently, they will turn into a bat.

        <em> Renfield is on the {team.vampire} team, but is not a Vampire. If there are no Vampires in play, Renfield is on the {team.village} team.</em>
    .lore =
        You are the {renfield.name}
        At dusk, you will learn who the vampires are. Subsequently, you will turn into a bat.
    .reveal = The vampires are { $vampires }.
    .none = There are no vampires tonight.
    .bat = You turn into a bat and fly away into the night.

cupid = Cupid
    .name = {cupid} {cupid.emoji}
    .emoji = 💘
    .desc =
        At dusk, Cupid may choose two players to fall in love. If one of those players dies, the other dies of a broken heart.

        <em> Cupid is on the {team.village} team.</em>
    .lore =
        You are the {cupid.name}
        At dusk, you may choose two players to fall in love. If one of those players dies, the other dies of a broken heart.
    .action = Who would you like to make fall in love?
    .action2 = Who would you like { $user1 } to fall in love with?
    .result = { $user1 } and { $user2 } are now in love.

lovers =
    .emoji = 💕
    .reveal = As you drift into sleep, you are engulfed by a warm, fuzzy feeling. You are deeply in love with { $lover } and are not sure how you would cope if they were to die.
    .die = You feel a sharp pain in your chest. { $lover } is dead! You die of a broken heart.

diseased = Diseased
    .name = {diseased} {diseased.emoji}
    .emoji = 🤢
    .desc =
        At dusk, the Diseased spreads their affliction to one player beside them. Any player who votes for the Diseased or the Diseased's victim cannot win.

        <em> The Diseased is on the {team.village} team.</em>
    .lore =
        You are the {diseased.name}
        At dusk, you may spread your affliction to one player beside you. Any player who votes for you or your victim cannot win.
    .action = Who would you like to infect?
    .result = { $user } is now diseased.

instigator = Instigator
    .name = {instigator} {instigator.emoji}
    .emoji = 🤹
    .desc =
        At night, the Instigator may brand any player as a traitor. The traitor only wins if someone else on their team is killed, unless they are the only player on their team.

        <em> The Instigator is on the {team.village} team.</em>
    .lore =
        You are the {instigator.name}
        At dusk, you may brand any player as a traitor. The traitor only wins if someone else on their team is killed, unless they are the only player on their team.
    .action = Who would you like to brand as a traitor?
    .result = { $user } is now a traitor.
    .poke = You feel a sense of hatred as you drift off to sleep. You traitor! You will only win if someone else on your team is killed.

priest = Priest
    .name = {priest} {priest.emoji}
    .emoji = 🙏
    .desc =
        At night, the Priest clears himself of all inflictions, and may choose to do the same for one other player.

        <em> The Priest is on the {team.village} team.</em>
    .lore =
        You are the {priest.name}
        At dusk, you will annoint yourself and up to one other player, clearing yourselves from any afflictions.
    .action = Who would you like to annoint?
    .result = { $user } has been relieved of their afflictions.

assassin = Assassin
    .name = {assassin} {assassin.emoji}
    .emoji = 🥷
    .desc =
        At dusk, the Assassin selects a player as their target. The Assassin only wins if their target is killed.

        <em> The Assassin is on the {team.assassin} team.</em>
    .lore =
        You are the {assassin.name}
        At dusk, you may select a player as your target. You only win if your target is killed.
    .action = Who would you like to make your target?
    .result = { $user } is now your target.
    .reveal = { $user } is the {roles.apprentice_assassin}. Watch out, as they will be vying for your death!

apprentice_assassin = Apprentice Assassin
    .name = {apprentice_assassin} {apprentice_assassin.emoji}
    .emoji = 🔪
    .desc =
        The Apprentice Assassin learns the identity of the Assassin at the start of the game, and only wins if the Assassin is killed. If there is no Assassin, the Apprentice Assassin selects a player as their target, and can only win if both they and their target are killed.

        <em> The Apprentice Assassin is on the {team.assassin} team.</em>
    .lore =
        You are the {apprentice_assassin.name}
    .reveal = { $user } is the {assassin.name}. Fueled by vengeance, you only win if they are killed!
    .none =
        You don't see the {assassin.name} tonight. Was your drive for revenge all for naught? If there is no {assassin.name} by the end of the night, you will only win if you are killed.

        Unphased, you redirect your anger towards another player.

marksman = Marksman
    .name = {marksman} {marksman.emoji}
    .emoji = 🏹
    .desc =
        At night, the Marksman learns the role of one player, and the mark of another.

        <em> The Marksman is on the {team.village} team.</em>
    .lore =
        You are the {marksman.name}
        Being a sharp shooter with an inquisitive eye, at night, you may learn the role of one player, and the affliction of another.
    .action = Whose role would you like to look at?
    .action2 = Whose mark would you like to look at?
    .reveal = {misc.peek_role}
    .reveal2 = { $user } is marked with a { $mark }.

pickpocket = Pickpocket
    .name = {pickpocket} {pickpocket.emoji}
    .emoji = 👤
    .desc =
        At night, the Pickpocket may swap their mark with the mark of another player and view their new mark.

        <em> The Pickpocket is on the {team.village} team.</em>
    .lore =
        You are the {pickpocket.name}
        Tonight, you may swap your mark with the mark of another player and view your new mark.
    .action = Whose mark would you like to swap with?
    .result = You swapped marks with { $user } and are now marked with a { $mark }.

gremlin = Gremlin
    .name = {gremlin} {gremlin.emoji}
    .emoji = 👹
    .desc =
        At night, the Gremlin may swap the marks or roles of two players, but not both. They may not look at the marks or roles they are swapping.

        <em> The Gremlin is on the {team.village} team.</em>
    .lore =
        You are the {gremlin.name}
        A mischievous trickster, you love to play pranks on your fellow villagers.
        Tonight, you may swap the marks or roles of two players, but not both. You may not look at the marks or roles you are swapping.
    .action = Will you swap marks or roles?
    .action2 = Which player's { $status } would you like to swap?
    .action3 = Who do you want to swap { $user1 }'s { $status } with?
    .gremlin_result = You swapped the { $status }s of { $user1 } and { $user2 }.

## ALIEN ROLES
alien = Alien
    .name = {alien} {alien.emoji}
    .emoji = 👽
    .desc =
        At night, the Aliens reveal themselves to each other and performs a randomised action.

        <em> Aliens are on the {team.alien} team.</em>
    .lore =
        You are an {alien.name}!
        Arise at night to meet your fellow extraterrestrial brethren and cause havoc to the space-time continuum.
    .reveal = Your fellow aliens are { $aliens }.
    .none = There are no other aliens tonight.

synthetic_alien = Synthetic Alien
    .name = {synthetic_alien} {synthetic_alien.emoji}
    .emoji = 🤖
    .desc =
        The Synthetic Alien wakes up with the other Aliens but only wins if they die.

        <em> The Synthetic Alien is on the {team.synth} team.</em>
    .lore =
        You are the {synthetic_alien.name}
        Burdened by extreme self-awareness, you know that it is best for you to die. You only win if you are killed.

cow = Cow
    .name = {cow} {cow.emoji}
    .emoji = 🐮
    .desc =
        If the Cow is next to an Alien, they are tipped over.

        <em> The Cow is on the {team.village} team.</em>
    .lore =
        You are a {cow.name}
        Mooooo.
    .poke = Slump! You were tipped over in your sleep. An alien must be nearby.

alien_pair =
    .desc =
        Groob and Zerb wake up with the aliens, then subsequently identify each other. If both Groob and Zerb are in play, they only win if the other is killed, while they survive. All other aliens lose if either Groob or Zerb is killed.

groob = Groob
    .name = {groob} {groob.emoji}
    .emoji = ☀️👽
    .desc =
        {alien_pair.desc}

        <em> Groob is on the {team.alien} team, unless Zerb is in play, in which case they are on their own teams.</em>
    .lore =
        You are {groob.name}
        At night, you will wake up with the aliens and subsequently identify Zerb. If Zerb is present, you will only win if they are killed, while you survive.
    .reveal = { $user } is {zerb.name}! They must die for you to win.

zerb = Zerb
    .name = {zerb} {zerb.emoji}
    .emoji = 🌙👽
    .desc =
        {alien_pair.desc}

        <em> Zerb is on the {team.alien} team, unless Groob is in play, in which case they are on their own teams.</em>
    .lore =
        You are {zerb.name}
        At night, you will wake up with the aliens and subsequently identify Groob. If Groob is present, you will only win if they are killed, while you survive.
    .reveal = { $user } is {groob.name}! They must die for you to win.

leader = Leader
    .name = {leader} {leader.emoji}
    .emoji = ⚜️
    .desc =
        At night, the Leader learns the identities of the Aliens, and whether both Groob and Zerb are in play. If Groob and Zerb are not both in play, the Leader wins with the {team.village} team. Otherwise, the Leader only wins if both Groob and Zerb survive. If all Aliens vote for the Leader, the village team loses.

        <em> The Leader is on the {team.village} team, unless both Groob and Zerb are in play, in which case they only win if both Groob and Zerb survive.</em>
    .lore =
        You are the {leader.name}
        At night, you will learn the identities of the Aliens, and whether both Groob and Zerb are in play. If Groob and Zerb are not both in play, you win with the {team.village} team. Otherwise, you only win if both Groob and Zerb survive. If all Aliens vote for you, the {team.village} team loses.
    .reveal = The aliens are { $aliens }.
    .reveal2 = { $groob } is {roles.groob} and { $zerb } is {roles.zerb}! Ensure that both survive to win.

psychic = Psychic
    .name = {psychic} {psychic.emoji}
    .emoji = 🧠
    .desc =
        At night, the Psychic learns the roles of one or more players. The roles which may be learned are random.

        <em> The Psychic is on the {team.village} team.</em>
    .lore =
        You are the {psychic.name}
        At night, you may learn the roles of one or more players. The roles which may be learned are random.
    .reveal = {misc.peek_role}

rascal = Rascal
    .name = {rascal} {rascal.emoji}
    .emoji = 🤡
    .desc =
        At night, the Rascal may swap two or more players' roles. The roles which may be swapped are random.

        <em> The Rascal is on the {team.village} team.</em>
    .lore =
        You are the {rascal.name}
        At night, you may swap two or more players' roles. The roles which may be swapped are random.
    .action = Who would you like to swap roles with?
    .result = You swapped roles with { $user }.

exposer = Exposer
    .name = {exposer} {exposer.emoji}
    .emoji = 📸
    .desc =
        Before the end of the night, the Exposer may reveal some or all of the unassigned roles. The number of roles which may be revealed is random.

        <em> The Exposer is on the {team.village} team.</em>
    .lore =
        You are the {exposer.name}
        Before the end of the night, you may reveal some or all of the unassigned roles. The number of roles which may be revealed is random.

blob = Symbiote
    .name = {blob} {blob.emoji}
    .emoji = 🦠
    .desc =
        The Symbiote grows in the night, subsuming the players next to them. The number of players that join the Symbiote is random. The Symbiote only wins if all players that are part of the Symbiote survive.

        <em> The Symbiote is on the {team.blob} team.</em>
    .lore =
        You are the {blob.name}
        Tonight, you will grow, subsuming the players next to you. The number of players that join you is random. You only win if all players that are part of the blob survive.
    .poke = You are now part of the blob.

mortician = Mortician
    .name = {mortician} {mortician.emoji}
    .emoji = ⚰️
    .desc =
        At night, the Mortician may learn the roles of the players next to them. The number of roles which may be learned is random. The Mortician only wins if at least one player next to them dies.

        <em> The Mortician is on the {team.mortician} team.</em>
    .lore =
        You are the {mortician.name}
        At night, you may learn the roles of the players next to you. The number of roles which may be learned is random. You only win if at least one player next to you dies.
    .reveal = {misc.peek_role}

## BONUS ROLES
aura_seer = Aura Seer
    .name = {aura_seer} {aura_seer.emoji}
    .emoji = ✨
    .desc =
        At night, the Aura Seer learns all the players who viewed or shifted a role at night.

        <em> The Aura Seer is on the {team.village} team.</em>
    .lore =
        You are the {aura_seer.name}
        Tonight, you will learn all the players who viewed or shifted a role at night.
    .reveal = { $users } viewed or shifted a role at night.

cursed = Cursed
    .name = {cursed} {cursed.emoji}
    .emoji = ⛓
    .desc =
        The Cursed is on the {team.village} team, unless a Werewolf or Vampire votes for them, in which case they join the {team.werewolf} or {team.vampire} team.
    .lore =
        You are the {cursed.name}
        A harbinger of misfortune, if a non-villager votes for you, you will join their team.

prince = Prince
    .name = {prince} {prince.emoji}
    .emoji = 👑
    .desc =
        The Prince cannot be voted for execution. If the Prince received the most votes, the player with the next most votes is killed instead.

        <em> The Prince is on the {team.village} team.</em>
    .lore =
        You are the {prince.name}
        Your royal blood grants you immunity from execution. If you receive the most votes, the player with the next most votes is killed instead.

apprentice_tanner = Apprentice Tanner
    .name = {apprentice_tanner} {apprentice_tanner.emoji}
    .emoji = ⚒👺
    .desc =
        The Apprentice Tanner learns the identity of the Tanner at the start of the game and only wins if the Tanner dies. If there is no Tanner, the Apprentice Tanner only wins if they are killed.

        <em> The Apprentice Tanner is on the {team.tanner} team.</em>
    .lore =
        You are the {apprentice_tanner.name}
    .reveal = { $user } is the {tanner.name}. You only win if they die!
    .none = You don't see the {tanner.name} tonight. If they do not show up in the morning, you would rather die!

beholder = Beholder
    .name = {beholder} {beholder.emoji}
    .emoji = 👁
    .desc =
        The Beholder learns who the {seer.name} and {apprentice_seer.name} are at the start of the game and checks their roles at the end of the night.

        <em> The Beholder is on the {team.village} team.</em>
    .lore =
        You are the {beholder.name}
        At the end of the night, you will check the roles of the Seer and Apprentice Seer.
    .reveal = {misc.peek_role}
    .assert_true = {$user} is still {$role}
    .assert_false = {$user} is now {$role}

squire = Squire
    .name = {squire} {squire.emoji}
    .emoji = ✍️
    .desc =
        The Squire learns who the Werewolves are at the start of the game and checks their roles at the end of the night.

        <em> The Squire is on the {team.werewolf} team.</em>
    .lore =
        You are the {squire.name}
        At the end of the night, you will check the roles of the Werewolves.
    .reveal = {misc.peek_role}
    .assert_true = {$user} is still {$role}
    .assert_false = {$user} is now {$role}

thing = Thing
    .name = {thing} {thing.emoji}
    .emoji = 🐾
    .desc =
        At night, the Thing may tap the player to their right or left.

        <em> The Thing is on the {team.village} team.</em>
    .lore =
        You are the {thing.name}
        At night, you may tap the player to your right or left.
    .action = Who would you like to tap?
    .result = You tapped { $user } in their slumber.
    .poke = You feel something cold brush your shoulder. The {thing.name} is next to you!

nostradamus = Nostradamus
    .name = {nostradamus} {nostradamus.emoji}
    .emoji = 🔭
    .desc =
        At night, Nostradamus may look at the roles of up to three players, and joins the team of the last player they look at. The team they join is revealed to all players.
        Nostradamus wins if they stay alive and their last viewed team wins. The death of Nostradamus does not cause their team to lose.

        <em> Nostradamus is on the team of the last player they look at.</em>
    .lore =
        You are {nostradamus.name}
        At night, you may look at the roles of up to three players, and join the team of the last player you look at. The team you join will be revealed to all players.
    .action = Whose role would you like to look at?
    .result = {misc.peek_role}
    .result2 = { misc.self_team_changed }
    .announce = {nostradamus.name} has joined the { $team } team.

body_snatcher = Body Snatcher
    .name = {body_snatcher} {body_snatcher.emoji}
    .emoji = 👤
    .desc =
        At night, the Body Snatcher exchanges their role with a non-Alien player and learns their new role. The snatched role is now an Alien.

        <em> The Body Snatcher is on the {team.alien} team.</em>
    .lore =
        You are the {body_snatcher.name}
        At night, you may exchange your role with a non-alien player and learn their new role. The snatched role is now an alien.
    .action = Whose body would you like to snatch?
    .result = You snatched { $user }'s body. They were a { $role }.

empath = Empath
    .name = {empath} {empath.emoji}
    .emoji = 🧠
    .desc =
        The Empath watches the actions of random players at night.

        <em> The Empath is on the {team.village} team.</em>
    .lore =
        You are the {empath.name}
        At night, you may watch the actions of random players.

roles =
    .page_daybreak = 11
        /roleSentinel - {sentinel.name}
        /roleAppS - {apprentice_seer.name}
        /rolePI - {wildchild.name}
        /roleRevealer - {revealer.name}
        /roleCurator - {curator.name}
        /roleWitch - {witch.name}
        /roleFool - {fool.name}
        /roleBG - {bodyguard.name}
        /roleAW - {alpha_wolf.name}
        /roleMW - {mystic_wolf.name}
        /roleDW - {dream_wolf.name}

    .page_vampire = 14
        /roleCopycat - {copycat.name}
        /roleVampire - {vampire.name}
        /roleMaster - {vampire_master.name}
        /roleCount - {vampire_count.name}
        /roleRenfield - {renfield.name}
        /roleCupid - {cupid.name}
        /roleDiseased - {diseased.name}
        /roleInstigator - {instigator.name}
        /rolePriest - {priest.name}
        /roleAssassin - {assassin.name}
        /roleAppA - {apprentice_assassin.name}
        /roleMarksman - {marksman.name}
        /rolePickpocket - {pickpocket.name}
        /roleGremlin - {gremlin.name}

    .page_aliens = 11
        /roleAlien - {alien}
        /roleSynthA - {synthetic_alien}
        /roleCow - {cow}
        /roleGroob - {groob}
        /roleZerb - {zerb}
        /roleLeader - {leader}
        /rolePsychic - {psychic}
        /roleRascal - {rascal}
        /roleExposer - {exposer}
        /roleBlob - {blob}
        /roleMortician - {mortician}

    .page_bonus = 10
        /roleAuraS - {aura_seer}
        /roleCursed - {cursed}
        /rolePrince - {prince}
        /roleAppT - {apprentice_tanner}
        /roleBeholder - {beholder}
        /roleSquire - {squire}
        /roleThing - {thing}
        /roleNostradamus - {nostradamus}
        /roleBodyS - {body_snatcher}
        /roleEmpath - {empath}
