const EventEmitter = require('events')

const parse = require('../parse')

const dev = process.env.NODE_ENV === 'development'

let WebSocket

class WebSocketConnection extends EventEmitter {
  constructor (_WebSocket, url, options) {
    super()
    WebSocket = _WebSocket
    this.count = 0
    this.connected = false
    this.ready = false
    this.status = 'loading'
    this.resCallbacks = {}
    setTimeout(() => this.create(url, options), 0)
  }
  create (url, options) {
    if (!WebSocket) this.emit('error', new Error('No WebSocket transport available'))
    try { this.socket = new WebSocket(url) } catch (e) { return this.emit('error', e) }
    this.socket.addEventListener('error', err => this.onError(err))
    this.socket.addEventListener('open', () => {
      this.socket.addEventListener('message', message => this.onMessage(message))
      this.socket.addEventListener('close', () => this.close())
      this.send({jsonrpc: '2.0', method: 'eth_syncing', params: [], id: 1}, (err, response) => {
        if (err) return this.onError(err)
        if (response.result) {
          this.ready = false
          this.status = 'syncing'
        } else {
          this.ready = true
          this.status = 'connected'
        }
        this.connected = true
        this.emit('connect')
      })
    })
  }
  close () {
    if (this.status === 'closed') return
    if (dev) console.log('Closing WebSocket connection')
    if (this.socket) this.socket.close()
    this.socket = null
    this.connected = false
    this.status = 'closed'
    this.emit('close')
  }
  onError (err) {
    this.emit('error', err)
  }
  onMessage (message) {
    let data = typeof message.data === 'string' ? message.data : ''
    parse(data, (err, payloads) => {
      if (err) return this.errAllResCallbacks(err)
      payloads.forEach(load => {
        if (Array.isArray(load)) {
          load.forEach(payload => this.onPayload(payload))
        } else {
          this.onPayload(load)
        }
      })
    })
  }
  onPayload (payload) {
    if (!payload.id && payload.method && payload.method.indexOf('_subscription') !== -1) {
      this.emit('data', payload)
    } else if (payload.id && this.resCallbacks[payload.id]) {
      let resId = payload.id
      let res = this.resCallbacks[resId].res
      payload.id = this.resCallbacks[resId].payload.id
      res(null, payload)
      delete this.resCallbacks[resId]
    } else {
      console.warn('Unrecognized socket message in provider: ', payload)
    }
  }
  onTimeout () {
    // calls all resCBs with timeout or invalid connection error, emits timeout error, Timeout all requests when the end/error event is fired
  }
  send (payload, res) {
    if (this.socket && this.socket.readyState === this.socket.CONNECTING) {
      setTimeout(_ => this.send(payload, res), 10)
    } else if (!this.socket || this.socket.readyState > 1) {
      this.ready = false
      this.connected = false
      let err = new Error('Not connected')
      res(err)
    } else {
      payload = Object.assign({}, payload)
      let newId = ++this.count
      this.resCallbacks[newId] = {res, payload: Object.assign({}, payload)}
      payload.id = newId
      this.socket.send(JSON.stringify(payload), err => { if (err) res(err) })
    }
  }
}

module.exports = WebSocket => (url, cb) => new WebSocketConnection(WebSocket, url, cb)
