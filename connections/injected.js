const EventEmitter = require('events')

class InjectedConnection extends EventEmitter {
  constructor (_injected, options) {
    super()
    if (_injected.web3) {
      setTimeout(() => this.emit('error', new Error('Injected provider via web3 is not supported')), 0)
    } else {
      setTimeout(() => this.emit('error', new Error('No injected provider not yet available')), 0)
    }
  }
}

module.exports = injected => options => new InjectedConnection(injected, options)
