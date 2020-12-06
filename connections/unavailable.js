const EventEmitter = require('events')

class UnavailableConnection extends EventEmitter {
  constructor (message) {
    super()
    setTimeout(() => this.emit('error', new Error(message)), 0)
  }
}

module.exports = message => () => new UnavailableConnection(message)
