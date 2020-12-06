const EventEmitter = require('events')
const EthereumProvider = require('ethereum-provider')
const ConnectionManager = require('../ConnectionManager')

const monitor = provider => {
  function update (status) {
    provider.status = status
    if (provider instanceof EventEmitter) provider.emit('status', status)
  }
  async function check () {
    if (provider.inSetup) return setTimeout(check, 1000)
    try {
      if (await provider.send('eth_syncing')) {
        update('syncing')
        setTimeout(() => check(), 5000)
      } else {
        update('connected')
      }
    } catch (e) {
      update('disconnected')
    }
  }
  update('loading')
  check()
  provider.on('connect', () => check())
  provider.on('close', () => update('disconnected'))
  return provider
}

module.exports = (connections, targets, options) => {
  // If window.ethereum and injected is a target in any priority, return ethereum provider
  if (connections.injected.__isProvider && targets.map(t => t.type).indexOf('injected') > -1) {
    delete connections.injected.__isProvider
    return monitor(connections.injected)
  }
  const provider = new EthereumProvider(new ConnectionManager(connections, targets, options))
  provider.setMaxListeners(128)
  return monitor(provider)
}
