class MusicBrainzQueue {
  constructor() {
    this._queue = []
    this._running = false
    this._interval = 1100 // slightly over 1s to stay within MusicBrainz's 1 req/sec limit
  }

  add(fn) {
    return new Promise((resolve, reject) => {
      this._queue.push({ fn, resolve, reject })
      if (!this._running) this._run()
    })
  }

  async _run() {
    this._running = true
    while (this._queue.length > 0) {
      const { fn, resolve, reject } = this._queue.shift()
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

const mbQueue = new MusicBrainzQueue()

module.exports = { mbQueue }
