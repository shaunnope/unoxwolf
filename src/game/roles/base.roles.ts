import { Role, Team } from '~/game/models/types'

export const Villager: Role = {
  name: 'roles.villager',
  team: Team.Village,
  descCommand: 'roleVG',
  description: 'role_desc.villager',
  lore: 'role_message.villager',

  actions: [],
  doppleActions: [],
}

export const Werewolf: Role = {
  ...Villager,
  name: 'roles.werewolf',
  team: Team.Werewolf,
  descCommand: 'roleWW',
  description: 'role_desc.werewolf',
  lore: 'role_message.werewolf',

  actions: [],
  doppleActions: [],
}

export const Seer: Role = {
  ...Villager,
  name: 'roles.seer',
  descCommand: 'roleSeer',
  description: 'role_desc.seer',
  lore: 'role_message.seer',

  actions: [],
  doppleActions: [],
}

export const Robber: Role = {
  ...Villager,
  name: 'roles.robber',
  descCommand: 'roleRobber',
  description: 'role_desc.robber',
  lore: 'role_message.robber',

  actions: [],
  doppleActions: [],
}

export const Troublemaker: Role = {
  ...Villager,
  name: 'roles.troublemaker',
  descCommand: 'roleTM',
  description: 'role_desc.troublemaker',
  lore: 'role_message.troublemaker',

  actions: [],
  doppleActions: [],
}

export const Drunk: Role = {
  ...Villager,
  name: 'roles.drunk',
  descCommand: 'roleDrunk',
  description: 'role_desc.drunk',
  lore: 'role_message.drunk',

  actions: [],
  doppleActions: [],
}

export const Insomniac: Role = {
  ...Villager,
  name: 'roles.insomniac',
  descCommand: 'roleInsomniac',
  description: 'role_desc.insomniac',
  lore: 'role_message.insomniac',

  actions: [],
  doppleActions: [],
}

export const Mason: Role = {
  ...Villager,
  name: 'roles.mason',
  descCommand: 'roleMason',
  description: 'role_desc.mason',
  lore: 'role_message.mason',

  actions: [],
  doppleActions: [],
}

export const Minion: Role = {
  ...Werewolf,
  name: 'roles.minion',
  descCommand: 'roleMinion',
  description: 'role_desc.minion',
  lore: 'role_message.minion',

  actions: [],
  doppleActions: [],
}

export const Tanner: Role = {
  ...Villager,
  name: 'roles.tanner',
  team: Team.Tanner,
  descCommand: 'roleTanner',
  description: 'role_desc.tanner',
  lore: 'role_message.tanner',

  actions: [],
  doppleActions: [],
}

export const Hunter: Role = {
  ...Villager,
  name: 'roles.hunter',
  descCommand: 'roleHunter',
  description: 'role_desc.hunter',
  lore: 'role_message.hunter',

  actions: [],
  doppleActions: [],
}

export const Doppelganger: Role = {
  ...Villager,
  name: 'roles.doppelganger',
  descCommand: 'roleDG',
  description: 'role_desc.doppelganger',
  lore: 'role_message.doppelganger',

  actions: [],
  doppleActions: [],
}
