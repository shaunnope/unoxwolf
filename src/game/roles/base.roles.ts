import { Role, Team } from "~/game/types.ts";

export const Villager: Role = {
    name: "Villager",
    team: Team.Village,
    descCommand: "roleVG",
    description: "role_desc.villager",

    actions: [],
    doppleActions: []
}

export const Werewolf: Role = {
    ...Villager,
    name: "Werewolf",
    team: Team.Werewolf,
    descCommand: "roleWW",
    description: "role_desc.werewolf",

    actions: [],
    doppleActions: []
}

export const Seer: Role = {
    ...Villager,
    name: "Seer",
    descCommand: "roleSeer",
    description: "role_desc.seer",

    actions: [],
    doppleActions: []
}


export const Robber: Role = {
    ...Villager,
    name: "Robber",
    descCommand: "roleRobber",
    description: "role_desc.robber",

    actions: [],
    doppleActions: []
}

export const Troublemaker: Role = {
    ...Villager,
    name: "Troublemaker",
    descCommand: "roleTM",
    description: "role_desc.troublemaker",

    actions: [],
    doppleActions: []
}

export const Drunk: Role = {
    ...Villager,
    name: "Drunk",
    descCommand: "roleDrunk",
    description: "role_desc.drunk",

    actions: [],
    doppleActions: []
}

export const Insomniac: Role = {
    ...Villager,
    name: "Insomniac",
    descCommand: "roleInsomniac",
    description: "role_desc.insomniac",

    actions: [],
    doppleActions: []
}

export const Mason: Role = {
    ...Villager,
    name: "Mason",
    descCommand: "roleMason",
    description: "role_desc.mason",

    actions: [],
    doppleActions: []
}

export const Minion: Role = {
    ...Werewolf,
    name: "Minion",
    descCommand: "roleMinion",
    description: "role_desc.minion",

    actions: [],
    doppleActions: []
}

export const Tanner: Role = {
    ...Villager,
    name: "Tanner",
    team: Team.Tanner,
    descCommand: "roleTanner",
    description: "role_desc.tanner",

    actions: [],
    doppleActions: []
}

export const Hunter: Role = {
    ...Villager,
    name: "Hunter",
    descCommand: "roleHunter",
    description: "role_desc.hunter",

    actions: [],
    doppleActions: []
}

export const Doppelganger: Role = {
    ...Villager,
    name: "Doppelganger",
    descCommand: "roleDG",
    description: "role_desc.doppelganger",

    actions: [],
    doppleActions: []
}
