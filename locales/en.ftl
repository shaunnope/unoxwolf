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
    .starting = Starting game...

game =
    .not_started = No game has been started yet!
    .already_started = A game has already been started!
    .no_join = You cannot join the game now!
    .no_leave = You cannot leave the game now!
    .player_flee = {$user} has left the game!
    .end = Game ended!

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
    You are a simple Villager. You have no special abilities, but are definitely not a werewolf.

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
    At night, the Sentinel may choose to protect another player from being robbed, switched, or looked at by other players.

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
    The Aura Seer learns all the players who viewed or shifted a role or mark at night.

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
