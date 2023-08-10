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

welcome = 
    👋🏻 Hi there, I am Unox! Add me to a group to moderate games of One Night Ultimate Werewolf.
    Try me now! 🐺

    <strong>{"COMMANDS"}</strong>
    /rolelist - List all available roles
    /help - Show help

roles =
    .villager = Villager
    .werewolf = Werewolf
    .seer = Seer
    .robber = Robber
    .troublemaker = Troublemaker
    .tanner = Tanner
    .drunk = Drunk
    .insomniac = Insomniac
    .hunter = Hunter
    .mason = Mason
    .minion = Minion
    .doppelganger = Doppelganger

    .sentinel = Sentinel
    .apprentice_seer = Apprentice Seer
    .paranormal_investigator = Paranormal Investigator
    .revealer = Revealer
    .curator = Curator
    .witch = Witch
    .village_idiot = Village Idiot
    .bodyguard = Bodyguard
    .alpha_wolf = Alpha Wolf
    .mystic_wolf = Mystic Wolf
    .dream_wolf = Dream Wolf

    .copycat = Copycat
    .vampire = Vampire
    .vampire_master = the Master
    .vampire_count = the Count
    .renfield = Renfield
    .cupid = Cupid
    .diseased = Diseased
    .instigator = Instigator
    .priest = Priest
    .assassin = Assassin
    .apprentice_assassin = Apprentice Assassin
    .marksman = Marksman
    .pickpocket = Pickpocket
    .gremlin = Gremlin

    .oracle = Oracle
    .alien = Alien
    .synthetic_alien = Synthetic Alien
    .cow = Cow
    .groob = Groob
    .zerb = Zerb
    .leader = Leader
    .psychic = Psychic
    .rascal = Rascal
    .exposer = Exposer
    .blob = Blob
    .mortician = Mortician

    .aura_seer = Aura Seer
    .cursed = Cursed
    .prince = Prince
    .apprentice_tanner = Apprentice Tanner
    .beholder = Beholder
    .squire = Squire
    .thing = the Thing
    .nostradamus = Nostradamus
    .empath = Empath

    .team_village = Village
    .team_werewolf = Werewolf
    .team_tanner = Tanner
    .team_vampire = Vampire
    .team_alien = Alien
    .team_blob = Blob

    .page_base =
        /roleVG - {roles.villager} 👱
        /roleWW - {roles.werewolf} 🐺
        /roleSeer - {roles.seer} 👳
        /roleRobber - {roles.robber} 😈
        /roleTM - {roles.troublemaker} 🙅
        /roleTanner - {roles.tanner} 👺
        /roleDrunk - {roles.drunk} 🍺
        /roleInsomniac - {roles.insomniac} 😴
        /roleHunter - {roles.hunter} 🔫
        /roleMason - {roles.mason} 👷
        /roleMinion - {roles.minion} 👹
        /roleDG - {roles.doppelganger} 🎭

    .page_daybreak =
        /roleSentinel - {roles.sentinel} 🚨
        /roleAppS - {roles.apprentice_seer} 👳
        /rolePI - {roles.paranormal_investigator} 👻
        /roleRevealer - {roles.revealer} 📖
        /roleCurator - {roles.curator} 📜
        /roleWitch - {roles.witch} 🧙
        /roleVI - {roles.village_idiot} 🤡
        /roleBG - {roles.bodyguard} 🛡
        /roleAW - {roles.alpha_wolf} ⚡️
        /roleMW - {roles.mystic_wolf} 🐺
        /roleDW - {roles.dream_wolf} 🐺

    .page_vampire = 
        /roleCopycat - {roles.copycat} 🐱
        /roleVampire - {roles.vampire} 🧛
        /roleMaster - {roles.vampire_master} 🧛
        /roleCount - {roles.vampire_count} 🧛
        /roleRenfield - {roles.renfield} 🧛
        /roleCupid - {roles.cupid} 💘
        /roleDiseased - {roles.diseased} 🤢
        /roleInstigator - {roles.instigator} 🤹
        /rolePriest - {roles.priest} 🙏
        /roleAssassin - {roles.assassin} 🔪
        /roleAppA - {roles.apprentice_assassin} 🔪
        /roleMarksman - {roles.marksman} 🏹
        /rolePickpocket - {roles.pickpocket} 👤
        /roleGremlin - {roles.gremlin} 👹

    .page_aliens = 
        /roleOracle - {roles.oracle} 🔮
        /roleAlien - {roles.alien} 👽
        /roleSynthA - {roles.synthetic_alien} 🤖
        /roleCow - {roles.cow} 🐮
        /roleGroob - {roles.groob} 👽
        /roleZerb - {roles.zerb} 👽
        /roleLeader - {roles.leader} 👑
        /rolePsychic - {roles.psychic} 🧠
        /roleRascal - {roles.rascal} 🤡
        /roleExposer - {roles.exposer} 📸
        /roleBlob - {roles.blob} 🧟
        /roleMortician - {roles.mortician} 🧟

    .page_bonus =
        /roleAuraS - {roles.aura_seer} 👳
        /roleCursed - {roles.cursed} 🧟
        /rolePrince - {roles.prince} 🤴
        /roleAppT - {roles.apprentice_tanner} 👺
        /roleBeholder - {roles.beholder} 👀
        /roleSquire - {roles.squire} 👑
        /roleThing - {roles.thing} 👹
        /roleNostradamus - {roles.nostradamus} 🔮
        /roleEmpath - {roles.empath} 🧠

role_desc =
    .villager =
    You are a simple Villager. You have no special abilities, but are definitely not a werewolf.
    <em>The Villager is on the {roles.team_village} team.</em>
    .werewolf = 
    At night, all Werewolves reveal themselves to each other. 
    <strong>Lone Wolf Mode:</strong> If no other Werewolves are in play, the lone Werewolf may look at a role from the center.
    <em>Werewolves are on the {roles.team_werewolf} team.</em>
    .seer =
    At night, the Seer may look at one other player's role or two of the center roles.
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
    At night, the Drunk must exchange their role with a role from the center without knowing what that role is.
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
    At the start of the night, the Doppelgänger assumes another player's role. 
    <em>The Doppelgänger is on the team of the role they copy.</em>

    .sentinel = 
    At night, the Sentinel may choose to protect another player from being robbed, switched, or looked at by other players.
    <em>The Sentinel is on the {roles.team_village} team.</em>
    .apprentice_seer = 
    At night, the Apprentice Seer may look at one of the center roles.
    <em>The Apprentice Seer is on the {roles.team_village} team.</em>
    .paranormal_investigator = 
    At night, the Paranormal Investigator may view the roles of two other players, one at a time. If they view a role that is not on the {roles.team_village} team, they must stop looking and join the team of the role they viewed.
    .revealer = 
    At the end of the night, the Revealer may choose to reveal the role of one player. If the revealed role is not on the {roles.team_village} team, the role is not revealed.
    <em>The Revealer is on the {roles.team_village} team.</em>
    .curator = 
    A collector of ancient wares, the Curator may give any player an unrevealed artifact at the end of the night. They may not give an artifact to a protected player. 
    <em>The Curator is on the {roles.team_village} team.</em>
    .witch =
    At night, the Witch may look at one of the center roles. If they do, they must exchange that role with any player's role, including their own. They may not look at the role they are exchanging.
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

    .copycat = Copycat
    .vampire = Vampire
    .vampire_master = the Master
    .vampire_count = the Count
    .renfield = Renfield
    .cupid = Cupid
    .diseased = Diseased
    .instigator = Instigator
    .priest = Priest
    .assassin = Assassin
    .apprentice_assassin = Apprentice Assassin
    .marksman = Marksman
    .pickpocket = Pickpocket
    .gremlin = Gremlin

    .oracle = Oracle
    .alien = Alien
    .synthetic_alien = Synthetic Alien
    .cow = Cow
    .groob = Groob
    .zerb = Zerb
    .leader = Leader
    .psychic = Psychic
    .rascal = Rascal
    .exposer = Exposer
    .blob = Blob
    .mortician = Mortician

    .aura_seer = Aura Seer
    .cursed = Cursed
    .prince = Prince
    .apprentice_tanner = Apprentice Tanner
    .beholder = Beholder
    .squire = Squire
    .thing = the Thing
    .nostradamus = Nostradamus
    .empath = Empath



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
