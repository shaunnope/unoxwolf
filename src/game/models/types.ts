import type { Context } from "~/bot/context"
import type { Game } from "~/game"
import type { Player } from "~/game/models/player"

export interface Action {
  fallback: (game: Game, player: Player) => void
  setup: (game: Game, player: Player) => void
  fn: (game: Game, playerContext: Context, targets?: Player[]) => void
}
