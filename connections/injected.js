const EventEmitter = require('events')

class InjectedConnection extends EventEmitter {
  constructor (_injected, url, options) {
    super()
    setTimeout(() => this.emit('error', new Error('Injected provider not yet available')), 0)
  }
}

module.exports = injected => options => new InjectedConnection(injected, options)
