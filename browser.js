const resolve = require('./resolve')
const provider = require('./provider')
const presets = require('./presets')

const injected = {
  ethereum: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' ? window.ethereum : null,
  web3: typeof window !== 'undefined' && typeof window.web3 !== 'undefined' ? window.web3.currentProvider : null
}
const ws = typeof window !== 'undefined' && typeof window.WebSocket !== 'undefined' ? window.WebSocket : null
const XHR = typeof window !== 'undefined' && typeof window.XMLHttpRequest !== 'undefined' ? window.XMLHttpRequest : null

if (injected.ethereum) injected.ethereum.__isProvider = true

const connections = {
  injected: injected.ethereum || require('./connections/injected')(injected.web3),
  ipc: require('./connections/unavailable')('IPC connections are unavliable in the browser'),
  ws: require('./connections/ws')(ws),
  http: require('./connections/http')(XHR)
}

module.exports = (targets, options) => {
  if (targets && !Array.isArray(targets) && typeof targets === 'object' && !options) {
    options = targets
    targets = undefined
  }
  if (!targets) targets = ['injected', 'frame']
  if (!options) options = {}

  targets = [].concat(targets)

  targets.forEach(t => {
    if (t.startsWith('alchemy') && !options.alchemyId) throw new Error('Alchemy was included as a connection target but no Alchemy project ID was passed in options e.g. { alchemyId: \'123abc\' }')
    if (t.startsWith('infura') && !options.infuraId) throw new Error('Infura was included as a connection target but no Infura project ID was passed in options e.g. { infuraId: \'123abc\' }')
  })

  const sets = presets(options)

  return provider(connections, resolve(targets, sets), options)
}
