const EventEmitter = require('events')
const EthereumProvider = require('ethereum-provider').default
const ConnectionManager = require('../ConnectionManager')

const monitor = provider => {
  function update (status) {
    provider.status = status
    if (provider instanceof EventEmitter) provider.emit('status', status)
  }

  async function checkSyncing () {
    try {
      if (await provider.send('eth_syncing')) {
        update('syncing')
      }
    } catch (e) {
      // don't do anything if it can't be determined whether the node is syncing or not
    }
  }

  async function checkConnected () {
    if (provider.inSetup) return setTimeout(checkConnected, 1000)

    try {
      await provider.send('eth_chainId')
      update('connected')

      setTimeout(checkSyncing, 500)
    } catch (e) {
      update('disconnected')
    }
  }

  update('loading')
  checkConnected()
  provider.on('connect', () => checkConnected())
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
