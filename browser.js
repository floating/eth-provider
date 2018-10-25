const resolve = require('./resolve')
const provider = require('./provider')
const presets = require('./presets')

const injected = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' ? window.ethereum : typeof window.web3 !== 'undefined' ? window.web3.currentProvider : null
const ws = typeof window !== 'undefined' && typeof window.WebSocket !== 'undefined' ? window.WebSocket : null
const XHR = typeof window !== 'undefined' && typeof window.XMLHttpRequest !== 'undefined' ? window.XMLHttpRequest : null

const connections = {
  injected: require('./connections/injected')(injected),
  ipc: require('./connections/unavailable')('IPC connections are unavliable in the browser'),
  ws: require('./connections/ws')(ws),
  http: require('./connections/http')(XHR)
}

module.exports = (targets = ['injected', 'frame'], options = {}) => provider(connections, resolve(targets, presets), options)
