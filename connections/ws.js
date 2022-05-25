const EventEmitter = require('events')
const parse = require('../parse')
const dev = process.env.NODE_ENV === 'development'

let WebSocket

class WebSocketConnection extends EventEmitter {
  constructor (_WebSocket, url, options) {
    super()
    this.socketListeners = []
    WebSocket = _WebSocket
    setTimeout(() => this.create(url, options), 0)
  }

  create (url, options) {
    if (!WebSocket) return this.onError(new Error('No WebSocket transport available'))
    try {
      this.socket = new WebSocket(url, [], { origin: options.origin })
    } catch (e) {
      return this.onError(e)
    }

    this.addSocketListener('error', this.onError.bind(this))
    this.addSocketListener('open', this.onOpen.bind(this))
    this.addSocketListener('close', this.onClose.bind(this))
  }

  addSocketListener (event, handler) {
    this.socket.addEventListener(event, handler)
    this.socketListeners.push({ event, handler })
  }

  removeAllSocketListeners () {
    this.socketListeners.forEach(({ event, handler }) => {
      this.socket.removeEventListener(event, handler)
    })
    this.socketListeners = []
  }

  onOpen () {
    this.emit('connect')
    this.addSocketListener('message', this.onMessage.bind(this))
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
    if (this.listenerCount('error')) this.emit('error', err)
  }

  onClose (e) {
    // onClose should only be called as a result of the socket's close event
    // OR when close() is called manually and the socket either doesn't exist or is already in a closed state
    const err = {
      reason: e ? e.reason : 'unknown',
      code: e ? e.code : 'unknown'
    }

    if (this.socket) {
      this.removeAllSocketListeners()
      this.socket = null
    }

    this.closed = true

    if (dev) console.log(`Closing WebSocket connection, reason: ${err.reason} (code ${err.code})`)

    this.emit('close')
    this.removeAllListeners()
  }

  close () {
    if (this.socket && WebSocket && this.socket.readyState !== WebSocket.CLOSED) {
      this.removeAllSocketListeners()
      this.addSocketListener('error', () => {})
      this.addSocketListener('close', this.onClose.bind(this))
      if (this.socket.terminate) {
        this.socket.terminate()
      } else {
        this.socket.close()
      }
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
