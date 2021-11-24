const EventEmitter = require('events')
const parse = require('../parse')
const dev = process.env.NODE_ENV === 'development'

let WebSocket

class WebSocketConnection extends EventEmitter {
  constructor (_WebSocket, url, options) {
    super()

    this.onError = this.onError.bind(this)
    this.onMessage = this.onMessage.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.onClose = this.onClose.bind(this)

    WebSocket = _WebSocket
    setTimeout(() => this.create(url, options), 0)
  }

  create (url, options) {
    if (!WebSocket) this.emit('error', new Error('No WebSocket transport available'))
    try { this.socket = new WebSocket(url, [], { origin: options.origin }) } catch (e) { return this.emit('error', e) }

    this.socket.addEventListener('error', this.onError)
    this.socket.addEventListener('open', this.onOpen)
    this.socket.addEventListener('close', this.onClose)
  }

  onOpen () {
    this.emit('connect')

    this.socket.addEventListener('message', this.onMessage)
  }

  onMessage (message) {
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
  }

  onError (err) {
    this.emit('error', err)
  }

  onClose (e) {
    clearTimeout(this.closeTimeout)

    const err = {
      reason: e ? e.reason : 'unknown',
      code: e ? e.code : 'unknown'
    }

    if (this.socket) {
      this.socket.removeEventListener('open', this.onOpen)
      this.socket.removeEventListener('close', this.onClose)
      this.socket.removeEventListener('message', this.onMessage)
      this.socket.removeEventListener('error', this.onError)
      this.socket = null
    }

    this.closed = true

    if (dev) console.log(`Closing WebSocket connection, reason: ${err.reason} (code ${err.code})`)

    this.emit('close')
    this.removeAllListeners()
  }

  close () {
    if (this.socket) {
      this.socket.close()

      // give the socket close event some time to fire, otherwise we can clean up
      // and close everything manually
      this.closeTimeout = setTimeout(() => {
        this.onClose()
      }, 1000)
    } else {
      this.onClose()
    }
  }

  error (payload, message, code = -1) {
    this.emit('payload', { id: payload.id, jsonrpc: payload.jsonrpc, error: { message, code } })
  }

  send (payload) {
    try {
      if (this.socket && this.socket.readyState === this.socket.CONNECTING) {
        setTimeout(_ => this.send(payload), 10)
      } else if (!this.socket || this.socket.readyState > 1) {
        this.connected = false
        this.error(payload, 'Not connected')
      } else {
        this.socket.send(JSON.stringify(payload))
      }
    } catch (e) {
      if (dev) console.error('Error sending Websocket request', e)

      this.error(payload, e.message)
    }
  }
}

module.exports = WebSocket => (url, cb) => new WebSocketConnection(WebSocket, url, cb)
