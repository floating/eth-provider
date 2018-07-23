const EventEmitter = require('events')
const uuid = require('uuid/v4')

const dev = process.env.NODE_ENV === 'development'

let fetch

class HTTPConnection extends EventEmitter {
  constructor (_fetch, url, options) {
    super()
    fetch = _fetch
    setTimeout(() => this.create(url, options), 0)
  }
  create (url, options) {
    if (!fetch) return this.emit('error', new Error('No HTTP transport available'))
    this.connected = false
    this.ready = false
    this.subscriptions = false
    this.status = 'loading'
    this.post = {method: 'POST', headers: {'Content-Type': 'application/json'}} // Headers from options
    this.url = url
    this.pollId = uuid()
    this.initStatus()
  }
  close () {
    if (dev) console.log('Closing HTTP connection')
    clearTimeout(this.statusTimer)
    clearTimeout(this.subscriptionTimer)
    this.connected = false
    this.ready = false
    this.status = 'disconnected'
  }
  emitStatus () {
    this.emit('status', {status: this.status})
  }
  pollSubscriptions () {
    clearTimeout(this.subscriptionTimer)
    if (this.subscriptions) {
      this.send({jsonrpc: '2.0', id: 1, method: 'eth_pollSubscriptions', params: [this.pollId]}, (err, response) => {
        if (err) {
          this.emit('error', err)
        } else {
          if (response && response.result) response.result.map(p => JSON.parse(p)).forEach(p => this.emit('data', p))
          this.subscriptionTimer = setTimeout(() => this.pollSubscriptions(), 4 * 1000)
        }
      })
    }
  }
  pollStatus () {
    clearTimeout(this.statusTimer)
    if (this.status === 'syncing') {
      this.send({jsonrpc: '2.0', id: 1, method: 'eth_syncing', params: [this.pollId]}, (err, response) => {
        if (err) {
          this.emit('error', err)
        } else {
          if (!response || !response.result) {
            this.connected = true
            this.ready = true
            this.status = 'ready'
            this.emitStatus()
          } else {
            this.statusTimer = setTimeout(this.pollStatus, 30 * 1000)
          }
        }
      })
    }
  }
  initStatus () {
    this.send({jsonrpc: '2.0', method: 'eth_syncing', params: [], id: 0}, (err, response) => {
      if (err) {
        this.emit('error', err)
      } else {
        this.connected = true
        if (response.result) {
          this.ready = false
          this.status = 'syncing'
          this.pollStatus()
          this.emit('connect')
        } else {
          this.send({jsonrpc: '2.0', id: 1, method: 'eth_pollSubscriptions', params: [this.pollId]}, (err, response) => {
            if (err) { this.subscriptions = false } else { this.subscriptions = true }
            this.ready = true
            this.status = 'connected'
            this.emit('connect')
          })
        }
      }
    })
  }
  filterStatus (res) {
    if (res.status >= 200 && res.status < 300) return res
    let error = new Error(res.statusText)
    error.res = res
    throw error.message
  }
  send (payload, res) {
    if (this.status === 'closed') return res(new Error('Not connected, provider has been closed'))
    if (payload.method === 'eth_subscribe') {
      if (this.subscriptions) {
        payload.pollId = this.pollId
        this.pollSubscriptions()
      } else {
        return res(new Error('Subscriptions are not supported by this HTTP endpoint'))
      }
    }
    try { this.post.body = JSON.stringify(payload) } catch (err) { return res(err) }
    fetch(this.url, this.post)
      .then(this.filterStatus)
      .then(response => response.json())
      .then(response => res(null, response))
      .catch(err => res(err))
  }
}

module.exports = (fetch) => (url, options) => new HTTPConnection(fetch, url, options)
