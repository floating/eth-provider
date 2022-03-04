/* global AbortController */
const EventEmitter = require('events')
const { v4: uuid } = require('uuid')

const dev = process.env.NODE_ENV === 'development'

let fetch

class HTTPConnection extends EventEmitter {
  constructor (_fetch, url, options) {
    super()
    fetch = _fetch
    this.options = options
    this.connected = false
    this.subscriptions = false
    this.status = 'loading'
    this.url = new URL(url)
    this.pollId = uuid()
    setTimeout(() => this.create(), 0)
    this._emit = (...args) => !this.closed ? this.emit(...args) : null
  }

  create () {
    if (!fetch) return this._emit('error', new Error('No HTTP transport available'))
    this.on('error', () => { if (this.connected) this.close() })
    this.init()
  }

  init () {
    this.send({ jsonrpc: '2.0', method: 'net_version', params: [], id: 1 }, (err, response) => {
      if (err) return this._emit('error', err)
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
        return this._emit('error', err)
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

    const controller = new AbortController()

    let responded = false
    const res = (err, result) => {
      if (!responded) {
        controller.abort()
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

    let timeout

    (async () => {
      try {
        const opts = {
          method: 'post',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        }
        if (this.url.protocol === 'https:') {
          const https = require('https')
          const httpsAgent = new https.Agent({
            rejectUnauthorized: false
          })
          opts.agent = httpsAgent
        }

        if (this.options.origin) {
          opts.headers.Origin = this.options.origin
        }
        timeout = setTimeout(() => {
          controller.abort()
          res(new Error('request timed out'))
        }, 60000)
        const response = await fetch(this.url, opts)
        clearTimeout(timeout)

        try {
          const data = await response.json()
          res(data.error, data.result)
        } catch (e) {
          res(e)
        }
      } catch (e) {
        clearTimeout(timeout)
        if (dev) {
          console.error('Error sending HTTP request', e)
        }

        res({ message: e.message, code: -1 })
      }
    })()
  }
}

module.exports = fetch => (url, options) => new HTTPConnection(fetch, url, options)
