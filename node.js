const resolve = require('./resolve')
const provider = require('./provider')
const presets = require('./presets')

const net = require('net')
const ws = require('ws')
const XHR = require('xhr2-cookies').XMLHttpRequest

const home = require('os').homedir()

let ipc = []
if (process.platform === 'darwin') {
  ipc = [`${home}/Library/Ethereum/geth.ipc`, `${home}/Library/Ethereum/rinkeby/geth.ipc`]
} else if (process.platform === 'freebsd' || process.platform === 'linux' || process.platform === 'sunos') {
  ipc = [`${home}/.ethereum/geth.ipc`, `${home}/.ethereum/rinkeby/geth.ipc`]
} else if (process.platform === 'win32') {
  ipc = ['\\\\.\\pipe\\geth.ipc']
}

const connections = {
  injected: require('./connections/unavailable')('Injected connections are unavliable in Node/Electron'),
  ipc: require('./connections/ipc')(net),
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
  sets.direct = ipc.concat(sets.direct)

  return provider(connections, resolve(targets, sets), options)
}
