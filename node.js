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
  ipc = [`\\\\.\\pipe\\geth.ipc`]
}
presets.direct = ipc.concat(presets.direct)

const connections = {
  injected: require('./connections/unavailable')('Injected connections are unavliable in Node/Electron'),
  ipc: require('./connections/ipc')(net),
  ws: require('./connections/ws')(ws),
  http: require('./connections/http')(XHR)
}

module.exports = (targets = ['injected', 'frame'], options = {}) => provider(connections, resolve(targets, presets), options)
