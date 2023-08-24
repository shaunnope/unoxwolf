import { InlineKeyboard } from 'grammy'

import { Player } from '~/game/models/player'

export const createOptions = (options: Player[], predicate: (option: Player) => boolean) => {
  // TODO: check if options is empty
  return options.filter(predicate)
}

export const createVoteKB = (options: Player[], prefix: string = 'vote', columns: number = 3) => {
  const kb = new InlineKeyboard()

  let count = 0
  options.forEach(option => {
    kb.text(option.name, `${prefix}+${option.id}`)
    if (++count % columns === 0) kb.row()
  })

  return kb
}
