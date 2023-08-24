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
    👋🏻 Hi there, I am Unox! Add me to a group to moderate games of One Night Ultimate Werewolf.
    Try me now! 🐺

    {welcome.help}

    .help =
        <strong>{"COMMANDS"}</strong>
        /rolelist - List all available roles
        /help - Show help

    .prompt_start_bot =
        Hi {$user}! Before you can join a game, you need to start the bot.

game_init = {$user} has started a new game!
    .unknown_user = Someone
    .join = Join
    .join_prompt = Click here to join the game!
    .join_success = You joined the game in { $chat }!
    .player_count = <strong>No. of players:</strong> {$count}
    .joined_game = { $users } joined the game in the last 30 seconds.
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
    .no_join = You cannot join the game now!
    .no_leave = You cannot leave the game now!
    .player_flee = {$user} has left the game!
    .end = Game ended!
    .timer_skipped = <em>Skipping forward...</em>
    .times_up = Time's up!

    .night_start = Night falls...
    .night_end = The sun rises...

    .voting_started = Voting has started!
    .voting_qn = Who do you want to vote for?
    .already_voted = You have already voted!
    .vote_cast = You voted for {$user}.
    .voting_end = Voting has ended!
    .voting_tally = Tallying votes...


game_error =
    .err_assign_roles = Error while assigning roles. Please start a new game.
    .vote_invalid = Invalid target: {$user}.
    .not_in_game = You are not in the game in {$chat}!
    .wrong_qn = This question is not for you!

misc =
    .unassigned = Unassigned roles ({$count})
    .peek_role = { $user } is a { $role }
    .self_role_changed = You are now a {$role}
    .self_team_changed = You are now on the {$team} team.


roles =
    .villager = Villager 👱
    .werewolf = Werewolf 🐺
    .seer = Seer 👳
    .robber = Robber 😈
    .troublemaker = Troublemaker 🙅
    .tanner = Tanner 👺
    .drunk = Drunk 🍺
    .insomniac = Insomniac 😴
    .hunter = Hunter 🔫
    .mason = Mason 👷
    .minion = Minion 👹
    .doppelganger = Doppelganger 🎭

    .sentinel = Sentinel 🚨
    .apprentice_seer = Apprentice Seer 👳
    .paranormal_investigator = Paranormal Investigator 👻
    .revealer = Revealer 📖
    .curator = Curator 📜
    .witch = Witch 🧙
    .village_idiot = Village Idiot 🤡
    .bodyguard = Bodyguard 🛡
    .alpha_wolf = Alpha Wolf ⚡️
    .mystic_wolf = Mystic Wolf 🐺
    .dream_wolf = Dream Wolf 🐺

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

    .team_village = Village
    .team_werewolf = Werewolf
    .team_tanner = Tanner
    .team_vampire = Vampire
    .team_assassin = Assassin
    .team_alien = Alien
    .team_synth = Synthetic Alien
    .team_blob = Blob
    .team_mortician = Mortician

    .page_base =
        /roleVG - {roles.villager}
        /roleWW - {roles.werewolf}
        /roleSeer - {roles.seer}
        /roleRobber - {roles.robber}
        /roleTM - {roles.troublemaker}
        /roleTanner - {roles.tanner}
        /roleDrunk - {roles.drunk}
        /roleInsomniac - {roles.insomniac}
        /roleHunter - {roles.hunter}
        /roleMason - {roles.mason}
        /roleMinion - {roles.minion}
        /roleDG - {roles.doppelganger}

    .page_daybreak =
        /roleSentinel - {roles.sentinel}
        /roleAppS - {roles.apprentice_seer}
        /rolePI - {roles.paranormal_investigator}
        /roleRevealer - {roles.revealer}
        /roleCurator - {roles.curator}
        /roleWitch - {roles.witch}
        /roleVI - {roles.village_idiot}
        /roleBG - {roles.bodyguard}
        /roleAW - {roles.alpha_wolf}
        /roleMW - {roles.mystic_wolf}
        /roleDW - {roles.dream_wolf}

    .page_vampire =
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

    .page_aliens =
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

    .page_bonus =
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
    .villager =
    A Villager has no special abilities, but is definitely not a werewolf.

    <em>The Villager is on the {roles.team_village} team.</em>
    .werewolf =
    At night, all Werewolves reveal themselves to each other.

    <strong>Lone Wolf Mode:</strong> If no other Werewolves are in play, the lone Werewolf may look at an unassigned role.

    <em>Werewolves are on the {roles.team_werewolf} team.</em>
    .seer =
    At night, the Seer may look at one other player's role or two of the unassigned roles.

    <em>The Seer is on the {roles.team_village} team.</em>
    .robber =
    At night, the Robber may choose to rob another player's role, swapping it with their own. The Robber then looks at his new role.

    <em>The Robber is on the {roles.team_village} team.</em>
    .troublemaker =
    At night, the Troublemaker may choose to switch the roles of two other players without looking at those roles.

    <em>The Troublemaker is on the {roles.team_village} team.</em>
    .tanner =
    The Tanner wins only if they are killed.

    <em>The Tanner is on the {roles.team_tanner} team.</em>
    .drunk =
    At night, the Drunk must exchange their role with an unassigned role without knowing what that role is.

    <em>The Drunk is on the {roles.team_village} team.</em>
    .insomniac =
    Before the end of the night, the Insomniac wakes up and looks at their own role.

    <em>The Insomniac is on the {roles.team_village} team.</em>
    .hunter =
    If the Hunter dies, the player they vote for also dies.

    <em>The Hunter is on the {roles.team_village} team.</em>
    .mason =
    At night, the Masons reveal themselves to each other.

    <em>The Masons are on the {roles.team_village} team.</em>
    .minion =
    At night, the Minion learns who the Werewolves are.

    <em>The Minion is on the {roles.team_werewolf} team. If there are no Werewolves in play, the Minion wins if they are not killed.</em>
    .doppelganger =
    At dusk, the Doppelgänger assumes another player's role.

    <em>The Doppelgänger is on the team of the role they copy.</em>

    .sentinel =
    At night, the Sentinel may choose to protect another player's role from being robbed, switched, or looked at by other players.

    <em>The Sentinel is on the {roles.team_village} team.</em>
    .apprentice_seer =
    At night, the Apprentice Seer may look at one of the unassigned roles.

    <em>The Apprentice Seer is on the {roles.team_village} team.</em>
    .paranormal_investigator =
    At night, the Paranormal Investigator may view the roles of two other players, one at a time. If they view a role that is not on the {roles.team_village} team, they must stop looking and join the team of the role they viewed.

    <em>The Paranormal Investigator is on the {roles.team_village} team, unless they view a role that is not on the {roles.team_village} team, then they join that team.</em>
    .revealer =
    At the end of the night, the Revealer may choose to reveal the role of one player. If the revealed role is not on the {roles.team_village} team, the role is not revealed.

    <em>The Revealer is on the {roles.team_village} team.</em>
    .curator =
    A collector of ancient wares, the Curator may give any player an unrevealed artifact at the end of the night. They may not give an artifact to a protected player.

    <em>The Curator is on the {roles.team_village} team.</em>
    .witch =
    At night, the Witch may look at one of the unassigned roles. If they do, they must exchange that role with any player's role, including their own. They may not look at the role they are exchanging.

    <em>The Witch is on the {roles.team_village} team.</em>
    .village_idiot =
    The Village Idiot may move all roles but their own one position to the left or right.

    <em>The Village Idiot is on the {roles.team_village} team.</em>
    .bodyguard =
    The player the bodyguard votes for cannot be killed. If that player received the most votes, the player with the next most votes is killed.

    <em> The Bodyguard is on the {roles.team_village} team.</em>
    .alpha_wolf =
    The Alpha Wolf wakes up with the other werewolves. Subsequently, they will convert a non-werewolf into a werewolf, without learning the player's original role.

    <em> The Alpha Wolf is on the {roles.team_werewolf} team.</em>
    .mystic_wolf =
    At night, after meeting the other werewolves, the mystic wolf may learn the role of one other player.

    <em> The Mystic Wolf is on the {roles.team_werewolf} team.</em>
    .dream_wolf =
    The Dream Wolf does not wake up with the other werewolves. Their role is still revealed to the Werewolves and Minions.

    <em> The Dream Wolf is on the {roles.team_werewolf} team.</em>

    .copycat =
    At dusk, the Copycat assumes the role of one of the unassigned roles.

    <em> The Copycat is on the team they first view.</em>
    .vampire =
    At night, all Vampires reveal themselves to each other and convert one other player into a Vampire.

    <em> Vampires are on the {roles.team_vampire} team.</em>
    .vampire_master =
    The Vampire Master wakes up with the other Vampires. If a player on the {roles.team_vampire} team votes for the Master, the Master is protected and the player with the next most votes is killed instead.

    <em> The Vampire Master is on the {roles.team_vampire} team.</em>
    .vampire_count =
    The Count wakes up with the other Vampires. Subsequently, they will instill fear in a non-Vampire player, preventing them from performing their night action.

    <em> The Count is on the {roles.team_vampire} team.</em>
    .renfield =
    The Renfield wakes up after the Vampires and learns who they are. Subsequently, they will turn into a bat.

    <em> The Renfield is on the {roles.team_vampire} team, but is not a Vampire. If there are no Vampires in play, the Renfield is on the {roles.team_village} team.</em>
    .cupid =
    At night, Cupid may choose two players to fall in love. If one of those players dies, the other dies of a broken heart.

    <em> Cupid is on the {roles.team_village} team.</em>
    .diseased =
    At night, the Diseased spreads their affliction to one player beside them. Any player who votes for the Diseased or the Diseased's victim cannot win.

    <em> The Diseased is on the {roles.team_village} team.</em>
    .instigator =
    At night, the Instigator may brand any player as a traitor. The traitor only wins if someone else on their team is killed, unless they are the only player on their team.

    <em> The Instigator is on the {roles.team_village} team.</em>
    .priest =
    At night, the Priest replaces his mark with a Mark of Clarity, and may choose to do the same for one other player.

    <em> The Priest is on the {roles.team_village} team.</em>
    .assassin =
    At night, the Assassin selects a player as their target. The Assassin only wins if their target is killed.

    <em> The Assassin is on the {roles.team_assassin} team.</em>
    .apprentice_assassin =
    The Apprentice Assassin learns the identity of the Assassin at the start of the game. The Apprentice Assassin only wins if the Assassin is killed. If there is no Assassin, the Apprentice Assassin selects a player as their target, and can only win if both they and their target are killed.

    <em> The Apprentice Assassin is on the {roles.team_assassin} team.</em>
    .marksman =
    At night, the Marksman learns the role of one player, and the mark of another.

    <em> The Marksman is on the {roles.team_village} team.</em>
    .pickpocket =
    At night, the Pickpocket may swap their mark with the mark of another player and view their new mark.

    <em> The Pickpocket is on the {roles.team_village} team.</em>
    .gremlin =
    At night, the Gremlin may swap the marks or roles of two players, but not both. They may not look at the marks or roles they are swapping.

    <em> The Gremlin is on the {roles.team_village} team.</em>

    .oracle =
    The Oracle answers a question at night.

    <em> The Oracle is on the {roles.team_village} team.</em>
    .alien =
    At night, the Aliens reveal themselves to each other and performs a randomised action.

    <em> Aliens are on the {roles.team_alien} team.</em>
    .synthetic_alien =
    The Synthetic Alien wakes up with the other Aliens. However, the Synth only wins if they die.

    <em> The Synthetic Alien is on the {roles.team_synth} team.</em>
    .cow =
    If the cow is next to an Alien, they are tipped over.

    <em> The Cow is on the {roles.team_village} team.</em>
    .groob =
    Groob and Zerb wake up with the aliens, then subsequently identify each other. If both Groob and Zerb are in play, they only win if the other is killed, while they survive. All other aliens lose if either Groob or Zerb is killed.

    <em> Groob is on the {roles.team_alien} team, unless Zerb is in play, in which case they are on their own teams.</em>
    .zerb =
    Groob and Zerb wake up with the aliens, then subsequently identify each other. If both Groob and Zerb are in play, they only win if the other is killed, while they survive. All other aliens lose if either Groob or Zerb is killed.

    <em> Zerb is on the {roles.team_alien} team, unless Groob is in play, in which case they are on their own teams.</em>
    .leader =
    At night, the Leader learns the identities of the Aliens, and whether both Groob and Zerb are in play. If Groob and Zerb are not both in play, the Leader wins with the {roles.team_village} team. Otherwise, the Leader only wins if both Groob and Zerb survive. If all Aliens vote for the Leader, the village team loses.

    <em> The Leader is on the {roles.team_village} team, unless both Groob and Zerb are in play, in which case they only win if both Groob and Zerb survive.</em>
    .psychic =
    At night, the Psychic learns the roles of one or more players. The roles which may be learned are random.

    <em> The Psychic is on the {roles.team_village} team.</em>
    .rascal =
    At night, the Rascal may swap two or more players' roles. The roles which may be swapped are random.

    <em> The Rascal is on the {roles.team_village} team.</em>
    .exposer =
    Before the end of the night, the Exposer may reveal some or all of the unassigned roles. The number of roles which may be revealed is random.

    <em> The Exposer is on the {roles.team_village} team.</em>
    .blob =
    The Blob grows in the night, subsuming the players next to them. The number of players that join the Blob is random. The Blob only wins if all players that are part of the Blob survive.

    <em> The Blob is on the {roles.team_blob} team.</em>
    .mortician =
    At night, the Mortician may learn the roles of the players next to them. The number of roles which may be learned is random. The Mortician only wins if at least one player next to them dies.

    <em> The Mortician is on the {roles.team_mortician} team.</em>

    .aura_seer =
    The Aura Seer learns all the players who viewed or shifted a role at night.

    <em> The Aura Seer is on the {roles.team_village} team.</em>
    .cursed =
    The Cursed is on the {roles.team_village} team, unless a Werewolf or Vampire votes for them, in which case they join the {roles.team_werewolf} or {roles.team_vampire} team.

    .prince =
    The Prince cannot be voted for execution. If the Prince received the most votes, the player with the next most votes is killed instead.

    <em> The Prince is on the {roles.team_village} team.</em>
    .apprentice_tanner =
    The Apprentice Tanner learns the identity of the Tanner at the start of the game. The Apprentice Tanner only wins if the Tanner dies. If there is no Tanner, the Apprentice Tanner only wins if they are killed.

    <em> The Apprentice Tanner is on the {roles.team_tanner} team.</em>
    .beholder =
    The Beholder learns who the Seer and Apprentice Seer are at the start of the game and checks their roles at the end of the night.

    <em> The Beholder is on the {roles.team_village} team.</em>
    .squire =
    The Squire learns who the Werewolves are at the start of the game and checks their roles at the end of the night.

    <em> The Squire is on the {roles.team_werewolf} team.</em>
    .thing =
    At night, the Thing may tap the player to their right or left.

    <em> The Thing is on the {roles.team_village} team.</em>
    .nostradamus =
    At night, Nostradamus may look at the roles of up to three players, and joins the team of the last player they look at. The team they join is revealed to all players.
    Nostradamus wins if they stay alive and their last viewed team wins. The death of Nostradamus does not cause their team to lose.

    <em> Nostradamus is on the team of the last player they look at.</em>
    .body_snatcher =
    At night, the Body Snatcher exchanges their role with a non-Alien player and learns their new role. The snatched role is now an Alien.

    <em> The Body Snatcher is on the {roles.team_alien} team.</em>
    .empath =
    The Empath watches the actions of random players at night.

    <em> The Empath is on the {roles.team_village} team.</em>


role_message =
    .villager =
        You are a simple {roles.villager}.
        Rest well tonight and don't let the werewolves bite!

    .werewolf =
        You are a {roles.werewolf}!
        Arise at night to meet your fellow lycantrophic brethren.
    .werewolf_reveal = Your fellow werewolves are { $wolves }.
    .werewolf_lone = You are the only werewolf.
    .werewolf_lone2 = One of the unassigned roles is a { $role }.

    .seer =
        You are the {roles.seer}.
        Tonight, you may look at one other player's role or two of the unassigned roles.
    .seer_action = Whose role would you like to look at?
    .seer_reveal = { misc.peek_role }
    .seer_reveal2 = A { $role1 } and a { $role2 } are unassigned tonight.

    .robber = You are the {roles.robber}. Tonight, you may rob another player's role, exchanging it with your own. You may then look at your new role.
    .robber_action = Whose role would you like to rob?
    .robber_swap = You stole { $user2 }'s role. { misc.self_role_changed }

    .troublemaker = You are the {roles.troublemaker}. Tonight, you may switch the roles of two other players without looking at those roles.
    .troublemaker_action = Whose roles would you like to switch?
    .troublemaker_swap = You switched { $user1 }'s role with { $user2 }'s role.

    .tanner = You are the {roles.tanner}. Sick of your job, you only win if you are killed tonight.

    .drunk = You are the {roles.drunk}. After having one drink too many, your role will be exchanged with an unassigned role by the end of the night.
    .drunk_secret = {role_message.villager}

    .insomniac = You are the {roles.insomniac}. With news of werewolves hiding in your midst, it would be a miracle if you were able to sleep soundly tonight.

    .hunter = You are the {roles.hunter}. If you are killed tonight, the player you vote for will also die.

    .mason = You are a {roles.mason}. At night, you may meet your fellow masons.
    .mason_reveal = Your fellow masons are { $masons }.

    .minion = You are the {roles.minion}. At night, you may meet your revered werewolves.
    .minion_reveal = The werewolves are { $wolves }.
    .minion_none = There are no werewolves tonight. Survive the morning and you will win.

    .doppelganger = You are the {roles.doppelganger}.
    .doppelganger_action = Whose role would you like to copy?
    .doppelganger_reveal = { misc.self_role_changed }

    .sentinel = You are the {roles.sentinel}. Tonight, you may protect another player from being robbed, switched, or looked at by other players.
    .sentinel_action = Who would you like to protect?
    .sentinel_poke = As you drift off to sleep, you feel a sense of security, knowing that you will be safe from harm tonight.
    .sentinel_reveal = { $user } was protected by the Sentinel.

    .apprentice_seer = You are the {roles.apprentice_seer}. Tonight, you may look at one of the unassigned roles.
    .apprentice_seer_reveal = A { $role } is unassigned tonight.

    .paranormal_investigator = You are the {roles.paranormal_investigator}. Tonight, you may view the roles of two other players, one at a time. If you view a role that is not on the {roles.team_village} team, you must stop looking and join the team of the role you viewed.
    .pi_action = Who would you like to visit?
    .pi_reveal_vg = {role_message.seer_reveal}
    .pi_reveal_other = {misc.peek_role} ! { misc.self_team_changed }

    .revealer = You are the {roles.revealer}. Tonight, you may reveal the role of one player. If the revealed role is not on the {roles.team_village} team, the role is not revealed.
    .revealer_action = Whose role would you like to reveal?
    .revealer_reveal = {role_message.seer_reveal}
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
    .mystic_wolf_action = {role_message.seer_action}
    .mystic_wolf_result = {role_message.seer_result}

    .dream_wolf = You are the {roles.dream_wolf}. Inflicted with a rare variant of narcolepsy, you have never been able to stay awake at night. At least the other members of your pack know who you are.

    .copycat = You are the {roles.copycat}, but not for long! Rummaging through the unassigned roles, you find one that you like. { misc.self_role_changed }

    .vampire = You are a {roles.vampire}! Arise at dusk to meet your fellow bloodsucking compadres and convert one other player into a vampire.
    .vampire_reveal = Your fellow vampires are { $vampires }.
    .vampire_none = There are no other vampires tonight.
    .vampire_action = {role_message.alpha_wolf_action}
    .vampire_result = After much deliberation, { $user } was turned into a vampire!

    .vampire_master = You are the {roles.vampire_master}. If a player on the {roles.team_vampire} team votes for you, you are protected and the player with the next most votes is killed instead.

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
    .marksman_result = {role_message.seer_reveal}
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

    .leader = You are the {roles.leader}. Tonight, you will learn the identities of the {roles.team_alien}s. If {roles.groob} and {roles.zerb} are not both in play, you only win if the aliens lose. Otherwise, you only win if both {roles.groob} and {roles.zerb} survive. If all members of the {roles.team_alien} team vote for you, the {roles.team_village} team loses.
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

    .cursed = You are the {roles.cursed}. You are on the {roles.team_village} team, unless a werewolf or vampire votes for you, in which case you join them.

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
    .nostradamus_reveal = {role_message.seer_reveal}
    .nostradamus_reveal2 = { misc.self_team_changed }
    .nostradamus_announce = { $user } is now on the { $team } team.

    .body_snatcher = You are the {roles.body_snatcher}. At night, you may exchange your role with a non-alien player and learn their new role. The snatched role is now an alien.
    .body_snatcher_action = Whose body would you like to snatch?
    .body_snatcher_reveal = You snatched { $user }'s body. They were a { $role }.

    .empath = You are the {roles.empath}. At night, you may watch the actions of random players.
