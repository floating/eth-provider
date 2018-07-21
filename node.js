const net = require('net')
const ws = require('ws')
const fetch = require('node-fetch')
const injected = null

const resolve = require('./resolve')
const provider = require('./provider')
const presets = require('./presets')

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

module.exports = (targets = ['frame', 'direct'], options = {}) => {
  return provider(resolve(targets, presets), Object.assign({net, ws, fetch, injected}, options))
}
