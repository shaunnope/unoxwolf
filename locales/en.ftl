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

unhandled = Unrecognized update. Try /start

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

commands =
    .unknown = Unknown command
    .start = Start the bot
    .language = Change language
    .admin = Make user an administrator
    .stats = Stats
    .setcommands = Set bot commands
    .help = Help
    .startgame = Start a game
    .join = Join a game
    .flee = Leave a game
    .rolelist = List all available roles
    .players = List all players
    .ping = Check bot reply time
    .setlang = Set language

ping_command =
    .ping = <strong>Time to receive ping:</strong> {$ts} ms
    .pong = <strong>Time to send pong:</strong> {$ts} ms

welcome =
    👋🏻 Hi there, I am Unox! Add me to a group to moderate games of Unoxian Werewolf.
    Try me now! 🐺

    {welcome.help}

    .help =
        <strong>{"COMMANDS"}</strong>
        /rolelist - List all available roles
        /help - Show help

    .prompt_start_bot =
        Hi {$user}! Before you can join a game, you need to start the bot.

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

    .join = {join}
    .join_prompt = {join.prompt}
    .join_success = {join.success}
    .already_in_game = {join.already_in_game}
    .in_another_game = {join.in_another_game}

    .player_count = {join.count}
    .joined_game = {join.recent_list}
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

copy =
    .start = {""}
    .end = As the sun sets, rumors of identity theft spread through the village.

night =
    .start = Night falls...
    .end = The sun rises...

vote = Who do you want to vote for?
    .start = Voting has started!
    .end = Voting has ended!
    .cast = You voted for {$user}
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

game =
    .not_started = No game has been started yet!
    .already_started = A game has already been started!
    .no_join = {join.failure}
    .no_leave = {leave.failure}
    .player_flee = {leave.success}
    .end = Game ended!
    .timer_skipped = <em>Skipping forward...</em>
    .times_up = Time's up!

    .copy_end = {copy.end}

    .night_start = {night.start}
    .night_end = {night.end}

    .voting_started = {vote.start}
    .voting_qn = {vote}
    .already_voted = {vote.repeat}
    .vote_cast = {vote.cast}
    .voting_end = {vote.end}
    .voting_tally = {vote.tally}
    .voting_unassigned = {vote.unassigned}
    .vote_draw = {vote.draw}
    .vote_results = {vote.results}


game_error =
    .err_assign_roles = Error while assigning roles. Please start a new game.
    .invalid_option = Invalid option
    .invalid_vote = Invalid target: {$user}.
    .not_in_game = You are not in the game in {$chat}!
    .wrong_qn = This question is not for you!

misc =
    .unassigned_role = Role {$idx}
    .unassigned = Unassigned roles ({$count})
    .peek_role = { $user } is a { $role }
    .self_swap_roles = You swapped roles with { $user }
    .self_role_same = You are still a {$role}
    .self_role_changed = You are now a {$role}
    .self_team_changed = You are now on the {$team} team
    .unknown_user = Someone

team =
    .village = Village
    .werewolf = Werewolf
    .tanner = Tanner
    .vampire = Vampire
    .assassin = Assassin
    .alien = Alien
    .synth = Synthetic Alien
    .blob = Blob
    .mortician = Mortician

role = Role
    .name = {role} {role.emoji}
    .emoji = 🎲
    .desc =
        A generic role. This role has no special abilities.
    .lore =
        You are a {role.name}
        You have no special abilities.

villager = Villager
    .name = {villager} {villager.emoji}
    .emoji = 👱
    .desc =
        The Villager leads a simple life. Vote out the non-villagers in the morning.

        <em>Villagers are on the {team.village} team.</em>
    .lore =
        You are a simple {villager.name}
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
    .reveal = Your fellow werewolves are { $wolves }.
    .lone = You are the only werewolf.
    .lone2 = One of the unassigned roles is a { $role }.

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
    .reveal2 = A { $role1 } and a { $role2 } are unassigned tonight.

robber = Robber
    .name = {robber} {robber.emoji}
    .emoji = 😈
    .desc =
        At night, the Robber may choose to rob another player's role, swapping it with their own. The Robber then looks at their new role.

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
        At night, the Troublemaker may choose to switch the roles of two other players without looking at those roles.

        <em>The Troublemaker is on the {team.village} team.</em>
    .lore =
        You are the {troublemaker.name}
        Tonight, you may switch the roles of two other players without looking at those roles.
    .action = Whose roles would you like to switch?
    .action2 = Who would you like to switch { $user1 }'s role with?
    .swap = You swapped { $user1 }'s role with { $user2 }'s role.

tanner = Tanner
    .name = {tanner} {tanner.emoji}
    .emoji = 👺
    .desc =
        The Tanner wins only if they are killed.

        <em>The Tanner is on the {team.tanner} team.</em>
    .lore =
        You are the {tanner.name}
        Sick of your job, you only win if you are killed tonight.

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
        Before the end of the night, the Insomniac wakes up and looks at their own role.

        <em>The Insomniac is on the {team.village} team.</em>
    .lore =
        You are the {insomniac.name}
        With news of werewolves hiding in your midst, it would be a miracle if you were able to sleep soundly tonight.
    .true = You are still the {roles.insomniac}
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

mason = Mason
    .name = {mason} {mason.emoji}
    .emoji = 👷
    .desc =
        At night, the Masons reveal themselves to each other.

        <em>The Masons are on the {team.village} team.</em>
    .lore =
        You are a {mason.name}
        At night, you will meet your fellow masons.
    .lone = You are the only mason.
    .reveal = You are masons together with { $masons }.

minion = Minion
    .name = {minion} {minion.emoji}
    .emoji = 👹
    .desc =
        At night, the Minion learns who the Werewolves are.

        <em>The Minion is on the {team.werewolf} team. If there are no Werewolves in play, the Minion wins if they are not killed.</em>
    .lore =
        You are the {minion.name}
        At night, you may meet your revered werewolves.
    .reveal = The werewolves are { $wolves }.
    .lone = There are no werewolves tonight. If none show up in the morning, survive the vote and you will win.

doppelganger = Doppelgänger
    .name = {doppelganger} {doppelganger.emoji}
    .emoji = 🎭
    .desc =
        At dusk, the Doppelgänger assumes another player's role.

        <em>The Doppelgänger is on the team of the role they copy.</em>
    .lore =
        You are the {doppelganger.name}
        At dusk, you will assume another player's role.
    .action = Whose role would you like to copy?

roles =
    .sentinel = Sentinel 🚨
    .apprentice_seer = Apprentice Seer 👳
    .paranormal_investigator = Paranormal Investigator 👻
    .revealer = Revealer 📖
    .curator = Curator 📜
    .witch = Witch 🧙
    .fool = Fool 🃏
    .bodyguard = Bodyguard 🛡
    .alpha_wolf = Alpha Wolf ⚡️🐺
    .mystic_wolf = Mystic Wolf 🔮🐺
    .dream_wolf = Dream Wolf 💤🐺

    .copycat = Copycat 🐱
    .vampire = Vampire 🧛
    .vampire_master = the Master 🧛
    .vampire_count = the Count 🧛
    .renfield = Renfield 🦇
    .cupid = Cupid 💘
    .diseased = Diseased 🤢
    .instigator = Instigator 🤹
    .priest = Priest 🙏
    .assassin = Assassin 🔪
    .apprentice_assassin = Apprentice Assassin 🔪
    .marksman = Marksman 🏹
    .pickpocket = Pickpocket 👤
    .gremlin = Gremlin 👹

    .oracle = Oracle 🔮
    .alien = Alien 👽
    .synthetic_alien = Synthetic Alien 🤖
    .cow = Cow 🐮
    .groob = Groob 👽
    .zerb = Zerb 👽
    .leader = Leader 👑
    .psychic = Psychic 🧠
    .rascal = Rascal 🤡
    .exposer = Exposer 📸
    .blob = Symbiote 🦠
    .mortician = Mortician ⚰️

    .aura_seer = Aura Seer 👳
    .cursed = Cursed ⛓
    .prince = Prince 👑
    .apprentice_tanner = Apprentice Tanner 👺
    .beholder = Beholder 👀
    .squire = Squire 🛡
    .thing = the Thing 👹
    .nostradamus = Nostradamus 🔮
    .empath = Empath 🧠
    .body_snatcher = Body Snatcher 👤

    .page_daybreak = 11
        /roleSentinel - {roles.sentinel}
        /roleAppS - {roles.apprentice_seer}
        /rolePI - {roles.paranormal_investigator}
        /roleRevealer - {roles.revealer}
        /roleCurator - {roles.curator}
        /roleWitch - {roles.witch}
        /roleFool - {roles.fool}
        /roleBG - {roles.bodyguard}
        /roleAW - {roles.alpha_wolf}
        /roleMW - {roles.mystic_wolf}
        /roleDW - {roles.dream_wolf}

    .page_vampire = 14
        /roleCopycat - {roles.copycat}
        /roleVampire - {roles.vampire}
        /roleMaster - {roles.vampire_master}
        /roleCount - {roles.vampire_count}
        /roleRenfield - {roles.renfield}
        /roleCupid - {roles.cupid}
        /roleDiseased - {roles.diseased}
        /roleInstigator - {roles.instigator}
        /rolePriest - {roles.priest}
        /roleAssassin - {roles.assassin}
        /roleAppA - {roles.apprentice_assassin}
        /roleMarksman - {roles.marksman}
        /rolePickpocket - {roles.pickpocket}
        /roleGremlin - {roles.gremlin}

    .page_aliens = 12
        /roleOracle - {roles.oracle}
        /roleAlien - {roles.alien}
        /roleSynthA - {roles.synthetic_alien}
        /roleCow - {roles.cow}
        /roleGroob - {roles.groob}
        /roleZerb - {roles.zerb}
        /roleLeader - {roles.leader}
        /rolePsychic - {roles.psychic}
        /roleRascal - {roles.rascal}
        /roleExposer - {roles.exposer}
        /roleBlob - {roles.blob}
        /roleMortician - {roles.mortician}

    .page_bonus = 10
        /roleAuraS - {roles.aura_seer}
        /roleCursed - {roles.cursed}
        /rolePrince - {roles.prince}
        /roleAppT - {roles.apprentice_tanner}
        /roleBeholder - {roles.beholder}
        /roleSquire - {roles.squire}
        /roleThing - {roles.thing}
        /roleNostradamus - {roles.nostradamus}
        /roleBodyS - {roles.body_snatcher}
        /roleEmpath - {roles.empath}

role_desc =
    .sentinel =
    At night, the Sentinel may choose to protect another player's role from being robbed, switched, or looked at by other players.

    <em>The Sentinel is on the {team.village} team.</em>
    .apprentice_seer =
    At night, the Apprentice Seer may look at one of the unassigned roles.

    <em>The Apprentice Seer is on the {team.village} team.</em>
    .paranormal_investigator =
    At night, the Paranormal Investigator may view the roles of two other players, one at a time. If they view a role that is not on the {team.village} team, they must stop looking and join the team of the role they viewed.

    <em>The Paranormal Investigator is on the {team.village} team, unless they view a role that is not on the {team.village} team, then they join that team.</em>
    .revealer =
    At the end of the night, the Revealer may choose to reveal the role of one player. If the revealed role is not on the {team.village} team, the role is not revealed.

    <em>The Revealer is on the {team.village} team.</em>
    .curator =
    A collector of ancient wares, the Curator may give any player an unrevealed artifact at the end of the night. They may not give an artifact to a protected player.

    <em>The Curator is on the {team.village} team.</em>
    .witch =
    At night, the Witch may look at one of the unassigned roles. If they do, they must exchange that role with any player's role, including their own. They may not look at the role they are exchanging.

    <em>The Witch is on the {team.village} team.</em>
    .fool =
    The Fool is delulu. They believe that they have the mystical abilities of the {seer.name}, but their foresight is random at best. Also, if they choose to view a role, they will end up messing up everyone's roles instead.

    If they attempt to view a player role, all movable player roles but their own will be shifted one position to the left.
    If they attempt to view an unassigned role, all movable player roles but their own will be shifted one position to the right.

    <em>The Fool is on the {team.village} team.</em>
    .bodyguard =
    The player the bodyguard votes for cannot be killed. If that player received the most votes, the player with the next most votes is killed.

    <em> The Bodyguard is on the {team.village} team.</em>
    .alpha_wolf =
    The Alpha Wolf wakes up with the other werewolves. Subsequently, they will convert a non-werewolf into a werewolf, without learning the player's original role.

    <em> The Alpha Wolf is on the {team.werewolf} team.</em>
    .mystic_wolf =
    At night, after meeting the other werewolves, the mystic wolf may learn the role of one other player.

    <em> The Mystic Wolf is on the {team.werewolf} team.</em>
    .dream_wolf =
    The Dream Wolf does not wake up with the other werewolves. Their role is still revealed to the Werewolves and Minions.

    <em> The Dream Wolf is on the {team.werewolf} team.</em>

    .copycat =
    At dusk, the Copycat assumes the role of one of the unassigned roles.

    <em> The Copycat is on the team they first view.</em>
    .vampire =
    At night, all Vampires reveal themselves to each other and convert one other player into a Vampire.

    <em> Vampires are on the {team.vampire} team.</em>
    .vampire_master =
    The Vampire Master wakes up with the other Vampires. If a player on the {team.vampire} team votes for the Master, the Master is protected and the player with the next most votes is killed instead.

    <em> The Vampire Master is on the {team.vampire} team.</em>
    .vampire_count =
    The Count wakes up with the other Vampires. Subsequently, they will instill fear in a non-Vampire player, preventing them from performing their night action.

    <em> The Count is on the {team.vampire} team.</em>
    .renfield =
    Renfield wakes up after the Vampires and learns who they are. Subsequently, they will turn into a bat.

    <em> Renfield is on the {team.vampire} team, but is not a Vampire. If there are no Vampires in play, the Renfield is on the {team.village} team.</em>
    .cupid =
    At night, Cupid may choose two players to fall in love. If one of those players dies, the other dies of a broken heart.

    <em> Cupid is on the {team.village} team.</em>
    .diseased =
    At night, the Diseased spreads their affliction to one player beside them. Any player who votes for the Diseased or the Diseased's victim cannot win.

    <em> The Diseased is on the {team.village} team.</em>
    .instigator =
    At night, the Instigator may brand any player as a traitor. The traitor only wins if someone else on their team is killed, unless they are the only player on their team.

    <em> The Instigator is on the {team.village} team.</em>
    .priest =
    At night, the Priest replaces his mark with a Mark of Clarity, and may choose to do the same for one other player.

    <em> The Priest is on the {team.village} team.</em>
    .assassin =
    At night, the Assassin selects a player as their target. The Assassin only wins if their target is killed.

    <em> The Assassin is on the {team.assassin} team.</em>
    .apprentice_assassin =
    The Apprentice Assassin learns the identity of the Assassin at the start of the game. The Apprentice Assassin only wins if the Assassin is killed. If there is no Assassin, the Apprentice Assassin selects a player as their target, and can only win if both they and their target are killed.

    <em> The Apprentice Assassin is on the {team.assassin} team.</em>
    .marksman =
    At night, the Marksman learns the role of one player, and the mark of another.

    <em> The Marksman is on the {team.village} team.</em>
    .pickpocket =
    At night, the Pickpocket may swap their mark with the mark of another player and view their new mark.

    <em> The Pickpocket is on the {team.village} team.</em>
    .gremlin =
    At night, the Gremlin may swap the marks or roles of two players, but not both. They may not look at the marks or roles they are swapping.

    <em> The Gremlin is on the {team.village} team.</em>

    .oracle =
    The Oracle answers a question at night.

    <em> The Oracle is on the {team.village} team.</em>
    .alien =
    At night, the Aliens reveal themselves to each other and performs a randomised action.

    <em> Aliens are on the {team.alien} team.</em>
    .synthetic_alien =
    The Synthetic Alien wakes up with the other Aliens. However, the Synth only wins if they die.

    <em> The Synthetic Alien is on the {team.synth} team.</em>
    .cow =
    If the cow is next to an Alien, they are tipped over.

    <em> The Cow is on the {team.village} team.</em>
    .groob =
    Groob and Zerb wake up with the aliens, then subsequently identify each other. If both Groob and Zerb are in play, they only win if the other is killed, while they survive. All other aliens lose if either Groob or Zerb is killed.

    <em> Groob is on the {team.alien} team, unless Zerb is in play, in which case they are on their own teams.</em>
    .zerb =
    Groob and Zerb wake up with the aliens, then subsequently identify each other. If both Groob and Zerb are in play, they only win if the other is killed, while they survive. All other aliens lose if either Groob or Zerb is killed.

    <em> Zerb is on the {team.alien} team, unless Groob is in play, in which case they are on their own teams.</em>
    .leader =
    At night, the Leader learns the identities of the Aliens, and whether both Groob and Zerb are in play. If Groob and Zerb are not both in play, the Leader wins with the {team.village} team. Otherwise, the Leader only wins if both Groob and Zerb survive. If all Aliens vote for the Leader, the village team loses.

    <em> The Leader is on the {team.village} team, unless both Groob and Zerb are in play, in which case they only win if both Groob and Zerb survive.</em>
    .psychic =
    At night, the Psychic learns the roles of one or more players. The roles which may be learned are random.

    <em> The Psychic is on the {team.village} team.</em>
    .rascal =
    At night, the Rascal may swap two or more players' roles. The roles which may be swapped are random.

    <em> The Rascal is on the {team.village} team.</em>
    .exposer =
    Before the end of the night, the Exposer may reveal some or all of the unassigned roles. The number of roles which may be revealed is random.

    <em> The Exposer is on the {team.village} team.</em>
    .blob =
    The Blob grows in the night, subsuming the players next to them. The number of players that join the Blob is random. The Blob only wins if all players that are part of the Blob survive.

    <em> The Blob is on the {team.blob} team.</em>
    .mortician =
    At night, the Mortician may learn the roles of the players next to them. The number of roles which may be learned is random. The Mortician only wins if at least one player next to them dies.

    <em> The Mortician is on the {team.mortician} team.</em>

    .aura_seer =
    The Aura Seer learns all the players who viewed or shifted a role at night.

    <em> The Aura Seer is on the {team.village} team.</em>
    .cursed =
    The Cursed is on the {team.village} team, unless a Werewolf or Vampire votes for them, in which case they join the {team.werewolf} or {team.vampire} team.

    .prince =
    The Prince cannot be voted for execution. If the Prince received the most votes, the player with the next most votes is killed instead.

    <em> The Prince is on the {team.village} team.</em>
    .apprentice_tanner =
    The Apprentice Tanner learns the identity of the Tanner at the start of the game. The Apprentice Tanner only wins if the Tanner dies. If there is no Tanner, the Apprentice Tanner only wins if they are killed.

    <em> The Apprentice Tanner is on the {team.tanner} team.</em>
    .beholder =
    The Beholder learns who the Seer and Apprentice Seer are at the start of the game and checks their roles at the end of the night.

    <em> The Beholder is on the {team.village} team.</em>
    .squire =
    The Squire learns who the Werewolves are at the start of the game and checks their roles at the end of the night.

    <em> The Squire is on the {team.werewolf} team.</em>
    .thing =
    At night, the Thing may tap the player to their right or left.

    <em> The Thing is on the {team.village} team.</em>
    .nostradamus =
    At night, Nostradamus may look at the roles of up to three players, and joins the team of the last player they look at. The team they join is revealed to all players.
    Nostradamus wins if they stay alive and their last viewed team wins. The death of Nostradamus does not cause their team to lose.

    <em> Nostradamus is on the team of the last player they look at.</em>
    .body_snatcher =
    At night, the Body Snatcher exchanges their role with a non-Alien player and learns their new role. The snatched role is now an Alien.

    <em> The Body Snatcher is on the {team.alien} team.</em>
    .empath =
    The Empath watches the actions of random players at night.

    <em> The Empath is on the {team.village} team.</em>


role_message =
    .sentinel = You are the {roles.sentinel}. Tonight, you may protect another player from being robbed, switched, or looked at by other players.
    .sentinel_action = Who would you like to protect?
    .sentinel_poke = As you drift off to sleep, you feel a sense of security, knowing that you will be safe from harm tonight.
    .sentinel_reveal = { $user } was protected by the Sentinel.

    .apprentice_seer = You are the {roles.apprentice_seer}. Tonight, you may look at one of the unassigned roles.
    .apprentice_seer_reveal = A { $role } is unassigned tonight.

    .paranormal_investigator = You are the {roles.paranormal_investigator}. Tonight, you may view the roles of two other players, one at a time. If you view a role that is not on the {team.village} team, you must stop looking and join the team of the role you viewed.
    .pi_action = Who would you like to visit?
    .pi_reveal_vg = {seer.reveal}
    .pi_reveal_other = {misc.peek_role} ! { misc.self_team_changed }

    .revealer = You are the {roles.revealer}. Tonight, you may reveal the role of one player. If the revealed role is not on the {team.village} team, the role is not revealed.
    .revealer_action = Whose role would you like to reveal?
    .revealer_reveal = {seer.reveal}
    .revealer_fail = You cautiously back away, hoping that { $user } did not notice you.

    .curator = You are the {roles.curator}. A collector of ancient wares, you may give any player an unrevealed artifact at the end of the night. You may not give an artifact to a protected player.
    .curator_action = Who would you like to give an artifact to?
    .curator_result = You gave { $user } an artifact.
    .curator_poke = As the sun peeks through your window, you glimpse a mysterious figure leaving your house. Looking around, you notice a small artifact on your bedside table. It is a { $artifact }. { misc.self_role_changed }

    .witch = You are the {roles.witch}. Tonight, you may look at one of the unassigned roles. If you do, you must exchange that role with any player's role, including your own. You may not look at the role you are exchanging.
    .witch_action = Would you like to look at a role?
    .witch_action2 = You see a { $role }. Who would you like to exchange this role with?

    .village_idiot = You are the {roles.village_idiot}. Tonight, you may move all roles but your own one position to the left or right.
    .village_idiot_action = Would you like to move the roles left or right?

    .bodyguard = You are the {roles.bodyguard}. Tomorrow, you will protect the player you vote for. If that player received the most votes, the player with the next most votes is killed instead.

    .alpha_wolf = You are the {roles.alpha_wolf}. Tonight, you may convert a non-werewolf into a werewolf.
    .alpha_wolf_action = Who would you like to convert?
    .alpha_wolf_result = { $user } was turned into a werewolf!

    .mystic_wolf = You are the {roles.mystic_wolf}. Tonight, you may learn the role of one non-werewolf player.
    .mystic_wolf_action = {seer.action}
    .mystic_wolf_result = {seer.result}

    .dream_wolf = You are the {roles.dream_wolf}. Inflicted with a rare variant of narcolepsy, you have never been able to stay awake at night. At least the other members of your pack know who you are.

    .copycat = You are the {roles.copycat}, but not for long! Rummaging through the unassigned roles, you find one that you like. { misc.self_role_changed }

    .vampire = You are a {roles.vampire}! Arise at dusk to meet your fellow bloodsucking compadres and convert one other player into a vampire.
    .vampire_reveal = Your fellow vampires are { $vampires }.
    .vampire_none = There are no other vampires tonight.
    .vampire_action = {role_message.alpha_wolf_action}
    .vampire_result = After much deliberation, { $user } was turned into a vampire!

    .vampire_master = You are the {roles.vampire_master}. If a player on the {team.vampire} team votes for you, you are protected and the player with the next most votes is killed instead.

    .vampire_count = You are the {roles.vampire_count}. At dusk, you may instill fear in a non-vampire player, preventing them from performing their night action.
    .vampire_count_action = Who would you like to instill fear in?
    .vampire_count_result = { $user } will be too afraid to perform their night action.
    .vampire_count_poke = You feel a sense of dread as you drift off to sleep. You will be too afraid to perform your night action tonight.

    .renfield = You are the {roles.renfield}. At dusk, you will learn who the vampires are. Subsequently, you will turn into a bat.
    .renfield_reveal = The vampires are { $vampires }.
    .renfield_none = There are no vampires tonight.
    .renfield_bat = You turn into a bat and fly away.

    .cupid = You are {roles.cupid}. As night falls, you may choose two players to fall in love. If one of those players dies, the other dies of a broken heart.
    .cupid_action = Who would you like to make fall in love?
    .cupid_result = { $user } and { $user2 } are now in love.
    .lovers_reveal = As you drift into sleep, you are engulfed by a warm, fuzzy feeling. You are deeply in love with { $lover } and are not sure how you would cope if they were to die.
    .lovers_die = You feel a sharp pain in your chest. { $lover } is dead! You die of a broken heart.

    .diseased = You are the {roles.diseased}. At dusk, you may spread your affliction to one player beside you. Any player who votes for you or your victim cannot win.
    .diseased_action = Who would you like to infect?
    .diseased_result = { $user } is now diseased.

    .instigator = You are the {roles.instigator}. At dusk, you may brand any player as a traitor. The traitor only wins if someone else on their team is killed, unless they are the only player on their team.
    .instigator_action = Who would you like to brand as a traitor?
    .instigator_result = { $user } is now a traitor.
    .instigator_poke = You feel a sense of hatred as you drift off to sleep. You are now a traitor!

    .priest = You are the {roles.priest}. At dusk, you will annoint yourself and up to one other player with a Mark of Clarity.
    .priest_action = Who would you like to annoint?
    .priest_result = { $user } is now marked with a Mark of Clarity.

    .assassin = You are the {roles.assassin}. At dusk, you may select a player as your target. You only win if your target is killed.
    .assassin_action = Who would you like to make your target?
    .assassin_result = { $user } is now your target.
    .assassin_reveal = { $user } is the {roles.apprentice_assassin}. Watch out, as they will be vying for your death!

    .apprentice_assassin = You are the {roles.apprentice_assassin}.
    .app_assassin_reveal = { $user } is the {roles.assassin}. Fueled by vengeance, you only win if they are killed!
    .app_assassin_none = You don't see the {roles.assassin} tonight.
    .app_assassin_none2 = Was your drive for revenge all for naught? If there are no {roles.assassin} by the end of the night, you will only win if you are killed.

    .marksman = You are the {roles.marksman}. Tonight, you may look at the role of one player, and the mark of another.
    .marksman_action = Whose role would you like to look at?
    .marksman_action2 = Whose mark would you like to look at?
    .marksman_result = {seer.reveal}
    .marksman_result2 = { $user } is marked with a { $mark }.

    .pickpocket = You are the {roles.pickpocket}. Tonight, you may swap your mark with the mark of another player and view your new mark.
    .pickpocket_action = Whose mark would you like to swap with?
    .pickpocket_result = You swapped your mark with { $user } and are now marked with a { $mark }.

    .gremlin = You are the {roles.gremlin}. Tonight, you may swap the marks or roles of two players, but not both. You may not look at the marks or roles you are swapping.
    .gremlin_action = Will you swap marks or roles?
    .gremlin_action2 = Which players' { $status } would you like to swap?
    .gremlin_result = You swapped the { $status }s of { $user } and { $user2 }.

    .oracle = You are the {roles.oracle}. Tonight, you may answer a question.

    .alien = You are an {roles.alien}! Gather at night to meet your other extraterrestrial beings and cause havoc to the space-time continuum.
    .alien_reveal = Your fellow aliens are { $aliens }.

    .synthetic_alien = You are a {roles.synthetic_alien}. Burdened by extreme self-awareness, you know that it is best for you to die. You only win if you are killed.

    .cow = You are a {roles.cow}. If you are next to an alien, you will be tipped over.
    .cow_reveal = You were tipped over by { $user }.

    .groob = You are {roles.groob}. You just can't with {roles.zerb} and will do anything you can to get rid of them. If they show up at night, you only win if {roles.zerb} is killed and you survive.
    .groob_reveal = { $user } is {roles.zerb}! They must die for you to win.

    .zerb = You are {roles.zerb}. You just can't with {roles.groob} and will do anything you can to get rid of them. If they show up at night, you only win if {roles.groob} is killed and you survive.
    .zerb_reveal = { $user } is {roles.groob}! They must die for you to win.

    .leader = You are the {roles.leader}. Tonight, you will learn the identities of the {team.alien}s. If {roles.groob} and {roles.zerb} are not both in play, you only win if the aliens lose. Otherwise, you only win if both {roles.groob} and {roles.zerb} survive. If all members of the {team.alien} team vote for you, the {team.village} team loses.
    .leader_reveal = The aliens are { $aliens }.
    .leader_reveal2 = { $groob } is {roles.groob} and { $zerb } is {roles.zerb}! Ensure that both survive to win.

    .psychic = You are the {roles.psychic}. Tonight, you may learn the roles of one or more players. The roles which may be learned are random.

    .rascal = You are the {roles.rascal}. Tonight, you may swap two or more players' roles. The roles which may be swapped are random.

    .exposer = You are the {roles.exposer}. Before the end of the night, you may reveal some or all of the unassigned roles. The number of roles which may be revealed is random.

    .blob = You are the {roles.blob}. Tonight, you will grow, subsuming the players next to you. The number of players that join you is random. You only win if all players that are part of the blob survive.
    .blob_reveal = { $users } are now part of the blob.
    .blob_poke = You are now part of the blob.

    .mortician = You are the {roles.mortician}. Tonight, you may learn the roles of the players next to you. The number of roles which may be learned is random. You only win if at least one player next to you dies.

    .aura_seer = You are the {roles.aura_seer}. Tonight, you will learn all the players who viewed or shifted a role at night.
    .aura_seer_reveal = { $users } viewed or shifted a role last night.

    .cursed = You are the {roles.cursed}. You are on the {team.village} team, unless a werewolf or vampire votes for you, in which case you join them.

    .prince = You are the {roles.prince}. You cannot be voted for execution. If you receive the most votes, the player with the next most votes is killed instead.

    .apprentice_tanner = You are the {roles.apprentice_tanner}.
    .app_tanner_reveal = { $user } is the {roles.tanner}. You only win if they are killed.
    .app_tanner_none = You don't see the {roles.tanner} tonight. If they do not show up in the morning, you would rather die!

    .beholder = You are the {roles.beholder}. At the end of the night, you will check the roles of the Seer and Apprentice Seer.
    .beholder_reveal = { $user } is the { $role }.

    .squire = You are the {roles.squire}. At the end of the night, you will learn who the werewolves are and check their roles.

    .thing = You are the {roles.thing}. At night, you may tap the player to your right or left.
    .thing_action = Who would you like to tap?
    .thing_result = You tapped { $user } in their slumber.
    .thing_poke = You feel something cold brush your shoulder. The {roles.thing} is next to you!

    .nostradamus = You are {roles.nostradamus}. At night, you may look at the roles of up to three players, and join the team of the last player you look at. The team you join will be revealed to all players.
    .nostradamus_action = Whose role would you like to look at?
    .nostradamus_reveal = {seer.reveal}
    .nostradamus_reveal2 = { misc.self_team_changed }
    .nostradamus_announce = { $user } is now on the { $team } team.

    .body_snatcher = You are the {roles.body_snatcher}. At night, you may exchange your role with a non-alien player and learn their new role. The snatched role is now an alien.
    .body_snatcher_action = Whose body would you like to snatch?
    .body_snatcher_reveal = You snatched { $user }'s body. They were a { $role }.

    .empath = You are the {roles.empath}. At night, you may watch the actions of random players.
