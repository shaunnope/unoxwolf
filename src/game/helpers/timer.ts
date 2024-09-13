export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface Listener {
  ping: (ts: number) => void
  poke: (ts: number) => void
}
