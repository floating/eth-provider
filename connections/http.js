const EventEmitter = require('events')
const uuid = require('uuid/v4')

const dev = process.env.NODE_ENV === 'development'

let XHR

class HTTPConnection extends EventEmitter {
  constructor (_XHR, url, options) {
    super()
    XHR = _XHR
    this.connected = false
    this.subscriptions = false
    this.status = 'loading'
    this.url = url
    this.pollId = uuid()
    this.post = { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    setTimeout(() => this.create(), 0)
  }
  create () {
    if (!XHR) return this.emit('error', new Error('No HTTP transport available'))
    this.on('error', () => { if (this.connected) this.close() })
    this.init()
  }
  init () {
    this.send({ jsonrpc: '2.0', method: 'eth_syncing', params: [], id: 1 }, (err, response) => {
      if (err) return this.emit('error', err)
      this.send({ jsonrpc: '2.0', id: 1, method: 'eth_pollSubscriptions', params: [this.pollId, 'immediate'] }, (err, response) => {
        if (!err) {
          this.subscriptions = true
          this.pollSubscriptions()
        }
        this.connected = true
        this.emit('connect')
      })
    })
  }
  pollSubscriptions () {
    this.send({ jsonrpc: '2.0', id: 1, method: 'eth_pollSubscriptions', params: [this.pollId] }, (err, result) => {
      if (err) {
        this.subscriptionTimeout = setTimeout(() => this.pollSubscriptions(), 10000)
        return this.emit('error', err)
      } else {
        if (!this.closed) this.subscriptionTimeout = this.pollSubscriptions()
        if (result) result.map(p => JSON.parse(p)).forEach(p => this.emit('payload', p))
      }
    })
  }
  close () {
    if (dev) console.log('Closing HTTP connection')
    this.closed = true
    this.emit('close')
    clearTimeout(this.subscriptionTimeout)
    this.removeAllListeners()
  }
  filterStatus (res) {
    if (res.status >= 200 && res.status < 300) return res
    let error = new Error(res.statusText)
    error.res = res
    throw error.message
  }
  error (payload, message, code = -1) {
    this.emit('payload', { id: payload.id, jsonrpc: payload.jsonrpc, error: { message, code } })
  }
  send (payload, internal) {
    if (this.closed) return this.error(payload, 'Not connected')
    if (payload.method === 'eth_subscribe') {
      if (this.subscriptions) {
        payload.pollId = this.pollId
      } else {
        return this.error(payload, 'Subscriptions are not supported by this HTTP endpoint')
      }
    }
    let xhr = new XHR()
    let responded = false
    let res = (err, result) => {
      if (!responded) {
        xhr.abort()
        responded = true
        if (internal) {
          internal(err, result)
        } else {
          let { id, jsonrpc } = payload
          let load = err ? { id, jsonrpc, error: { message: err.message, code: err.code } } : { id, jsonrpc, result }
          this.emit('payload', load)
        }
      }
    }
    try { this.post.body = JSON.stringify(payload) } catch (e) { return res(e) }
    xhr.open('POST', this.url, true)
    xhr.timeout = 20000
    xhr.onerror = res
    xhr.ontimeout = res
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        try {
          let response = JSON.parse(xhr.responseText)
          res(response.error, response.result)
        } catch (e) {
          res(e)
        }
      }
    }
    xhr.send(JSON.stringify(payload))
  }
}

module.exports = XHR => (url, options) => new HTTPConnection(XHR, url, options)
