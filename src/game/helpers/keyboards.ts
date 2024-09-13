import { InlineKeyboard } from "grammy"

import type { Player } from "~/game/models/player"

export function getOptions<T>(options: T[], predicate: (option: T) => boolean) {
  // TODO: check if options is empty
  return options.filter(predicate)
}

export function createVoteKB<T extends Player>(options: T[], prefix: string = "vote", columns: number = 3) {
  const kb = new InlineKeyboard()

  let count = 0
  options.forEach((option) => {
    kb.text(option.name, `${prefix}+${option.id}`)
    if (++count % columns === 0)
      kb.row()
  })

  return kb
}

export function sendActionPrompt(player: Player, keyboard?: InlineKeyboard, key?: string) {
  return player.ctx?.reply(player.ctx.t(key || player.role.locale("action")), { reply_markup: keyboard })
}
