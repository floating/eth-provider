const net = null
const ws = typeof window !== 'undefined' && typeof window.WebSocket !== 'undefined' ? window.WebSocket : null
const fetch = typeof window !== 'undefined' && typeof window.fetch !== 'undefined' ? window.fetch : null
const injected = typeof window !== 'undefined' && typeof window.web3 !== 'undefined' ? window.web3.givenProvider : null

const resolve = require('./resolve')
const provider = require('./provider')
const presets = require('./presets')

module.exports = (targets = ['injected', 'frame'], options = {}) => {
  return provider(resolve(targets, presets), Object.assign({net, ws, fetch, injected}, options))
}
