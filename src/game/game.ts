import { createHash } from 'crypto'
// import { parentPort } from 'worker_threads'
import { InlineKeyboard } from 'grammy'

import { Player, Team, GameSettings, GameInfo } from '~/game/types'
import * as Roles from '~/game/roles'

import { Context } from '~/bot/context'
import { getForumTopicId } from '~/bot/helpers/forum'
import { sleep } from '~/game/helpers/timer'
import { deleteGame } from './helpers/game.context'

const defaultSettings: GameSettings = {
  joinTimeout: 180,
  nightTimeout: 30,
  voteTimeout: 300,

  loneWolf: false,

  roles: [
    Roles.Villager,
    Roles.Werewolf,
    Roles.Seer,
    Roles.Robber,
    Roles.Troublemaker,
    Roles.Mason,
    Roles.Drunk,
    Roles.Insomniac,
    Roles.Hunter,
    Roles.Tanner,
    Roles.Doppelganger,
  ],
  marks: [],
}

export class Game implements GameInfo {
  id: string

  createdTime: Date

  endTime: Date | undefined = undefined

  ctx: Context

  _new_players: Map<number, Player>

  _players: Map<number, Player>

  state: 'lobby' | 'starting' | 'dusk' | 'night' | 'day' | 'end'

  winners: Team[]

  settings: GameSettings

  tickRate: number = 1000

  flags = {
    killTimer: false,
  }

  timer: NodeJS.Timeout | null = null

  constructor(ctx: Context, settings: GameSettings = defaultSettings) {
    this.ctx = ctx
    this.id = createHash('sha256').update(`${this.chatId.toString()}-${Date.now()}`).digest('hex')
    this.createdTime = new Date()

    this._new_players = new Map()
    this._players = new Map()
    this.state = 'lobby'
    this.winners = []
    this.settings = settings
    this.tickRate = ctx.container.config.isDev ? 200 : this.tickRate

    this.run()
  }

  get chatId(): number {
    return this.ctx.chat?.id || 0
  }

  get topicId(): number | undefined {
    return getForumTopicId(this.ctx)
  }

  get players(): Player[] {
    return Array.from(this._players.values())
  }

  addPlayer(ctx: Context) {
    const sender = ctx.from
    if (!sender) return
    if (this._players.has(sender.id)) return
    const player: Player = {
      id: sender.id,
      name: sender.first_name,
      role: Roles.Villager,
      mark: { name: '' },
      actions: [],
    }
    this._new_players.set(sender.id, player)
    this._players.set(sender.id, player)
  }

  removePlayer(ctx: Context) {
    const sender = ctx.from
    if (!sender) return
    if (!this._players.has(sender.id)) return
    this._new_players.delete(sender.id)
    this._players.delete(sender.id)
  }

  async run() {
    const joinBtn = new InlineKeyboard().url(
      this.ctx.t('game_init.join'),
      `https://t.me/${this.ctx.me.username}?start=join${this.id}`
    )
    const joinMsg = this.ctx.reply(
      this.ctx.t('game_init', {
        user: this.ctx.from?.first_name || this.ctx.t('game_init.unknown_user'),
      }),
      {
        reply_markup: joinBtn,
      }
    )

    const countdownMsgs: (typeof joinMsg)[] = []
    // const listener: Listener = {
    //     ping: (ts: number) => {
    //         if (this._new_players.size == 0) return;
    //         const joined_players = Array.from(this._new_players.values()).map(p => p.name).join(", ");
    //         this.ctx.reply(this.ctx.t("game_init.joined_game", { users: joined_players }));
    //         this._new_players.clear();
    //     },
    //     poke: (ts: number) => {
    //         countdownMsgs.push(this.ctx.reply("poked"));
    //     }
    // }
    // const timer = new Timer(() => {
    //     this.ctx.reply(this.ctx.t("game_init.starting"))
    // }, this.settings.joinTimeout, this.tickRate, listener);

    // while (timer.running) {
    //     await sleep(10*this.tickRate);
    // }
    let count = this._players.size
    let ts = 0
    for (let i = 0; i < this.settings.joinTimeout; i++) {
      if (this.flags.killTimer) {
        this.flags.killTimer = false
        break
      }

      if (count !== this._players.size) {
        i = Math.min(i, Math.max(120, i - 30))
        count = this._players.size
      }

      if (ts % 30 === 0 && this._new_players.size > 0) {
        const joinedPlayers = Array.from(this._new_players.values())
          .map(p => p.name)
          .join(', ')
        this.ctx.reply(this.ctx.t('game_init.joined_game', { users: joinedPlayers }))
        this._new_players.clear()
      }

      if ([10, 30, 60].map(x => this.settings.joinTimeout - x).includes(i)) {
        const left = this.settings.joinTimeout - i
        if (left > 60) {
          countdownMsgs.push(
            this.ctx.reply(this.ctx.t('game_init.minutes_left', { time: Math.floor(left / 60) }), {
              reply_markup: joinBtn,
            })
          )
        } else {
          countdownMsgs.push(
            this.ctx.reply(this.ctx.t('game_init.seconds_left', { time: left }), { reply_markup: joinBtn })
          )
        }
      }

      ts++
      await sleep(this.tickRate)
    }

    this.ctx.reply(
      `${this.ctx.t('game_init.player_count', { count: this._players.size })}\n${this.players
        .map(p => p.name)
        .join('\n')}`
    )
    this.ctx.reply(this.ctx.t('game_init.starting'))

    // delete all countdown messages
    joinMsg.then(msg => this.ctx.api.deleteMessage(this.chatId, msg.message_id))
    countdownMsgs.forEach(msgPromise => msgPromise.then(msg => this.ctx.api.deleteMessage(this.chatId, msg.message_id)))

    await sleep(10 * this.tickRate)

    this.end()
  }

  async end() {
    deleteGame(this.ctx)
    this.ctx.reply(this.ctx.t('game.end'))
  }
}
