const EventEmitter = require('events')
const oboe = require('oboe')
const parse = require('../parse')
const dev = process.env.NODE_ENV === 'development'

let net

class IPCConnection extends EventEmitter {
  constructor (_net, path, options) {
    super()
    net = _net
    setTimeout(() => this.create(path, options), 0)
  }

  create (path, options) {
    if (!net) return this.onError(new Error('No IPC transport'))
    this.socket = net.connect({ path })
    this.socket.on('connect', () => {
      this.emit('connect')
      this.socket.on('close', () => {
        if (this.socket) this.socket.destroy()
        this.onClose()
      })
      if (net.constructor.name === 'Socket') {
        oboe(this.socket).done(payloads => this.emitPayloads(payloads))
      } else {
        this.socket.on('data', data => parse(data.toString(), (err, payloads) => { if (!err) this.emitPayloads(payloads) }))
      }
    })
    this.socket.on('error', err => this.onError(err))
  }

  onError (err) {
    if (this.listenerCount('error')) this.emit('error', err)
  }

  onClose () {
    this.socket = null
    this.closed = true
    if (dev) console.log('Closing IPC connection')
    this.emit('close')
    this.removeAllListeners()
  }

  close () {
    if (this.socket) {
      this.socket.destroy()
    } else {
      this.onClose()
    }
  }

  emitPayloads (payloads) {
    payloads.forEach(load => {
      if (Array.isArray(load)) return load.forEach(payload => this.emit('payload', payload))
      this.emit('payload', load)
    })
  }

  error (payload, message, code = -1) {
    this.emit('payload', Object.assign(payload, { error: { message, code } }))
  }

  send (payload) {
    if (!this.socket || !this.socket.writable) {
      this.error(payload, 'Not connected')
    } else {
      try {
        this.socket.write(JSON.stringify(Object.assign({}, payload)))
      } catch (e) {
        this.error(payload, e.message)
      }
    }
  }
}

module.exports = net => (path, options) => new IPCConnection(net, path, options)
