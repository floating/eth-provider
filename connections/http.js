const EventEmitter = require('events')
const { v4: uuid } = require('uuid')

const dev = process.env.NODE_ENV === 'development'

let XHR

class HTTPConnection extends EventEmitter {
  constructor (_XHR, url, options) {
    super()
    XHR = _XHR
    this.options = options
    this.connected = false
    this.subscriptions = false
    this.status = 'loading'
    this.url = url
    this.pollId = uuid()
    setTimeout(() => this.create(), 0)
    this._emit = (...args) => !this.closed ? this.emit(...args) : null
  }

  onError (err) {
    if (!this.closed && this.listenerCount('error')) this.emit('error', err)
  }

  create () {
    if (!XHR) return this.onError(new Error('No HTTP transport available'))
    this.on('error', () => { if (this.connected) this.close() })
    this.init()
  }

  init () {
    this.send({ jsonrpc: '2.0', method: 'net_version', params: [], id: 1 }, (err, response) => {
      if (err) return this.onError(err)
      this.connected = true
      this._emit('connect')
      this.send({ jsonrpc: '2.0', id: 1, method: 'eth_pollSubscriptions', params: [this.pollId, 'immediate'] }, (err, response) => {
        if (!err) {
          this.subscriptions = true
          this.pollSubscriptions()
        }
      })
    })
  }

  pollSubscriptions () {
    this.send({ jsonrpc: '2.0', id: 1, method: 'eth_pollSubscriptions', params: [this.pollId] }, (err, result) => {
      if (err) {
        this.subscriptionTimeout = setTimeout(() => this.pollSubscriptions(), 10000)
        return this.onError(err)
      } else {
        if (!this.closed) this.subscriptionTimeout = this.pollSubscriptions()
        if (result) {
          result.map(p => {
            let parse
            try { parse = JSON.parse(p) } catch (e) { parse = false }
            return parse
          }).filter(n => n).forEach(p => this._emit('payload', p))
        }
      }
    })
  }

  close () {
    if (dev) console.log('Closing HTTP connection')

    clearTimeout(this.subscriptionTimeout)

    this._emit('close')
    this.closed = true
    this.removeAllListeners()
  }

  filterStatus (res) {
    if (res.status >= 200 && res.status < 300) return res
    const error = new Error(res.statusText)
    error.res = res
    throw error.message
  }

  error (payload, message, code = -1) {
    this._emit('payload', { id: payload.id, jsonrpc: payload.jsonrpc, error: { message, code } })
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

    const xhr = new XHR()
    let responded = false
    const res = (err, result) => {
      if (!responded) {
        xhr.abort()
        responded = true
        if (internal) {
          internal(err, result)
        } else {
          const { id, jsonrpc } = payload
          const load = err ? { id, jsonrpc, error: { message: err.message, code: err.code } } : { id, jsonrpc, result }
          this._emit('payload', load)
        }
      }
    }

    try {
      xhr.open('POST', this.url, true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      // Below not working becasue XHR lib blocks it claiming "restricted header"
      // if (this.options.origin) xhr.setRequestHeader('Origin', this.options.origin)
      xhr.timeout = 60 * 1000
      xhr.onerror = res
      xhr.ontimeout = res
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          try {
            const response = JSON.parse(xhr.responseText)
            res(response.error, response.result)
          } catch (e) {
            res(e)
          }
        }
      }
      xhr.send(JSON.stringify(payload))
    } catch (e) {
      if (dev) console.error('Error sending HTTP request', e)

      res({ message: e.message, code: -1 })
    }
  }
}

module.exports = XHR => (url, options) => new HTTPConnection(XHR, url, options)
