const EventEmitter = require('events')
const parse = require('../parse')
const dev = process.env.NODE_ENV === 'development'

let WebSocket

class WebSocketConnection extends EventEmitter {
  constructor (_WebSocket, url, options) {
    super()
    WebSocket = _WebSocket
    setTimeout(() => this.create(url, options), 0)
  }

  create (url, options) {
    if (!WebSocket) this.emit('error', new Error('No WebSocket transport available'))
    try { this.socket = new WebSocket(url) } catch (e) { return this.emit('error', e) }
    this.socket.addEventListener('error', err => this.emit('error', err))
    this.socket.addEventListener('open', () => {
      this.emit('connect')
      this.socket.addEventListener('message', message => {
        const data = typeof message.data === 'string' ? message.data : ''
        parse(data, (err, payloads) => {
          if (err) return //
          payloads.forEach(load => {
            if (Array.isArray(load)) {
              load.forEach(payload => this.emit('payload', payload))
            } else {
              this.emit('payload', load)
            }
          })
        })
      })
      this.socket.addEventListener('close', () => this.onClose())
    })
  }

  onClose () {
    this.socket = null
    this.closed = true
    if (dev) console.log('Closing WebSocket connection')
    this.emit('close')
    this.removeAllListeners()
  }

  close () {
    if (this.socket) {
      this.socket.close()
    } else {
      this.onClose()
    }
  }

  error (payload, message, code = -1) {
    this.emit('payload', { id: payload.id, jsonrpc: payload.jsonrpc, error: { message, code } })
  }

  send (payload) {
    if (this.socket && this.socket.readyState === this.socket.CONNECTING) {
      setTimeout(_ => this.send(payload), 10)
    } else if (!this.socket || this.socket.readyState > 1) {
      this.connected = false
      this.error(payload, 'Not connected')
    } else {
      this.socket.send(JSON.stringify(payload))
    }
  }
}

module.exports = WebSocket => (url, cb) => new WebSocketConnection(WebSocket, url, cb)
