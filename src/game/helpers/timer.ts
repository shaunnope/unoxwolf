export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export type Listener = {
  ping: (ts: number) => void
  poke: (ts: number) => void
}

export class Timer {
  id: NodeJS.Timeout

  fn: () => void

  tickRate: number = 1000

  duration: number

  running: boolean = true

  listener?: Listener

  private _start: number

  constructor(callback: () => void, interval: number, tickRate?: number, listener?: Listener) {
    this.tickRate = tickRate || this.tickRate
    this.duration = interval
    this.listener = listener
    this.fn = () => {
      if (this.duration <= 30) {
        this.running = false
        callback()
        return
      }
      this.duration -= 30
      this.id = setTimeout(this.fn, 30 * this.tickRate)
    }
    this.id = setTimeout(callback, this.duration * this.tickRate)
    this.fn = callback
    this._start = Date.now()
  }

  extend(interval: number = 30) {
    clearTimeout(this.id)
    const elapsed = Date.now() - this._start
    this.duration += interval * 1000
    this.id = setTimeout(this.fn, this.duration - elapsed)
  }
}
