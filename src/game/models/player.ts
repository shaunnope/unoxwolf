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
    team: Team.Village,
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

  status: Status = Status.NORMAL

  /* eslint-disable class-methods-use-this */
  doNight(player: Player, game: GameInfo) {
    // TODO: expand this and maybe remove eslint-disable
    // if (player.ctx === undefined) return
  }
  /* eslint-enable class-methods-use-this */
}

export type Mark = {
  name: string
}

export class Player {
  id: number

  name: string

  role: Role = new Roles.Villager()

  currentRole: Role

  mark: Mark

  ctx?: Context

  constructor(id: number, name: string, PlayerRole?: typeof Role, ctx?: Context) {
    this.id = id
    this.name = name

    if (PlayerRole !== undefined && PlayerRole !== Roles.Villager) {
      this.role = new PlayerRole()
    }
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
