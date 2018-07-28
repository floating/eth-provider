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
    this.post = {method: 'POST', headers: {'Content-Type': 'application/json'}}
    setTimeout(() => this.create(), 0)
  }
  create () {
    if (!XHR) return this.emit('error', new Error('No HTTP transport available'))
    this.on('error', () => { if (this.connected) this.close() })
    this.initStatus()
  }
  close () {
    if (this.status === 'closed') return
    if (dev) console.log('Closing HTTP connection')
    clearTimeout(this.statusTimer)
    clearTimeout(this.subscriptionTimer)
    this.connected = false
    this.status = 'closed'
    this.emit('close')
    this.removeAllListeners()
  }
  setStatus (status) {
    if (this.status !== status) {
      this.status = status
      this.emit('status', this.status)
    }
  }
  pollSubscriptions () {
    clearTimeout(this.subscriptionTimer)
    if (this.subscriptions) {
      this.subscriptionTimer = setTimeout(() => this.pollSubscriptions(), 4000)
      this.send({jsonrpc: '2.0', id: 1, method: 'eth_pollSubscriptions', params: [this.pollId]}, (err, response) => {
        if (err) return this.emit('error', err)
        if (response && response.result) response.result.map(p => JSON.parse(p)).forEach(p => this.emit('data', p))
      })
    }
  }
  pollStatus () {
    clearTimeout(this.statusTimer)
    this.statusTimer = setTimeout(() => this.pollStatus(), 4000)
    if (this.status === 'syncing') {
      this.send({jsonrpc: '2.0', id: 1, method: 'eth_syncing', params: []}, (err, response) => {
        if (err) return this.emit('error', err)
        if (response.result) return this.setStatus('syncing')
        this.send({jsonrpc: '2.0', id: 1, method: 'net_version', params: []}, (err, response) => {
          if (err) return this.emit('error', err)
          this.setStatus('connected')
        })
      })
    } else {
      this.send({jsonrpc: '2.0', id: 1, method: 'net_version', params: []}, (err, response) => {
        if (err) return this.emit('error', err)
        this.setStatus('connected')
      })
    }
  }
  initStatus () {
    this.send({jsonrpc: '2.0', method: 'eth_syncing', params: [], id: 1}, (err, response) => {
      if (err) return this.emit('error', err)
      this.connected = true
      this.pollStatus()
      if (response.result) {
        this.setStatus('syncing')
        this.emit('connect')
      } else {
        this.send({jsonrpc: '2.0', id: 1, method: 'eth_pollSubscriptions', params: [this.pollId]}, (err, response) => {
          if (err) { this.subscriptions = false } else { this.subscriptions = true }
          this.setStatus('connected')
          this.emit('connect')
        })
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
    if (this.status === 'closed') return res(new Error('Not connected, connection has been closed'))
    if (payload.method === 'eth_subscribe') {
      if (this.subscriptions) {
        payload.pollId = this.pollId
        this.pollSubscriptions()
      } else {
        return res(new Error('Subscriptions are not supported by this HTTP endpoint'))
      }
    }
    try { this.post.body = JSON.stringify(payload) } catch (err) { return res(err) }
    let xhr = new XHR()
    xhr.open('POST', this.url, true)
    xhr.timeout = 20000
    xhr.ontimeout = () => {
      let err = new Error('HTTP Timeout')
      res(err)
      this.emit('error', err)
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        try {
          let response = JSON.parse(xhr.responseText)
          if (response.error) return res(new Error(response.error))
          res(null, response)
        } catch (e) {
          res(new Error(e))
        }
      }
    }
    xhr.send(JSON.stringify(payload))
  }
}

module.exports = (XHR) => (url, options) => new HTTPConnection(XHR, url, options)
