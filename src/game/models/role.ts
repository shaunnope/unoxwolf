import type { Status } from "./enums"
import type { GameInfo } from "./game"
import type { Player } from "./player"
import type { Context } from "~/bot/context"
import { isCopier } from "~/game/roles/copier"
import { Team } from "./enums"

export interface RoleInfo {
  name: string
  team: Team
  /** An aide wins along with their team, but their death does not result in a loss to their team. */
  isAide?: boolean
  command: string
  priority?: number
  mask?: string
}

export class Role {
  static readonly info: RoleInfo = {
    name: "role",
    team: Team.None,
    command: "rolelist",
  }

  static toString() {
    return this.info.name
  }

  static locale(key: string) {
    return `${this.info.name}.${key}`
  }

  static get description() {
    return this.locale("desc")
  }

  static get lore() {
    return this.locale("lore")
  }

  static get roleName() {
    return this.locale("name")
  }

  static get emoji() {
    return this.locale("emoji")
  }

  get emoji() {
    return (<typeof Role> this.constructor).emoji
  }

  get description() {
    return (<typeof Role> this.constructor).description
  }

  get locale() {
    return (<typeof Role> this.constructor).locale
  }

  get lore() {
    return (<typeof Role> this.constructor).lore
  }

  get name() {
    return (<typeof Role> this.constructor).roleName
  }

  get mask() {
    if (this.info.mask)
      return `${this.info.mask}.name`
    return this.name
  }

  get info() {
    return (<typeof Role> this.constructor).info
  }

  get priority() {
    return this.info.priority || -1
  }

  fullRole(ctx: Context): string {
    return isCopier(this) && this.copiedRole !== undefined
      ? `${ctx.t(this.tail.name)}${ctx.t(this.emoji)}`
      : ctx.t(this.name)
  }

  status: Status = {}

  constructor(status?: Status) {
    this.status = status || this.status
  }

  doDusk(_player: Player, _game: GameInfo) {
    // if (player.ctx === undefined) return
  }

  doNight(_player: Player, _game: GameInfo) {
    // if (player.ctx === undefined) return
  }

  /**
   * Attempt to lynch a player
   * @param player
   * @param game
   * @returns true if player was successfully lynched, false otherwise
   */
  lynch(player: Player, game: GameInfo): boolean {
    this.unalive(player, game)
    return true
  }

  /**
   * Forcibly unalive a player
   * @param player
   * @param game
   * @returns false if player is already dead, true otherwise
   */
  unalive(player: Player, game: GameInfo) {
    if (player.isDead)
      return false
    player.isDead = true
    if (player.current.info.isAide)
      return true
    const teamDeaths = game.deaths.get(player.current.info.team)
    if (teamDeaths === undefined)
      game.deaths.set(player.current.info.team, [player])
    else teamDeaths.push(player)

    return true
  }

  /**
   * Check win condition of a player
   * @param player
   * @param game
   */
  checkWin(player: Player, game: GameInfo): void {
    player.won = game.winInfo[this.info.team]
  }
}
