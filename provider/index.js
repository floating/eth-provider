const EventEmitter = require('events')

const dev = process.env.NODE_ENV === 'development'

class EthereumProvider extends EventEmitter {
  constructor (connections, targets, options) {
    super()
    this.targets = targets
    this.connections = connections
    this.connected = false
    this.status = 'loading'
    this.name = options.name || 'default'
    this.inSetup = true
    this.firstCycle = true
    this.connect()
  }
  refresh (timeout = 1000) {
    if (dev) console.log(`Reconnect queued for ${(timeout / 1000).toFixed(2)}s in the future`)
    clearTimeout(this.connectTimer)
    this.connectTimer = setTimeout(() => this.connect(), timeout)
  }
  onError (err) {
    if (dev) console.warn('An error event: ', err.message)
    if (this.listenerCount('error')) this.emit('error', err)
  }
  updateStatus (status) {
    this.status = status
    this.emit('status', status)
  }
  connect (index = 0) {
    if (dev && index === 0) console.log(`\n\n\n\nA connection cycle started for provider with name: ${this.name}`)
    if (this.connection && this.connection.status === 'connected' && index >= this.connection.index) {
      if (dev) console.log('Stopping connection cycle becasuse we\'re already connected to a higher priority provider')
    } else if (this.targets.length === 0) {
      if (dev) console.log('No valid targets supplied')
    } else {
      if (dev) console.log('Trying to connect to: ' + this.targets[index].location)
      let {protocol, location} = this.targets[index]
      this.connection = this.connections[protocol](location)
      let connectionError = err => {
        this.targets[index].status = err
        if (this.targets.length - 1 === index) {
          this.inSetup = false
          if (dev) console.warn('eth-provider unable to connect to any targets, view connection cycle summary: ', this.targets)
          this.updateStatus('disconnected')
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
        this.updateStatus('disconnected')
        if (this.connection) this.connection.close()
        this.connection.removeAllListeners()
        this.connection = null
        this.emit('close')
        this.refresh()
      })
      this.connection.on('status', status => this.updateStatus(status))
      this.connection.on('connect', () => {
        this.connection.target = this.targets[index]
        this.connection.index = index
        this.targets[index].status = this.connection.status
        this.connected = true
        this.inSetup = false
        this.updateStatus(this.connection.status)
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
    } else if (this.connection && this.connection.status === 'connected') {
      this.connection.send(payload, res)
    } else {
      res(new Error('Not connected'))
    }
  }
}

module.exports = (connections, targets, options) => {
  const provider = new EthereumProvider(connections, targets, options)
  provider.setMaxListeners(128)
  return provider
}
