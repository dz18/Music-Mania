class MusicBrainzQueue {
  private _queue: { fn: () => Promise<any>; resolve: (value: any) => void; reject: (reason?: any) => void }[]
  private _running: boolean
  private _interval: number

  constructor() {
    this._queue = []
    this._running = false
    this._interval = 1100
  }

  add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this._queue.push({ fn, resolve, reject })
      if (!this._running) this._run()
    })
  }

  async _run(): Promise<void> {
    this._running = true
    while (this._queue.length > 0) {
      const { fn, resolve, reject } = this._queue.shift()!
      try {
        resolve(await fn())
      } catch (err) {
        reject(err)
      }
      if (this._queue.length > 0) {
        await new Promise(r => setTimeout(r, this._interval))
      }
    }
    this._running = false
  }
}

export const mbQueue = new MusicBrainzQueue()