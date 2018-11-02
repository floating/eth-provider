const getProtocol = location => {
  if (location === 'injected') return 'injected'
  if (location.endsWith('.ipc')) return 'ipc'
  if (location.startsWith('wss://') || location.startsWith('ws://')) return 'ws'
  if (location.startsWith('https://') || location.startsWith('http://')) return 'http'
  return ''
}

module.exports = (targets, presets) => {
  return [].concat(...[].concat(targets).map(provider => {
    if (presets[provider]) {
      return presets[provider].map(location => ({ type: provider, location, protocol: getProtocol(location) }))
    } else {
      return { type: 'custom', location: provider, protocol: getProtocol(provider) }
    }
  })).filter(provider => {
    if (provider.protocol || provider.type === 'injected') {
      return true
    } else {
      console.log('eth-provider | Invalid provider preset/location: "' + provider.location + '"')
      return false
    }
  })
}
