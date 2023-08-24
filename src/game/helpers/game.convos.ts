import { InlineKeyboard } from 'grammy'

import { Player } from '~/game/models/player'

export const createOptions = (options: Player[], predicate: (option: Player) => boolean) => {
  return options.filter(predicate)
}

export const createVoteKB = (
  options: Player[],
  predicate: (option: Player) => boolean,
  prefix: string = 'vote',
  columns: number = 3
) => {
  const kb = new InlineKeyboard()

  let count = 0
  options.forEach(option => {
    if (!predicate(option)) return
    kb.text(option.name, `${prefix}+${option.id}`)
    if (++count % columns === 0) kb.row()
  })

  return kb
}
