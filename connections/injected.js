const EventEmitter = require('events')

class InjectedConnection extends EventEmitter { // Future polyfill?
  constructor () {
    super()
    setTimeout(() => this.emit('error', new Error('No injected provider available')), 0)
  }
}

module.exports = injected => options => {
  if (injected) {
    return injected
  } else {
    return new InjectedConnection()
  }
}
