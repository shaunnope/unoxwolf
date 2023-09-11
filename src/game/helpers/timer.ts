export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export type Listener = {
  ping: (ts: number) => void
  poke: (ts: number) => void
}
