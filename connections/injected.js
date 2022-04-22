const EventEmitter = require('events')

class InjectedConnection extends EventEmitter {
  constructor (_injected, options) {
    super()
    if (_injected) {
      setTimeout(() => this.onError(new Error('Injected web3 provider is not currently supported')), 0)
    } else {
      setTimeout(() => this.onError(new Error('No injected provider found')), 0)
    }
  }

  onError (err) {
    if (this.listenerCount('error')) this.emit('error', err)
  }
}

module.exports = injected => options => new InjectedConnection(injected, options)
