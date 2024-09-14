import { InlineKeyboard } from "grammy"

import type { GameInfo } from "~/game/models/game"
import type { Player } from "~/game/models/player"

export class Keyboard {
  game: GameInfo
  kb: InlineKeyboard
  columns: number
  buttons: number

  constructor(game: GameInfo, columns: number = 3) {
    this.game = game
    this.columns = columns
    this.kb = new InlineKeyboard()
    this.buttons = 0
  }

  addTextButtons(buttons: [string, string | undefined][], prefix: string) {
    buttons.forEach(([text, data]) => {
      this.kb.text(text, `${prefix}${this.game.id}+${data}`)
      if (++this.buttons % this.columns === 0)
        this.kb.row()
    })

    return this
  }

  addPlayers(predicate: (option: Player) => boolean, prefix: string) {
    const options: [string, string][] = this.game.players.filter(predicate).map(player => [player.name, player.id.toString()])
    this.addTextButtons(options, prefix)

    return this
  }

  addUnassigned(prefix: string, count: number = 2) {
    this.addTextButtons(
      [[this.game.ctx.t("misc.unassigned", { count }), "un"]],
      prefix,
    )

    return this
  }

  addPass(player: Player) {
    this.addTextButtons(
      [[this.game.ctx.t("misc.pass"), player.id.toString()]],
      "pass",
    )

    return this
  }

  send(player: Player, key?: string) {
    return player.ctx?.reply(player.ctx.t(key || player.role.locale("action")), { reply_markup: this.kb })
  }
}
