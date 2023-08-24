import _ from 'lodash'
import * as Roles from '~/game/roles'

import type { Role } from '~/game/models/player'

export const generateRoles = (n: number, roles: (typeof Role)[] | Set<typeof Role>, extra: number = 3) => {
  const availableRoles = roles instanceof Array ? new Set(roles) : roles

  const deck = Array<Role>(n).fill(new Roles.Werewolf())
  deck.push(...Array(extra).fill(new Roles.Villager()))

  return _.shuffle(deck)
}

export const balanceRoles = (n: number, roles: (typeof Role)[]) => {
  let attempts = 0
  const balanced = false
  while (!balanced && attempts < 500) {
    const deck = generateRoles(n, roles)

    attempts++
  }
}
