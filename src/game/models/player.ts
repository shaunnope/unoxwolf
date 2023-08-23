import type { Context } from '~/bot/context'
import type { Action, Role, Mark, Player as PlayerType } from './types'

export class Player implements PlayerType {
  id: number

  name: string

  role: Role

  mark: Mark

  actions: Action[]

  ctx?: Context

  constructor(id: number, name: string, role: Role, mark: Mark, ctx?: Context) {
    this.id = id
    this.name = name
    this.role = role
    this.mark = mark
    this.actions = role.actions
    this.ctx = ctx
  }
}
