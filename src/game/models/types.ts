import type { Context } from '~/bot/context'
import type { Game } from '~/game'
import { Player } from '~/game/models/player'

export type Action = {
  fallback: (game: Game, player: Player) => void
  setup: (game: Game, player: Player) => void
  fn: (game: Game, playerContext: Context, targets?: Player[]) => void
}
