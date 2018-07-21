const EventEmitter = require('events')
const connections = require('./connections')

const dev = process.env.NODE_ENV === 'development'

class EthereumProvider extends EventEmitter {
  constructor (targets, options) {
    super()
    this.targets = targets
    this.connections = {
      injected: connections['injected'](options.injected),
      ipc: connections['ipc'](options.net),
      ws: connections['ws'](options.ws),
      http: connections['http'](options.fetch)
    }
    this.connected = false
    this.status = 'loading'
    this.name = options.name || 'default'
    this.inSetup = true
    this.connect()
  }
  summary () {
    return {target: this.target, status: this.status, details: this.targets}
  }
  refresh (timeout = 5000) {
    if (dev) console.log(`Reconnect queued for ${(timeout / 1000).toFixed(2)}s in the future`)
    clearTimeout(this.connectTimer)
    this.connectTimer = setTimeout(() => this.connect(), timeout)
  }
  onError (err) {
    if (dev) console.warn('An error event: ', err.message)
    if (this.listenerCount('error')) this.emit('error', err)
  }
  connect (index = 0) {
    if (this.status === 'disconnected') this.status = 'loading'
    if (dev && index === 0) console.log(`\n\n\n\nA connection cycle started for provider with name: ${this.name}`)
    if (this.connection && this.connection.status === 'connected' && index >= this.connection.index) {
      if (dev) console.log('Stopping connection cycle becasuse we\'re already connected to a higher priority provider')
    } else {
      if (dev) console.log('Trying to connect to: ' + this.targets[index].location)
      let {protocol, location} = this.targets[index]
      this.connection = this.connections[protocol](location)
      let connectionError = err => {
        this.targets[index].status = err
        if (this.targets.length - 1 === index) {
          this.inSetup = false
          this.status = 'disconnected'
          console.warn('eth-provider unable to connect to any targets')
          if (dev) console.log('Connection cycle summary:', this.targets)
          this.refresh()
        } else { // Not last target, move on the next connection option
          this.connect(++index)
        }
      }
      this.connection.on('error', err => {
        if (!this.connected) return connectionError(err)
        this.onError(err)
      })
      this.connection.on('close', (summary) => {
        this.connected = false
        this.status = 'disconnected'
        if (this.connection) this.connection.close()
        this.connection.removeAllListeners()
        this.connection = null
        this.emit('close')
        this.refresh()
      })
      this.connection.on('connect', () => {
        this.connection.target = this.targets[index]
        this.connection.index = index
        this.targets[index].status = this.connection.status
        this.connected = true
        this.inSetup = false
        this.status = this.connection.status
        if (dev) console.log('Successfully connected to: ' + this.targets[index].location)
        this.emit('connect')
      })
      this.connection.on('data', data => this.emit('data', data))
    }
  }
  close () {
    if (this.connection) this.connection.close()
    clearTimeout(this.connectTimer)
    this.removeAllListeners()
  }
  sendAsync (payload, res) {
    if (this.inSetup) {
      setTimeout(() => this.sendAsync(payload, res), 100)
    } else if (this.connection && this.connection.ready) {
      this.connection.send(payload, res)
    } else {
      res(new Error('Not connected'))
    }
  }
}

module.exports = (targets, options) => {
  const provider = new EthereumProvider(targets, options)
  provider.setMaxListeners(128)
  return provider
}
