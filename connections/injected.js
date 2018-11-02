const EventEmitter = require('events')

class InjectedConnection extends EventEmitter {
  constructor (_injected, options) {
    super()
    if (_injected) {
      setTimeout(() => this.emit('error', new Error('Injected web3 provider is not currently supported')), 0)
    } else {
      setTimeout(() => this.emit('error', new Error('No injected provider found')), 0)
    }
  }
}

module.exports = injected => options => new InjectedConnection(injected, options)
