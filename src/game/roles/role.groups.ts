import * as Roles from "~/game/roles"

export const BASE_ROLES = [
  Roles.Villager,
  Roles.Werewolf,
  Roles.Seer,
  Roles.Robber,
  Roles.Troublemaker,
  Roles.Mason,
  Roles.Drunk,
  Roles.Insomniac,
  Roles.Hunter,
  Roles.Tanner,
  Roles.Minion,
  Roles.Doppelganger,
]

export const DAWN_ROLES = [
  Roles.Fool,
  Roles.ApprenticeSeer,
]

export const ALL_ROLES = [...BASE_ROLES, ...DAWN_ROLES]

export const PHASES = {
  copy: [Roles.Doppelganger],
  night: [Roles.Seer, Roles.ApprenticeSeer, Roles.Robber, Roles.Troublemaker, Roles.Drunk, Roles.Insomniac],
  passive: [Roles.Villager, Roles.Werewolf, Roles.Minion, Roles.Mason, Roles.Hunter, Roles.Tanner, Roles.Fool],
}
