import type { Context } from "~/bot/context"
import * as Roles from "~/game/roles"

import { isCopier } from "~/game/roles/copier"
import type { Affliction } from "./affliction"
import type { Role } from "./role"

export class Player {
  id: number

  name: string

  innateRole: Role

  currentRole: Role

  mark: Affliction

  ctx?: Context

  isProtected?: true

  votedFor?: Player

  isDead?: true

  won?: boolean

  /** Canonical reference to effective innate role. Accounts for copier roles */
  get role() {
    return isCopier(this.innateRole) ? this.innateRole.tail : this.innateRole
  }

  /** Canonical reference to effective current role. Accounts for copier roles */
  get current() {
    return isCopier(this.currentRole) ? this.currentRole.tail : this.currentRole
  }

  constructor(id: number, name: string, role?: Role, ctx?: Context) {
    this.id = id
    this.name = name

    this.innateRole = role ?? new Roles.Villager()
    this.currentRole = this.innateRole

    this.mark = { name: "mark" }
    this.ctx = ctx
  }

  setup(role: Role) {
    this.innateRole = role
    this.currentRole = role
  }

  get team() {
    return this.currentRole.info.team
  }

  swapRoles(other: Player) {
    const temp = this.currentRole
    this.currentRole = other.currentRole
    other.currentRole = temp
  }
}
