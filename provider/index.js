const EthereumProvider = require('ethereum-provider')
const ConnectionManager = require('../ConnectionManager')

const monitor = provider => {
  function update (status) {
    provider.status = status
    provider.emit('status', status)
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
  if (connections.injected.ethereum) return monitor(connections.injected.ethereum)
  const provider = new EthereumProvider(new ConnectionManager(connections, targets, options))
  provider.setMaxListeners(128)
  return monitor(provider)
}
