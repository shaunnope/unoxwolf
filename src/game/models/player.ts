import type { Context } from '~/bot/context'
import * as Roles from '~/game/roles'
import { Team, Status } from './enums'
import { GameInfo } from './game'

export type RoleInfo = {
  name: string
  team: Team
  isAide?: boolean
  command: string
  priority?: number
}

export class Role {
  static readonly info: RoleInfo = {
    name: 'role',
    team: Team.None,
    command: 'rolelist',
  }

  static locale(key: string) {
    return `${this.info.name}.${key}`
  }

  static get description() {
    return this.locale('desc')
  }

  static get lore() {
    return this.locale('lore')
  }

  static get roleName() {
    return this.locale('name')
  }

  static get emoji() {
    return this.locale('emoji')
  }

  get emoji() {
    return (<typeof Role>this.constructor).emoji
  }

  get description() {
    return (<typeof Role>this.constructor).description
  }

  get locale() {
    return (<typeof Role>this.constructor).locale
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
   * @returns false if player is already dead, true otherwise
   */
  unalive(player: Player, game: GameInfo) {
    if (player.isDead) return false
    player.isDead = true
    if (player.currentRole.info.isAide) return true
    const teamDeaths = game.deaths.get(player.currentRole.info.team)
    if (teamDeaths === undefined) game.deaths.set(player.currentRole.info.team, [player])
    else teamDeaths.push(player)

    return true
  }

  /**
   * Check win condition of a player
   * @param player
   * @param game
   */
  checkWin(player: Player, game: GameInfo): void {
    player.won = (game.deaths.get(Team.Werewolf)?.length || 0) > 0
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

  won?: boolean

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
