const EventEmitter = require('events')

class UnavailableConnection extends EventEmitter {
  constructor (message) {
    super()
    setTimeout(() => this.onError(new Error(message)), 0)
  }

  onError (err) {
    if (this.listenerCount('error')) this.emit('error', err)
  }
}

module.exports = message => () => new UnavailableConnection(message)
