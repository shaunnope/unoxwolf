import type { Context } from '~/bot/context'
import * as Roles from '~/game/roles'
import { Team, Status } from './enums'
import { GameInfo } from './game'

export type RoleInfo = {
  name: string
  team: Team
  isAide?: boolean
  descCommand: string
  priority?: number
}

export class Role {
  static readonly info: RoleInfo = {
    name: 'role',
    team: Team.None,
    descCommand: 'rolelist',
  }

  static get description() {
    return `role_desc.${this.info.name}`
  }

  static get lore() {
    return `role_message.${this.info.name}`
  }

  static get roleName() {
    return `roles.${this.info.name}`
  }

  get description() {
    return (<typeof Role>this.constructor).description
  }

  get lore() {
    return (<typeof Role>this.constructor).lore
  }

  get name() {
    return (<typeof Role>this.constructor).roleName
  }

  get info() {
    return (<typeof Role>this.constructor).info
  }

  get priority() {
    return this.info.priority || -1
  }

  status: Status = {}

  constructor(status?: Status) {
    this.status = status || this.status
  }

  /* eslint-disable class-methods-use-this */
  doDusk(player: Player, game: GameInfo) {
    // TODO: expand this and maybe remove eslint-disable
    // if (player.ctx === undefined) return
  }

  doNight(player: Player, game: GameInfo) {
    // TODO: expand this and maybe remove eslint-disable
    // if (player.ctx === undefined) return
  }

  /**
   * Attempt to lynch a player
   * @param player
   * @param game
   * @returns true if player can be lynched, false otherwise
   */
  lynch(player: Player, game: GameInfo): boolean {
    this.unalive(player, game)
    return true
  }

  /**
   * Forcibly unalive a player forcibly
   * @param player
   * @param game
   */
  unalive(player: Player, game: GameInfo) {
    player.isDead = true
  }
  /* eslint-enable class-methods-use-this */
}

export type Mark = {
  name: string
}

export class Player {
  id: number

  name: string

  role: Role

  currentRole: Role

  mark: Mark

  ctx?: Context

  votedFor?: Player

  isDead?: true

  constructor(id: number, name: string, role?: Role, ctx?: Context) {
    this.id = id
    this.name = name

    this.role = role ?? new Roles.Villager()
    this.currentRole = this.role

    this.mark = { name: 'mark' }
    this.ctx = ctx
  }

  setup(role: Role) {
    this.role = role
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
