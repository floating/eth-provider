const EventEmitter = require('events')

const dev = process.env.NODE_ENV === 'development'

class ConnectionManager extends EventEmitter {
  constructor (connections, targets, options) {
    super()
    this.targets = targets
    this.options = options
    this.connections = connections
    this.connected = false
    this.status = 'loading'
    this.interval = options.interval || 5000
    this.name = options.name || 'default'
    this.inSetup = true
    this.connect()
  }

  connect (index = 0) {
    if (dev && index === 0) console.log(`\n\n\n\nA connection cycle started for provider with name: ${this.name}`)

    if (this.connection && this.connection.status === 'connected' && index >= this.connection.index) {
      if (dev) console.log('Stopping connection cycle becasuse we\'re already connected to a higher priority provider')
    } else if (this.targets.length === 0) {
      if (dev) console.log('No valid targets supplied')
    } else {
      const { protocol, location } = this.targets[index]
      this.connection = this.connections[protocol](location, this.options)

      const connectionErrorHandler = (err) => this.connectionError(index, err)

      this.connection.once('error', connectionErrorHandler)

      this.connection.on('connect', () => {
        this.connection.off('error', connectionErrorHandler)
        this.connection.once('error', (err) => this.onError(err))

        this.connection.once('close', () => {
          this.connected = false
          this.emitClose()
          if (!this.closing) this.refresh()
        })

        this.connection.target = this.targets[index]
        this.connection.index = index
        this.targets[index].status = this.connection.status
        this.connected = true
        this.inSetup = false
        if (dev) console.log('Successfully connected to: ' + this.targets[index].location)
        this.emit('connect')
      })

      this.connection.on('data', data => this.emit('data', data))
      this.connection.on('payload', payload => this.emit('payload', payload))
    }
  }

  onError (err) {
    if (this.listenerCount('error')) return this.emit('error', err)
    console.warn('[eth-provider] Uncaught connection error: ' + err.message)
  }

  refresh (interval = this.interval) {
    if (dev) console.log(`Reconnect queued for ${(interval / 1000).toFixed(2)}s in the future`)
    clearTimeout(this.connectTimer)
    this.connectTimer = setTimeout(() => this.connect(), interval)
  }

  connectionError (index, err) {
    if (this.connection && this.connection.close) this.connection.close()

    this.targets[index].status = err
    if (this.targets.length - 1 === index) {
      this.inSetup = false
      if (dev) console.warn('eth-provider unable to connect to any targets, view connection cycle summary: ', this.targets)
      this.refresh()
    } else { // Not last target, move on the next connection option
      this.connect(++index)
    }
  }

  emitClose () {
    this.emit('close')
  }

  close () {
    this.closing = true
    if (this.connection && this.connection.close && !this.connection.closed) {
      this.connection.close() // Let event bubble from here
    } else {
      this.emit('close')
    }
    clearTimeout(this.connectTimer)
    clearTimeout(this.setupTimer)
  }

  error (payload, message, code = -1) {
    this.emit('payload', { id: payload.id, jsonrpc: payload.jsonrpc, error: { message, code } })
  }

  send (payload) {
    if (this.inSetup) {
      this.setupTimer = setTimeout(() => this.send(payload), 100)
    } else if (this.connection.closed) {
      this.error(payload, 'Not connected', 4900)
    } else {
      this.connection.send(payload)
    }
  }
}

module.exports = ConnectionManager
