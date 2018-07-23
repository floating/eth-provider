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
    if (!net) return this.emit('error', new Error('No IPC transport'))
    this.count = 0
    this.connected = false
    this.ready = false
    this.status = 'loading'
    this.resCallbacks = {}
    this.socket = net.connect({path}, () => {
      if (net.constructor.name === 'Socket') {
        oboe(this.socket).done(payloads => this.parsePayloads(payloads))
      } else {
        this.socket.on('data', data => {
          parse(data.toString(), (err, payloads) => {
            if (err) return this.errAllResCallbacks(err)
            payloads.forEach(load => {
              if (Array.isArray(load)) {
                load.forEach(payload => this.onPayload(payload))
              } else {
                this.onPayload(load)
              }
            })
          })
        })
      }
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
      this.socket.on('close', () => this.close())
    })
    this.socket.on('error', err => this.onError(err))
  }
  onError (err) {
    this.emit('error', err)
  }
  errAllResCallbacks (err) {
    Object.keys(this.resCallbacks).forEach(resId => {
      this.resCallbacks[resId](err)
      delete this.resCallbacks[resId]
    })
  }
  onTimeout () {
    this.errAllResCallbacks(new Error('Timeout error'))
  }
  onPayload (response) {
    if (!response.id && response.method && response.method.indexOf('_subscription') !== -1) {
      this.emit('data', response)
    } else if (response.id && this.resCallbacks[response.id]) {
      let resId = response.id
      let res = this.resCallbacks[resId].res
      response.id = this.resCallbacks[resId].payload.id
      res(null, response)
      delete this.resCallbacks[resId]
    } else {
      console.warn('Unrecognized socket message in provider: ', response)
    }
  }
  parsePayloads (payloads) {
    if (Array.isArray(payloads)) {
      payloads.forEach(load => this.onPayload(load))
    } else {
      this.onPayload(payloads)
    }
  }
  close () {
    if (this.status === 'closed') return
    if (dev) console.log('Closing IPC connection')
    if (this.socket) this.socket.destroy()
    this.socket = null
    this.connected = false
    this.status = 'closed'
    this.emit('close')
    this.errAllResCallbacks(new Error('IPC provider has been closed'))
  }
  send (payload, res) {
    if (!this.socket || !this.socket.writable) {
      this.ready = false
      this.connected = false
      res(new Error('Not connected'))
    } else {
      payload = Object.assign({}, payload)
      let newId = ++this.count
      this.resCallbacks[newId] = {res, payload: Object.assign({}, payload)}
      payload.id = newId
      this.socket.write(JSON.stringify(payload))
    }
  }
}

module.exports = net => (path, options) => new IPCConnection(net, path, options)
