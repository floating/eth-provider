const EventEmitter = require('events')

class UnavailableConnection extends EventEmitter {
  constructor (message) {
    super()
    this.closed = true
    setTimeout(() => this.emit('error', new Error(message)), 0)
  }
  close () {
    this.emit('close')
    this.removeAllListeners()
  }
}

module.exports = message => () => new UnavailableConnection(message)
