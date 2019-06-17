const resolve = require('./resolve')
const provider = require('./provider')
const presets = require('./presets')

const WalletConnect = require('@walletconnect/browser').default
const WCQRCode = require('@walletconnect/qrcode-modal').default

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
  http: require('./connections/http')(XHR),
  walletconnect: require('./connections/walletconnect')(WalletConnect, WCQRCode)
}

module.exports = (targets = ['injected', 'frame'], options = {}) => provider(connections, resolve(targets, presets), options)
