import _ from 'lodash'
import * as Roles from '~/game/roles'

import type { Role } from '~/game/models/role'

export const generateRoles = (
  n: number,
  roles: (typeof Role)[] | Set<typeof Role>,
  extra: number = 3,
  shuffle: boolean = true
) => {
  // TODO: dynamic role generation
  const deck: (typeof Role)[] = [
    Roles.Werewolf,
    Roles.Werewolf,
    Roles.Troublemaker,
    Roles.Mason,
    Roles.Mason,
    Roles.Robber,
  ]

  let addon: (typeof Role)[] = [
    Roles.Villager,
    Roles.Seer,
    Roles.Minion,
    Roles.Drunk,
    Roles.Insomniac,
    Roles.Hunter,
    Roles.Tanner,
    Roles.Doppelganger,
  ]

  if (shuffle) {
    addon = _.shuffle(addon)
  }

  return _.shuffle(deck.concat(addon).slice(0, n + extra)).map(R => new R())
}

export const balanceRoles = (n: number, roles: (typeof Role)[]) => {
  let attempts = 0
  const balanced = false
  while (!balanced && attempts < 500) {
    const deck = generateRoles(n, roles)

    attempts++
  }
}
